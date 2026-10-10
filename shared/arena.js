// A playable arena cut out of the region around a chosen point: buildings, roads, barriers,
// terrain, collision grid and ray casting. Deterministic: client and server build the same arena.
import { elevation, levelsOf, ROAD, pointInPoly, polyArea } from './region.js';
import { MAP_SIZES } from './constants.js';

const CELL = 4;
const NEAR = 45; // buildings this far outside the play area are still built in detail

export function buildArena(region, index, { cx, cz, size }) {
  cx = Math.round(cx * 2) / 2; cz = Math.round(cz * 2) / 2;
  const S = typeof size === 'number' ? size : MAP_SIZES[size] || 240;
  const half = S / 2;
  const baseElev = elevation(region, cx, cz);
  const ground = (x, z) => elevation(region, cx + x, cz + z) - baseElev;
  const ext = half + NEAR;
  const q = index.query(cx - ext, cz - ext, cx + ext, cz + ext);

  const toLocal = (pts) => {
    const out = new Float32Array(pts.length);
    for (let i = 0; i < pts.length; i += 2) { out[i] = pts[i] - cx; out[i + 1] = pts[i + 1] - cz; }
    return out;
  };

  const arena = {
    cx, cz, size: S, half, baseElev, ground,
    buildings: [], barriers: [], roads: [], areas: [], points: [],
    segs: [], props: [], cells: new Map(), cellSize: CELL,
  };

  for (const i of q.b) {
    const b = region.buildings[i];
    const pts = toLocal(b.pts);
    let minG = Infinity, maxG = -Infinity;
    for (let k = 0; k < pts.length; k += 2) { const g = ground(pts[k], pts[k + 1]); minG = Math.min(minG, g); maxG = Math.max(maxG, g); }
    let mnx = Infinity, mnz = Infinity, mxx = -Infinity, mxz = -Infinity;
    for (let k = 0; k < pts.length; k += 2) { mnx = Math.min(mnx, pts[k]); mxx = Math.max(mxx, pts[k]); mnz = Math.min(mnz, pts[k + 1]); mxz = Math.max(mxz, pts[k + 1]); }
    const base = minG - 0.4;
    const area = Math.abs(polyArea(pts));
    arena.buildings.push({
      id: i, kind: b.kind, roof: b.roof, color: b.color, pts, base, ground: (minG + maxG) / 2,
      height: b.height, top: maxG + b.height, levels: levelsOf(b), area,
      minX: mnx, minZ: mnz, maxX: mxx, maxZ: mxz, ccw: polyArea(pts) > 0,
    });
  }
  for (const i of q.r) {
    const r = region.roads[i];
    const pts = toLocal(r.pts);
    if (r.kind === ROAD.WALL || r.kind === ROAD.FENCE) {
      arena.barriers.push({ id: i, kind: r.kind, pts, height: r.kind === ROAD.WALL ? 1.9 : 1.6 });
    } else if (!(r.flags & 4)) { // skip tunnels
      arena.roads.push({ id: i, kind: r.kind, width: r.width, lanes: r.lanes, flags: r.flags, name: r.name, pts });
    }
  }
  for (const i of q.a) { const a = region.areas[i]; arena.areas.push({ id: i, kind: a.kind, pts: toLocal(a.pts) }); }
  for (const i of q.p) { const p = region.points[i]; arena.points.push({ kind: p.kind, x: p.x - cx, z: p.z - cz }); }

  // ---- collision structures
  const cellKey = (ix, iz) => ix * 73856093 ^ iz * 19349663;
  const cellAdd = (list, minX, minZ, maxX, maxZ, v) => {
    for (let iz = Math.floor(minZ / CELL); iz <= Math.floor(maxZ / CELL); iz++)
      for (let ix = Math.floor(minX / CELL); ix <= Math.floor(maxX / CELL); ix++) {
        const k = cellKey(ix, iz);
        let c = arena.cells.get(k);
        if (!c) arena.cells.set(k, (c = { s: [], b: [], p: [] }));
        c[list].push(v);
      }
  };
  arena.cellKey = cellKey;
  arena.cellAdd = cellAdd;
  const addSeg = (ax, az, bx, bz, base, top, bld) => {
    const dx = bx - ax, dz = bz - az, len = Math.hypot(dx, dz);
    if (len < 0.01) return;
    const s = { ax, az, bx, bz, len, ux: dx / len, uz: dz / len, base, top, bld };
    const id = arena.segs.length;
    arena.segs.push(s);
    cellAdd('s', Math.min(ax, bx), Math.min(az, bz), Math.max(ax, bx), Math.max(az, bz), id);
  };
  arena.buildings.forEach((b, bi) => {
    const p = b.pts, n = p.length / 2;
    for (let k = 0; k < n; k++) {
      const j = (k + 1) % n;
      addSeg(p[k * 2], p[k * 2 + 1], p[j * 2], p[j * 2 + 1], b.base, b.top, bi);
    }
    cellAdd('b', b.minX, b.minZ, b.maxX, b.maxZ, bi);
  });
  for (const w of arena.barriers) {
    const p = w.pts;
    for (let k = 0; k + 3 < p.length; k += 2) {
      const g = Math.min(ground(p[k], p[k + 1]), ground(p[k + 2], p[k + 3]));
      addSeg(p[k], p[k + 1], p[k + 2], p[k + 3], g - 0.3, g + w.height, -1);
    }
  }
  return arena;
}

