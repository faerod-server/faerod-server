// Reader for data/region.bin (written by tools/bake-region.mjs) + spatial index + terrain height.
// Coordinates are local meters around CENTER: x = east, z = south. Stored as int16 in 0.5 m units.

export const BUILDING = { GENERIC: 0, APARTMENTS: 1, HOUSE: 2, COMMERCIAL: 3, INDUSTRIAL: 4, SCHOOL: 5, RELIGIOUS: 6, HOSPITAL: 7, SMALL: 8, CONSTRUCTION: 9, PUBLIC: 10, HOTEL: 11 };
export const ROAD = { MOTORWAY: 0, TRUNK: 1, PRIMARY: 2, SECONDARY: 3, TERTIARY: 4, RESIDENTIAL: 5, SERVICE: 6, TRACK: 7, FOOTWAY: 8, RAIL: 10, WALL: 30, FENCE: 31 };
export const AREA = { PARK: 0, GRASS: 1, FOREST: 2, FARM: 3, WATER: 4, PARKING: 5, PITCH: 6, RESIDENTIAL: 7, COMMERCIAL: 8, INDUSTRIAL: 9, SCHOOL: 10, CEMETERY: 11, CONSTRUCTION: 12, SCRUB: 13 };
export const POINT = { TREE: 0, SIGNALS: 1, LAMP: 2, BUS_STOP: 3, CROSSING: 4, BENCH: 5, SHOP: 6, FOOD: 7, PHARMACY: 8, BANK: 9, FUEL: 10 };

// default road widths (m) by kind
export const ROAD_WIDTH = { 0: 22, 1: 18, 2: 16, 3: 12, 4: 9, 5: 7, 6: 4.5, 7: 3.5, 8: 2.2, 10: 4, 30: 0.3, 31: 0.1 };

export function hashInt(a, b = 0) {
  let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0);
}

