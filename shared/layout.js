// Server-side arena layout: street furniture / cover props, nav grid, team spawns and bomb sites.
// The result is sent to clients, so floating-point differences between engines never matter.
import { ROAD, AREA, POINT, pointInPoly } from './region.js';
import { addProps } from './arena.js';

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------- nav grid (1 m cells)
export function buildNav(arena, cell = 1) {
  const n = Math.ceil(arena.size / cell);
  const blocked = new Uint8Array(n * n);
  const o = -arena.half;
  const idx = (x, z) => z * n + x;
  // buildings: scanline fill
  for (const b of arena.buildings) {
    if (b.maxX < o || b.minX > -o || b.maxZ < o || b.minZ > -o) continue;
    const z0 = Math.max(0, Math.floor((b.minZ - o) / cell)), z1 = Math.min(n - 1, Math.floor((b.maxZ - o) / cell));
    for (let iz = z0; iz <= z1; iz++) {
      const zc = o + (iz + 0.5) * cell;
      const xs = [];
      const p = b.pts, m = p.length / 2;
      for (let k = 0; k < m; k++) {
        const j = (k + 1) % m;
        const az = p[k * 2 + 1], bz = p[j * 2 + 1];
        if ((az <= zc && bz > zc) || (bz <= zc && az > zc)) xs.push(p[k * 2] + ((zc - az) / (bz - az)) * (p[j * 2] - p[k * 2]));
      }
      xs.sort((a, c) => a - c);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const xa = Math.max(0, Math.floor((xs[k] - o) / cell)), xb = Math.min(n - 1, Math.floor((xs[k + 1] - o) / cell));
        for (let ix = xa; ix <= xb; ix++) blocked[idx(ix, iz)] = 1;
      }
    }
  }
  const nav = { n, cell, o, blocked, idx };
  // barrier walls / fences
  for (const w of arena.barriers) {
    const p = w.pts;
    for (let k = 0; k + 3 < p.length; k += 2) rasterSeg(nav, p[k], p[k + 1], p[k + 2], p[k + 3]);
  }
  return nav;
}

function rasterSeg(nav, ax, az, bx, bz) {
  const len = Math.hypot(bx - ax, bz - az);
  const steps = Math.ceil(len / (nav.cell * 0.5)) + 1;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    markBlocked(nav, ax + (bx - ax) * t, az + (bz - az) * t);
  }
}
function markBlocked(nav, x, z) {
  const ix = Math.floor((x - nav.o) / nav.cell), iz = Math.floor((z - nav.o) / nav.cell);
  if (ix >= 0 && iz >= 0 && ix < nav.n && iz < nav.n) nav.blocked[nav.idx(ix, iz)] = 1;
}
function markProp(nav, p) {
  const r = Math.max(p.bx ?? p.r ?? 0.5, p.bz ?? p.r ?? 0.5);
  for (let z = p.z - (p.bz ?? r); z <= p.z + (p.bz ?? r); z += nav.cell * 0.5)
    for (let x = p.x - (p.bx ?? r); x <= p.x + (p.bx ?? r); x += nav.cell * 0.5) {
      if (p.r) { if (Math.hypot(x - p.x, z - p.z) <= p.r + 0.2) markBlocked(nav, x, z); continue; }
      const dx = x - p.x, dz = z - p.z;
      const lx = dx * p.cos + dz * p.sin, lz = -dx * p.sin + dz * p.cos;
      if (Math.abs(lx) <= p.hx + 0.2 && Math.abs(lz) <= p.hz + 0.2) markBlocked(nav, x, z);
    }
}
export function navFree(nav, x, z) {
  const ix = Math.floor((x - nav.o) / nav.cell), iz = Math.floor((z - nav.o) / nav.cell);
  return ix >= 1 && iz >= 1 && ix < nav.n - 1 && iz < nav.n - 1 && !nav.blocked[nav.idx(ix, iz)];
}
// clearance: free in a square of half-size r
function clearAround(nav, x, z, r) {
  for (let dz = -r; dz <= r; dz += nav.cell) for (let dx = -r; dx <= r; dx += nav.cell) if (!navFree(nav, x + dx, z + dz)) return false;
  return true;
}