// ---------------------------------------------------------------- props
// prop: { type, x, z, a (angle), hx, hz, y0, y1, r (cylinder radius, optional), v (visual variant) }
export function addProps(arena, props) {
  for (const p of props) {
    const id = arena.props.length;
    p.cos = Math.cos(p.a || 0); p.sin = Math.sin(p.a || 0);
    if (p.r) { p.bx = p.r; p.bz = p.r; }
    else { p.bx = Math.abs(p.hx * p.cos) + Math.abs(p.hz * p.sin); p.bz = Math.abs(p.hx * p.sin) + Math.abs(p.hz * p.cos); }
    arena.props.push(p);
    if (p.solid !== false) arena.cellAdd('p', p.x - p.bx, p.z - p.bz, p.x + p.bx, p.z + p.bz, id);
  }
}

export function cellsAround(arena, minX, minZ, maxX, maxZ) {
  const out = [];
  for (let iz = Math.floor(minZ / CELL); iz <= Math.floor(maxZ / CELL); iz++)
    for (let ix = Math.floor(minX / CELL); ix <= Math.floor(maxX / CELL); ix++) {
      const c = arena.cells.get(arena.cellKey(ix, iz));
      if (c) out.push(c);
    }
  return out;
}

// local box coords of a world point relative to an OBB prop
function toPropLocal(p, x, z) {
  const dx = x - p.x, dz = z - p.z;
  return [dx * p.cos + dz * p.sin, -dx * p.sin + dz * p.cos];
}

// Push a vertical cylinder (x,z,r) spanning [y0,y1] out of the world. Returns corrected [x,z].
export function collideCircle(arena, x, z, r, y0, y1, step = 0.45) {
  for (let iter = 0; iter < 4; iter++) {
    let moved = false;
    const seenS = new Set(), seenP = new Set();
    for (const c of cellsAround(arena, x - r, z - r, x + r, z + r)) {
      for (const si of c.s) {
        if (seenS.has(si)) continue;
        seenS.add(si);
        const s = arena.segs[si];
        if (y0 >= s.top - 0.02 || y1 <= s.base) continue;
        let t = (x - s.ax) * s.ux + (z - s.az) * s.uz;
        t = Math.max(0, Math.min(s.len, t));
        const px = s.ax + s.ux * t, pz = s.az + s.uz * t;
        let dx = x - px, dz = z - pz;
        const d2 = dx * dx + dz * dz;
        if (d2 < r * r) {
          let d = Math.sqrt(d2);
          if (d < 1e-5) { dx = -s.uz; dz = s.ux; d = 1; }
          x = px + (dx / d) * r; z = pz + (dz / d) * r;
          moved = true;
        }
      }
      for (const pi of c.p) {
        if (seenP.has(pi)) continue;
        seenP.add(pi);
        const p = arena.props[pi];
        if (y0 >= p.y1 - step || y1 <= p.y0) continue;
        if (p.r) {
          const dx = x - p.x, dz = z - p.z, d = Math.hypot(dx, dz), R = r + p.r;
          if (d < R) { const k = d < 1e-5 ? 1 : d; x = p.x + (dx / k) * R; z = p.z + (dz / k) * R; moved = true; }
        } else {
          const [lx, lz] = toPropLocal(p, x, z);
          const qx = Math.max(-p.hx, Math.min(p.hx, lx)), qz = Math.max(-p.hz, Math.min(p.hz, lz));
          let dx = lx - qx, dz = lz - qz;
          const d2 = dx * dx + dz * dz;
          if (d2 < r * r) {
            let nlx, nlz;
            if (d2 < 1e-8) {
              // centre inside the box: push out along the shallowest axis
              const px = p.hx - Math.abs(lx), pz = p.hz - Math.abs(lz);
              if (px < pz) { nlx = Math.sign(lx || 1) * (p.hx + r); nlz = lz; } else { nlx = lx; nlz = Math.sign(lz || 1) * (p.hz + r); }
            } else {
              const d = Math.sqrt(d2);
              nlx = qx + (dx / d) * r; nlz = qz + (dz / d) * r;
            }
            x = p.x + nlx * p.cos - nlz * p.sin;
            z = p.z + nlx * p.sin + nlz * p.cos;
            moved = true;
          }
        }
      }
    }
    if (!moved) break;
  }
  // safety: never end inside a building footprint
  for (const c of cellsAround(arena, x, z, x, z)) for (const bi of c.b) {
    const b = arena.buildings[bi];
    if (x > b.minX && x < b.maxX && z > b.minZ && z < b.maxZ && y0 < b.top && pointInPoly(b.pts, x, z)) {
      const [nx, nz] = nearestOnPoly(b.pts, x, z);
      const dx = nx - x, dz = nz - z, d = Math.hypot(dx, dz) || 1;
      x = nx + (dx / d) * (r + 0.01); z = nz + (dz / d) * (r + 0.01);
    }
  }
  return [x, z];
}