export function decodeRegion(arrayBuffer) {
  const dv = new DataView(arrayBuffer);
  const td = new TextDecoder();
  const magic = String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3));
  if (magic !== 'FRG1') throw new Error('region.bin: bad magic');
  const region = {
    center: { lat: dv.getFloat64(8, true), lon: dv.getFloat64(16, true) },
    buildings: [], roads: [], areas: [], points: [], strings: [], places: [], hm: null,
  };
  const nSections = dv.getUint32(24, true);
  let o = 32;
  const readPts = (n) => {
    const pts = new Float32Array(n * 2);
    for (let i = 0; i < n * 2; i++) { pts[i] = dv.getInt16(o, true) * 0.5; o += 2; }
    return pts;
  };
  const bbox = (f) => {
    let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
    for (let i = 0; i < f.pts.length; i += 2) { a = Math.min(a, f.pts[i]); b = Math.min(b, f.pts[i + 1]); c = Math.max(c, f.pts[i]); d = Math.max(d, f.pts[i + 1]); }
    f.minX = a; f.minZ = b; f.maxX = c; f.maxZ = d;
    return f;
  };
  for (let s = 0; s < nSections; s++) {
    const type = dv.getUint32(o, true), len = dv.getUint32(o + 4, true);
    const start = o + 8;
    o = start;
    if (type === 1) {
      const n = dv.getUint32(o, true); o += 4;
      for (let k = 0; k < n; k++) {
        const b = { id: k, kind: dv.getUint8(o), levels: dv.getUint8(o + 1), heightDm: dv.getUint16(o + 2, true), minDm: dv.getUint16(o + 4, true), roof: dv.getUint8(o + 6), color: dv.getUint8(o + 7) };
        const np = dv.getUint16(o + 8, true); o += 10;
        b.pts = readPts(np);
        b.height = buildingHeight(b, k);
        region.buildings.push(bbox(b));
      }
    } else if (type === 2) {
      const n = dv.getUint32(o, true); o += 4;
      for (let k = 0; k < n; k++) {
        const r = { id: k, kind: dv.getUint8(o), lanes: dv.getUint8(o + 1), width: dv.getUint8(o + 2) * 0.25, flags: dv.getUint8(o + 3), nameIdx: dv.getUint16(o + 4, true) };
        const np = dv.getUint16(o + 6, true); o += 8;
        r.pts = readPts(np);
        if (!r.width) r.width = ROAD_WIDTH[r.kind] ?? 6;
        region.roads.push(bbox(r));
      }
    } else if (type === 3) {
      const n = dv.getUint32(o, true); o += 4;
      for (let k = 0; k < n; k++) {
        const a = { id: k, kind: dv.getUint8(o) };
        const np = dv.getUint16(o + 2, true); o += 4;
        a.pts = readPts(np);
        region.areas.push(bbox(a));
      }
    } else if (type === 4) {
      const n = dv.getUint32(o, true); o += 4;
      for (let k = 0; k < n; k++) {
        region.points.push({ kind: dv.getUint8(o), x: dv.getInt16(o + 2, true) * 0.5, z: dv.getInt16(o + 4, true) * 0.5 });
        o += 6;
      }
    } else if (type === 5) {
      const n = dv.getUint32(o, true); o += 4;
      for (let k = 0; k < n; k++) {
        const l = dv.getUint16(o, true); o += 2;
        region.strings.push(td.decode(new Uint8Array(arrayBuffer, o, l)));
        o += l;
      }
    } else if (type === 6) {
      const n = dv.getUint32(o, true); o += 4;
      for (let k = 0; k < n; k++) {
        region.places.push({ nameIdx: dv.getUint16(o, true), x: dv.getInt16(o + 2, true) * 0.5, z: dv.getInt16(o + 4, true) * 0.5, buildings: dv.getUint16(o + 6, true) });
        o += 8;
      }
    } else if (type === 7) {
      const w = dv.getUint16(o, true), h = dv.getUint16(o + 2, true);
      const hm = { w, h, x0: dv.getFloat32(o + 4, true), z0: dv.getFloat32(o + 8, true), cell: dv.getFloat32(o + 12, true), min: dv.getFloat32(o + 16, true), scale: dv.getFloat32(o + 20, true) };
      o += 24;
      hm.data = new Float32Array(w * h);
      for (let i = 0; i < w * h; i++) { hm.data[i] = hm.min + dv.getUint16(o, true) * hm.scale; o += 2; }
      region.hm = hm;
    }
    o = start + len;
  }
  for (const p of region.places) p.name = region.strings[p.nameIdx] || '';
  for (const r of region.roads) r.name = r.nameIdx !== 0xffff ? region.strings[r.nameIdx] || '' : '';
  return region;
}

// Building height in meters (deterministic default when OSM has no height)
export function buildingHeight(b, k) {
  if (b.heightDm) return b.heightDm / 10;
  if (b.levels) return b.levels * 3 + (b.kind === BUILDING.APARTMENTS ? 1.2 : 0.6);
  const r = hashInt(k, 77) % 1000 / 1000;
  switch (b.kind) {
    case BUILDING.APARTMENTS: return (5 + Math.floor(r * 4)) * 3 + 1.2;   // 5-8 floors, typical Nilüfer
    case BUILDING.HOUSE: return (1 + Math.floor(r * 2)) * 3 + 0.6;
    case BUILDING.COMMERCIAL: return (2 + Math.floor(r * 3)) * 3.6;
    case BUILDING.INDUSTRIAL: return 7 + r * 5;
    case BUILDING.SCHOOL: return 3 * 3.4;
    case BUILDING.RELIGIOUS: return 10;
    case BUILDING.HOSPITAL: return 5 * 3.5;
    case BUILDING.SMALL: return 3;
    case BUILDING.HOTEL: return 7 * 3;
    case BUILDING.PUBLIC: return 3 * 3.6;
    default: {
      // unknown "yes" buildings: size decides (big footprints in Nilüfer are usually apartment blocks)
      let area = 0;
      for (let i = 0, n = b.pts.length; i < n; i += 2) {
        const j = (i + 2) % n;
        area += b.pts[i] * b.pts[j + 1] - b.pts[j] * b.pts[i + 1];
      }
      area = Math.abs(area) / 2;
      if (area < 40) return 3;
      if (area < 120) return (1 + Math.floor(r * 2)) * 3 + 0.6;
      return (4 + Math.floor(r * 4)) * 3 + 1.2;
    }
  }
}