// distance transform-free BFS over walkable cells (8-neighbour, unit weights)
export function bfs(nav, starts) {
  const dist = new Float32Array(nav.n * nav.n).fill(Infinity);
  const q = new Int32Array(nav.n * nav.n);
  let h = 0, t = 0;
  for (const s of starts) { if (!nav.blocked[s]) { dist[s] = 0; q[t++] = s; } }
  while (h < t) {
    const c = q[h++], cx = c % nav.n, cz = (c / nav.n) | 0, d = dist[c] + 1;
    for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dz) continue;
      const nx = cx + dx, nz = cz + dz;
      if (nx < 0 || nz < 0 || nx >= nav.n || nz >= nav.n) continue;
      const k = nz * nav.n + nx;
      if (nav.blocked[k] || dist[k] <= d) continue;
      if (dx && dz && (nav.blocked[cz * nav.n + nx] || nav.blocked[nz * nav.n + cx])) continue;
      dist[k] = d; q[t++] = k;
    }
  }
  return dist;
}
const cellOf = (nav, x, z) => Math.floor((z - nav.o) / nav.cell) * nav.n + Math.floor((x - nav.o) / nav.cell);
const posOf = (nav, k) => ({ x: nav.o + ((k % nav.n) + 0.5) * nav.cell, z: nav.o + (((k / nav.n) | 0) + 0.5) * nav.cell });