function nearestOnPoly(p, x, z) {
  let best = Infinity, bx = x, bz = z;
  for (let k = 0, n = p.length / 2; k < n; k++) {
    const j = (k + 1) % n;
    const ax = p[k * 2], az = p[k * 2 + 1], cx = p[j * 2], cz = p[j * 2 + 1];
    const dx = cx - ax, dz = cz - az, l2 = dx * dx + dz * dz || 1;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / l2));
    const qx = ax + dx * t, qz = az + dz * t, d = (qx - x) ** 2 + (qz - z) ** 2;
    if (d < best) { best = d; bx = qx; bz = qz; }
  }
  return [bx, bz];
}

// Highest walkable surface under a circle (terrain or prop tops we can step onto)
export function groundAt(arena, x, z, r, feetY, step = 0.45) {
  let g = arena.ground(x, z);
  for (const c of cellsAround(arena, x - r, z - r, x + r, z + r)) for (const pi of c.p) {
    const p = arena.props[pi];
    if (p.y1 > feetY + step || p.y1 <= g) continue;
    let overlap;
    if (p.r) overlap = Math.hypot(x - p.x, z - p.z) < r + p.r;
    else {
      const [lx, lz] = toPropLocal(p, x, z);
      overlap = Math.abs(lx) < p.hx + r * 0.7 && Math.abs(lz) < p.hz + r * 0.7;
    }
    if (overlap) g = p.y1;
  }
  return g;
}

// ---------------------------------------------------------------- ray casting
// Returns { t, nx, ny, nz, what: 'building'|'barrier'|'prop'|'ground', id } or null
export function raycast(arena, ox, oy, oz, dx, dy, dz, maxDist) {
  let best = maxDist, hit = null;
  const hl = Math.hypot(dx, dz);
  const seenS = new Set(), seenP = new Set(), seenB = new Set();
  const testCell = (c) => {
    for (const si of c.s) {
      if (seenS.has(si)) continue;
      seenS.add(si);
      const s = arena.segs[si];
      // ray (2D) vs segment
      const ex = s.bx - s.ax, ez = s.bz - s.az;
      const den = dx * ez - dz * ex;
      if (Math.abs(den) < 1e-9) continue;
      const wx = s.ax - ox, wz = s.az - oz;
      const t = (wx * ez - wz * ex) / den;
      const u = (wx * dz - wz * dx) / den;
      if (t < 0 || t >= best || u < 0 || u > 1) continue;
      const y = oy + dy * t;
      if (y < s.base || y > s.top) continue;
      best = t;
      let nx = -s.uz, nz = s.ux;
      if (nx * dx + nz * dz > 0) { nx = -nx; nz = -nz; }
      hit = { t, nx, ny: 0, nz, what: s.bld >= 0 ? 'building' : 'barrier', id: s.bld };
    }
    for (const bi of c.b) {
      if (seenB.has(bi) || dy >= 0) continue;
      seenB.add(bi);
      const b = arena.buildings[bi];
      const t = (b.top - oy) / dy;
      if (t < 0 || t >= best) continue;
      const x = ox + dx * t, z = oz + dz * t;
      if (x < b.minX || x > b.maxX || z < b.minZ || z > b.maxZ || !pointInPoly(b.pts, x, z)) continue;
      best = t;
      hit = { t, nx: 0, ny: 1, nz: 0, what: 'building', id: bi };
    }
    for (const pi of c.p) {
      if (seenP.has(pi)) continue;
      seenP.add(pi);
      const p = arena.props[pi];
      if (p.bulletproof === false) continue;
      const h = p.r ? rayCylinder(p, ox, oy, oz, dx, dy, dz) : rayOBB(p, ox, oy, oz, dx, dy, dz);
      if (h && h.t < best) { best = h.t; hit = { ...h, what: 'prop', id: pi }; }
    }
  };
  // 2D DDA over the grid
  let ix = Math.floor(ox / CELL), iz = Math.floor(oz / CELL);
  const sx = Math.sign(dx), sz = Math.sign(dz);
  const tdx = sx ? Math.abs(CELL / (dx || 1e-9)) : Infinity, tdz = sz ? Math.abs(CELL / (dz || 1e-9)) : Infinity;
  let tmx = sx > 0 ? ((ix + 1) * CELL - ox) / dx : sx < 0 ? (ix * CELL - ox) / dx : Infinity;
  let tmz = sz > 0 ? ((iz + 1) * CELL - oz) / dz : sz < 0 ? (iz * CELL - oz) / dz : Infinity;
  let tCell = 0;
  for (let guard = 0; guard < 400; guard++) {
    const c = arena.cells.get(arena.cellKey(ix, iz));
    if (c) testCell(c);
    if (hl < 1e-6) break; // vertical ray: only the first cell
    const next = Math.min(tmx, tmz);
    if (next > best || next > maxDist) break;
    tCell = next;
    if (tmx < tmz) { ix += sx; tmx += tdx; } else { iz += sz; tmz += tdz; }
  }
  // terrain
  const stepLen = 1.5;
  let prevT = 0;
  for (let t = 0.2; t < best; t += stepLen) {
    const x = ox + dx * t, y = oy + dy * t, z = oz + dz * t;
    if (y < arena.ground(x, z)) {
      let a = prevT, b = t;
      for (let k = 0; k < 8; k++) { const m = (a + b) / 2; if (oy + dy * m < arena.ground(ox + dx * m, oz + dz * m)) b = m; else a = m; }
      best = b;
      hit = { t: b, nx: 0, ny: 1, nz: 0, what: 'ground', id: -1 };
      break;
    }
    prevT = t;
  }
  return hit;
}