export function levelsOf(b) {
  if (b.levels) return b.levels;
  const fh = b.kind === BUILDING.COMMERCIAL ? 3.6 : 3;
  return Math.max(1, Math.round((b.height - 0.6) / fh));
}

// Uniform grid index over the whole region for fast window queries.
export function buildIndex(region, cell = 200) {
  const ext = 10600;
  const n = Math.ceil((ext * 2) / cell);
  const grid = new Map();
  const add = (layer, f, i) => {
    const x0 = Math.max(0, Math.floor((f.minX + ext) / cell)), x1 = Math.min(n - 1, Math.floor((f.maxX + ext) / cell));
    const z0 = Math.max(0, Math.floor((f.minZ + ext) / cell)), z1 = Math.min(n - 1, Math.floor((f.maxZ + ext) / cell));
    for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) {
      const k = z * n + x;
      let c = grid.get(k);
      if (!c) grid.set(k, (c = { b: [], r: [], a: [], p: [] }));
      c[layer].push(i);
    }
  };
  region.buildings.forEach((f, i) => add('b', f, i));
  region.roads.forEach((f, i) => add('r', f, i));
  region.areas.forEach((f, i) => add('a', f, i));
  region.points.forEach((p, i) => add('p', { minX: p.x, maxX: p.x, minZ: p.z, maxZ: p.z }, i));
  return {
    query(minX, minZ, maxX, maxZ) {
      const out = { b: new Set(), r: new Set(), a: new Set(), p: new Set() };
      const x0 = Math.max(0, Math.floor((minX + ext) / cell)), x1 = Math.min(n - 1, Math.floor((maxX + ext) / cell));
      const z0 = Math.max(0, Math.floor((minZ + ext) / cell)), z1 = Math.min(n - 1, Math.floor((maxZ + ext) / cell));
      for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) {
        const c = grid.get(z * n + x);
        if (!c) continue;
        for (const l of ['b', 'r', 'a', 'p']) for (const i of c[l]) out[l].add(i);
      }
      return { b: [...out.b].sort((a, b) => a - b), r: [...out.r].sort((a, b) => a - b), a: [...out.a].sort((a, b) => a - b), p: [...out.p].sort((a, b) => a - b) };
    },
  };
}

// Terrain elevation (absolute meters) at region coords
export function elevation(region, x, z) {
  const hm = region.hm;
  if (!hm) return 0;
  const fx = Math.max(0, Math.min(hm.w - 1.001, (x - hm.x0) / hm.cell));
  const fz = Math.max(0, Math.min(hm.h - 1.001, (z - hm.z0) / hm.cell));
  const ix = Math.floor(fx), iz = Math.floor(fz), tx = fx - ix, tz = fz - iz;
  const d = hm.data, w = hm.w;
  const a = d[iz * w + ix], b = d[iz * w + ix + 1], c = d[(iz + 1) * w + ix], e = d[(iz + 1) * w + ix + 1];
  return (a * (1 - tx) + b * tx) * (1 - tz) + (c * (1 - tx) + e * tx) * tz;
}

export function pointInPoly(pts, x, z) {
  let inside = false;
  for (let i = 0, n = pts.length / 2, j = n - 1; i < n; j = i++) {
    const xi = pts[i * 2], zi = pts[i * 2 + 1], xj = pts[j * 2], zj = pts[j * 2 + 1];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

export function polyArea(pts) {
  let a = 0;
  for (let i = 0, n = pts.length; i < n; i += 2) {
    const j = (i + 2) % n;
    a += pts[i] * pts[j + 1] - pts[j] * pts[i + 1];
  }
  return a / 2;
}

export function latLonToLocal(region, lat, lon) {
  const phi = (region.center.lat * Math.PI) / 180;
  const mLat = 111132.92 - 559.82 * Math.cos(2 * phi) + 1.175 * Math.cos(4 * phi);
  const mLon = 111412.84 * Math.cos(phi) - 93.5 * Math.cos(3 * phi);
  return { x: (lon - region.center.lon) * mLon, z: (region.center.lat - lat) * mLat };
}