// ---------------------------------------------------------------- layout
export function generateLayout(arena, seed, mode) {
  const rnd = mulberry32(seed);
  const props = [];
  const nav = buildNav(arena);
  const half = arena.half;
  const inPlay = (x, z, m = 2) => Math.abs(x) < half - m && Math.abs(z) < half - m;
  const roadsNear = arena.roads.filter((r) => r.kind <= ROAD.SERVICE);
  const distToRoads = (x, z, skip) => {
    let best = Infinity, bw = 0;
    for (const r of roadsNear) {
      if (r === skip) continue;
      const p = r.pts;
      for (let k = 0; k + 3 < p.length; k += 2) {
        const ax = p[k], az = p[k + 1], dx = p[k + 2] - ax, dz = p[k + 3] - az, l2 = dx * dx + dz * dz || 1;
        const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / l2));
        const d = Math.hypot(ax + dx * t - x, az + dz * t - z) - r.width / 2;
        if (d < best) { best = d; bw = r.width; }
      }
    }
    return best;
  };
  const tryAdd = (p, clearance = 0.6) => {
    if (!inPlay(p.x, p.z, 1)) return false;
    const r = Math.max(p.hx || p.r || 0.3, p.hz || p.r || 0.3) + clearance;
    // must not overlap buildings / other props
    if (!clearAround(nav, p.x, p.z, Math.min(r, 2))) return false;
    props.push(p);
    p.cos = Math.cos(p.a || 0); p.sin = Math.sin(p.a || 0);
    if (!p.r) { p.bx = Math.abs(p.hx * p.cos) + Math.abs(p.hz * p.sin); p.bz = Math.abs(p.hx * p.sin) + Math.abs(p.hz * p.cos); }
    if (p.solid !== false) markProp(nav, p);
    return true;
  };
  const gy = (x, z) => arena.ground(x, z);
  const along = (r, spacing, offset, fn) => {
    const p = r.pts;
    let carry = rnd() * spacing;
    for (let k = 0; k + 3 < p.length; k += 2) {
      const ax = p[k], az = p[k + 1], dx = p[k + 2] - ax, dz = p[k + 3] - az, len = Math.hypot(dx, dz);
      if (len < 0.5) continue;
      const ux = dx / len, uz = dz / len;
      for (let s = carry; s < len; s += spacing) {
        for (const side of offset.sides) {
          const x = ax + ux * s - uz * side * offset.d, z = az + uz * s + ux * side * offset.d;
          fn(x, z, Math.atan2(uz, ux), side);
        }
      }
      carry = (carry - len) % spacing;
      if (carry < 0) carry += spacing;
    }
  };

  // parked cars on residential / tertiary / service streets
  for (const r of arena.roads) {
    if (r.kind < ROAD.TERTIARY || r.kind > ROAD.SERVICE) continue;
    along(r, 7 + rnd() * 6, { d: r.width / 2 - 1.1, sides: [-1, 1] }, (x, z, a) => {
      if (rnd() > 0.42) return;
      if (distToRoads(x, z, r) < 6) return; // keep intersections clear
      const van = rnd() < 0.15;
      tryAdd({ type: van ? 'van' : 'car', x, z, a, hx: van ? 2.5 : 2.2, hz: van ? 1.0 : 0.9, y0: gy(x, z), y1: gy(x, z) + (van ? 2.1 : 1.45), v: Math.floor(rnd() * 8) }, 0.2);
    });
  }
  // street trees and lamps along sidewalks
  for (const r of arena.roads) {
    if (r.kind > ROAD.SERVICE) continue;
    along(r, 9 + rnd() * 5, { d: r.width / 2 + 1.6, sides: [-1, 1] }, (x, z, a) => {
      if (rnd() > 0.55) return;
      tryAdd({ type: 'tree', x, z, r: 0.22, y0: gy(x, z), y1: gy(x, z) + 6, v: Math.floor(rnd() * 4) }, 0.4);
    });
    if (r.kind <= ROAD.TERTIARY) {
      along(r, 26, { d: r.width / 2 + 0.6, sides: [rnd() < 0.5 ? -1 : 1] }, (x, z, a, side) => {
        tryAdd({ type: 'lamp', x, z, a: a + (side > 0 ? -Math.PI / 2 : Math.PI / 2), r: 0.13, y0: gy(x, z), y1: gy(x, z) + 8.5, v: 0 }, 0.3);
      });
    }
    if (r.kind <= ROAD.RESIDENTIAL && rnd() < 0.6) {
      along(r, 45, { d: r.width / 2 + 1.0, sides: [rnd() < 0.5 ? -1 : 1] }, (x, z, a) => {
        if (rnd() < 0.5) tryAdd({ type: 'dumpster', x, z, a, hx: 0.9, hz: 0.6, y0: gy(x, z), y1: gy(x, z) + 1.3, v: Math.floor(rnd() * 2) }, 0.3);
      });
    }
  }
  // OSM points: trees, traffic lights, bus stops
  for (const p of arena.points) {
    if (!inPlay(p.x, p.z)) continue;
    const g = gy(p.x, p.z);
    if (p.kind === POINT.TREE) tryAdd({ type: 'tree', x: p.x, z: p.z, r: 0.22, y0: g, y1: g + 6, v: Math.floor(rnd() * 4) }, 0.3);
    else if (p.kind === POINT.SIGNALS) tryAdd({ type: 'signal', x: p.x + 0.5, z: p.z + 0.5, r: 0.1, y0: g, y1: g + 4.2, a: rnd() * 6.28, v: 0 }, 0.2);
    else if (p.kind === POINT.BUS_STOP) tryAdd({ type: 'busstop', x: p.x, z: p.z, a: 0, hx: 2.0, hz: 0.12, y0: g, y1: g + 2.5, v: 0 }, 0.4);
  }
  // parks: scattered trees + benches
  for (const a of arena.areas) {
    if (a.kind !== AREA.PARK && a.kind !== AREA.GRASS && a.kind !== AREA.FOREST) continue;
    let minX = Infinity, minZ = Infinity, maxX = -Infinity, maxZ = -Infinity;
    for (let k = 0; k < a.pts.length; k += 2) { minX = Math.min(minX, a.pts[k]); maxX = Math.max(maxX, a.pts[k]); minZ = Math.min(minZ, a.pts[k + 1]); maxZ = Math.max(maxZ, a.pts[k + 1]); }
    const areaSize = (maxX - minX) * (maxZ - minZ);
    const count = Math.min(60, Math.floor(areaSize / (a.kind === AREA.FOREST ? 30 : 90)));
    for (let i = 0; i < count; i++) {
      const x = minX + rnd() * (maxX - minX), z = minZ + rnd() * (maxZ - minZ);
      if (!pointInPoly(a.pts, x, z)) continue;
      const g = gy(x, z);
      if (rnd() < 0.85) tryAdd({ type: 'tree', x, z, r: 0.25, y0: g, y1: g + 7, v: Math.floor(rnd() * 4) }, 0.5);
      else tryAdd({ type: 'bench', x, z, a: rnd() * 6.28, hx: 0.9, hz: 0.3, y0: g, y1: g + 0.45, v: 0 }, 0.4);
    }
  }

  // ---- connectivity, spawns and bomb sites
  const centerCells = [];
  for (let k = 0; k < nav.n * nav.n; k++) if (!nav.blocked[k]) centerCells.push(k);
  // pick start nearest to the arena centre
  let start = -1, bestD = Infinity;
  for (const k of centerCells) { const p = posOf(nav, k); const d = Math.hypot(p.x, p.z); if (d < bestD && clearAround(nav, p.x, p.z, 2)) { bestD = d; start = k; } }
  if (start < 0) start = centerCells[0];
  const d0 = bfs(nav, [start]);
  const farthest = (dist, pred = () => true) => {
    let b = -1, bd = -1;
    for (let k = 0; k < dist.length; k++) if (dist[k] < Infinity && dist[k] > bd && pred(k)) { const p = posOf(nav, k); if (clearAround(nav, p.x, p.z, 3)) { bd = dist[k]; b = k; } }
    return b;
  };
  const tCell = farthest(d0);
  const dT = bfs(nav, [tCell]);
  const ctCell = farthest(dT);
  const dCT = bfs(nav, [ctCell]);
  const tPos = posOf(nav, tCell), ctPos = posOf(nav, ctCell);

  const spawnsFor = (c, dist) => {
    const out = [];
    const around = [];
    for (let k = 0; k < dist.length; k++) if (dist[k] < 18) around.push(k);
    around.sort((a, b) => dist[a] - dist[b]);
    for (const k of around) {
      const p = posOf(nav, k);
      if (!clearAround(nav, p.x, p.z, 1)) continue;
      if (out.some((q) => Math.hypot(q.x - p.x, q.z - p.z) < 2.2)) continue;
      out.push({ x: p.x, z: p.z, y: gy(p.x, p.z) });
      if (out.length >= 10) break;
    }
    return out;
  };
  const spawns = { T: spawnsFor(tCell, dT), CT: spawnsFor(ctCell, dCT) };
  for (const team of ['T', 'CT']) {
    const other = team === 'T' ? ctPos : tPos;
    for (const s of spawns[team]) s.yaw = Math.atan2(-(other.x - s.x), -(other.z - s.z));
  }

  // bomb sites: open spots 55-80 % of the way from T to CT, far apart from each other
  const sites = [];
  if (mode === 'bomb') {
    const cands = [];
    for (let k = 0; k < dT.length; k++) {
      if (!(dT[k] < Infinity) || !(dCT[k] < Infinity)) continue;
      const f = dT[k] / (dT[k] + dCT[k]);
      if (f < 0.55 || f > 0.82) continue;
      const p = posOf(nav, k);
      if (!clearAround(nav, p.x, p.z, 4)) continue;
      cands.push({ k, ...p, score: rnd() + (clearAround(nav, p.x, p.z, 6) ? 0.6 : 0) });
    }
    cands.sort((a, b) => b.score - a.score);
    const a = cands[0];
    if (a) {
      sites.push({ id: 'A', x: a.x, z: a.z, y: gy(a.x, a.z), r: 6 });
      const minSep = arena.size * 0.3;
      const b = cands.find((c) => Math.hypot(c.x - a.x, c.z - a.z) > minSep) || cands.find((c) => Math.hypot(c.x - a.x, c.z - a.z) > minSep * 0.5);
      if (b) sites.push({ id: 'B', x: b.x, z: b.z, y: gy(b.x, b.z), r: 6 });
    }
    // cover around the sites: crates, sandbags, jersey barriers, a delivery van
    for (const s of sites) {
      const n = 6 + Math.floor(rnd() * 3);
      for (let i = 0; i < n; i++) {
        const ang = rnd() * Math.PI * 2, dist = 3 + rnd() * 7;
        const x = s.x + Math.cos(ang) * dist, z = s.z + Math.sin(ang) * dist;
        const g = gy(x, z), kind = rnd();
        if (kind < 0.4) tryAdd({ type: 'crate', x, z, a: rnd() * 1.5, hx: 0.6, hz: 0.6, y0: g, y1: g + (rnd() < 0.5 ? 1.2 : 2.4), v: 0 }, 0.5);
        else if (kind < 0.65) tryAdd({ type: 'sandbag', x, z, a: ang + Math.PI / 2, hx: 1.3, hz: 0.45, y0: g, y1: g + 0.95, v: 0 }, 0.5);
        else if (kind < 0.9) tryAdd({ type: 'barrier', x, z, a: ang + Math.PI / 2, hx: 1.0, hz: 0.3, y0: g, y1: g + 0.85, v: 0 }, 0.5);
        else tryAdd({ type: 'van', x, z, a: ang, hx: 2.5, hz: 1.0, y0: g, y1: g + 2.1, v: Math.floor(rnd() * 8) }, 0.4);
      }
    }
  }

  // Faerod advertising: billboards near spawns, sites and at random open sidewalks; "raket" ad panels on streets
  const adSpots = [tPos, ctPos, ...sites];
  for (const s of adSpots) {
    for (let tries = 0; tries < 30; tries++) {
      const ang = rnd() * Math.PI * 2, dist = 9 + rnd() * 10;
      const x = s.x + Math.cos(ang) * dist, z = s.z + Math.sin(ang) * dist;
      const g = gy(x, z);
      if (tryAdd({ type: 'billboard', x, z, a: ang + Math.PI / 2, hx: 3.0, hz: 0.25, y0: g, y1: g + 6.2, v: Math.floor(rnd() * 3) }, 1.0)) break;
    }
  }
  let panels = 0;
  for (const r of arena.roads) {
    if (r.kind > ROAD.RESIDENTIAL || panels > 10) continue;
    along(r, 55, { d: r.width / 2 + 2.2, sides: [rnd() < 0.5 ? -1 : 1] }, (x, z, a) => {
      if (panels > 10 || rnd() < 0.4) return;
      const g = gy(x, z);
      if (tryAdd({ type: 'adpanel', x, z, a, hx: 0.75, hz: 0.18, y0: g, y1: g + 2.7, v: Math.floor(rnd() * 3) }, 0.5)) panels++;
    });
  }
  // a kiosk (büfe) somewhere central
  for (let tries = 0; tries < 40; tries++) {
    const x = (rnd() - 0.5) * arena.size * 0.6, z = (rnd() - 0.5) * arena.size * 0.6;
    if (distToRoads(x, z) < 1 || distToRoads(x, z) > 6) continue;
    const g = gy(x, z);
    if (tryAdd({ type: 'kiosk', x, z, a: rnd() * 6.28, hx: 1.6, hz: 1.2, y0: g, y1: g + 2.7, v: 0 }, 1)) break;
  }

  return { seed, props: props.map(stripProp), spawns, sites, tSpawn: tPos, ctSpawn: ctPos, nav };
}