function rayOBB(p, ox, oy, oz, dx, dy, dz) {
  const rx = ox - p.x, rz = oz - p.z;
  const lox = rx * p.cos + rz * p.sin, loz = -rx * p.sin + rz * p.cos;
  const ldx = dx * p.cos + dz * p.sin, ldz = -dx * p.sin + dz * p.cos;
  let tmin = 0, tmax = Infinity, axis = -1, sign = 0;
  const slab = (o, d, lo, hi, ax) => {
    if (Math.abs(d) < 1e-9) return o >= lo && o <= hi;
    let t1 = (lo - o) / d, t2 = (hi - o) / d, s = -1;
    if (t1 > t2) { const tt = t1; t1 = t2; t2 = tt; s = 1; }
    if (t1 > tmin) { tmin = t1; axis = ax; sign = s; }
    tmax = Math.min(tmax, t2);
    return tmin <= tmax;
  };
  if (!slab(lox, ldx, -p.hx, p.hx, 0) || !slab(oy, dy, p.y0, p.y1, 1) || !slab(loz, ldz, -p.hz, p.hz, 2)) return null;
  if (tmin <= 0) return null;
  let nlx = 0, ny = 0, nlz = 0;
  if (axis === 0) nlx = sign; else if (axis === 1) ny = sign; else nlz = sign;
  if (nlx * ldx + ny * dy + nlz * ldz > 0) { nlx = -nlx; ny = -ny; nlz = -nlz; }
  return { t: tmin, nx: nlx * p.cos - nlz * p.sin, ny, nz: nlx * p.sin + nlz * p.cos };
}

function rayCylinder(p, ox, oy, oz, dx, dy, dz) {
  const fx = ox - p.x, fz = oz - p.z;
  const a = dx * dx + dz * dz, b = 2 * (fx * dx + fz * dz), c = fx * fx + fz * fz - p.r * p.r;
  const disc = b * b - 4 * a * c;
  if (disc < 0 || a < 1e-9) return null;
  const t = (-b - Math.sqrt(disc)) / (2 * a);
  if (t <= 0) return null;
  const y = oy + dy * t;
  if (y < p.y0 || y > p.y1) return null;
  const hx = fx + dx * t, hz = fz + dz * t, l = Math.hypot(hx, hz) || 1;
  return { t, nx: hx / l, ny: 0, nz: hz / l };
}

// Line of sight between two points (used by bots and the flashbang)
export function visible(arena, ax, ay, az, bx, by, bz) {
  const dx = bx - ax, dy = by - ay, dz = bz - az, d = Math.hypot(dx, dy, dz);
  if (d < 1e-3) return true;
  return !raycast(arena, ax, ay, az, dx / d, dy / d, dz / d, d - 0.05);
}