function stripProp(p) {
  const o = { type: p.type, x: round2(p.x), z: round2(p.z), y0: round2(p.y0), y1: round2(p.y1), v: p.v };
  if (p.a) o.a = round3(p.a);
  if (p.r) o.r = p.r; else { o.hx = p.hx; o.hz = p.hz; }
  if (p.solid === false) o.solid = false;
  return o;
}
const round2 = (v) => Math.round(v * 100) / 100;
const round3 = (v) => Math.round(v * 1000) / 1000;

// install a layout (props) into an arena for collision / ray casts (client + server)
export function applyLayout(arena, layout) {
  // billboard collision only for its legs + panel (players walk under the panel)
  const props = [];
  for (const p of layout.props) {
    if (p.type === 'billboard') {
      const c = Math.cos(p.a || 0), s = Math.sin(p.a || 0);
      for (const side of [-1, 1]) props.push({ type: 'leg', x: p.x + c * side * (p.hx - 0.4), z: p.z + s * side * (p.hx - 0.4), r: 0.18, y0: p.y0, y1: p.y1 - 2.6 });
      props.push({ ...p, y0: p.y1 - 3.0 });
    } else if (p.type === 'busstop') {
      props.push({ ...p });
    } else if (p.type === 'tree') {
      props.push({ ...p, y1: p.y0 + 3.5 }); // trunk only; crowns do not stop bullets
    } else props.push({ ...p });
  }
  addProps(arena, props);
}
