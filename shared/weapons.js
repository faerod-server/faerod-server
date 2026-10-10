// Weapon / equipment table shared by client and server.
// Units: damage in HP, rpm = rounds per minute, spread in radians, range in meters, speed multiplier of base run speed.

export const SLOT = { PRIMARY: 0, SECONDARY: 1, KNIFE: 2, GRENADE: 3, BOMB: 4 };
export const TEAM = { T: 'T', CT: 'CT', SPEC: 'SPEC' };

const W = (o) => ({
  auto: false, pellets: 1, armorPen: 0.7, headMul: 4, falloff: 0.9, range: 4000,
  spreadStand: 0.004, spreadMove: 0.06, spreadCrouch: 0.003, spreadJump: 0.25,
  recoil: 0.012, recoilMax: 0.12, recoilRecover: 6, reward: 300, team: null, zoom: null, silenced: false,
  ...o,
});

export const WEAPONS = {
  knife: W({ id: 'knife', slot: SLOT.KNIFE, name: { tr: 'Bıçak', en: 'Knife' }, price: 0, damage: 40, rpm: 120, mag: 0, reserve: 0, reload: 0, speed: 1.0, melee: true, range: 1.8, headMul: 1, reward: 1500, model: 'knife' }),

  glock: W({ id: 'glock', slot: SLOT.SECONDARY, name: { tr: 'Glock-18', en: 'Glock-18' }, team: 'T', price: 200, damage: 30, armorPen: 0.47, rpm: 400, mag: 20, reserve: 120, reload: 2.2, speed: 0.96, spreadStand: 0.008, spreadMove: 0.03, recoil: 0.01, falloff: 0.85, model: 'pistol' }),
  usp: W({ id: 'usp', slot: SLOT.SECONDARY, name: { tr: 'USP-S', en: 'USP-S' }, team: 'CT', price: 200, damage: 35, armorPen: 0.5, rpm: 352, mag: 12, reserve: 24, reload: 2.2, speed: 0.96, spreadStand: 0.006, spreadMove: 0.028, recoil: 0.012, falloff: 0.91, silenced: true, model: 'pistol' }),
  p250: W({ id: 'p250', slot: SLOT.SECONDARY, name: { tr: 'P250', en: 'P250' }, price: 300, damage: 38, armorPen: 0.64, rpm: 400, mag: 13, reserve: 26, reload: 2.2, speed: 0.96, spreadStand: 0.008, spreadMove: 0.03, recoil: 0.016, falloff: 0.85, model: 'pistol' }),
  deagle: W({ id: 'deagle', slot: SLOT.SECONDARY, name: { tr: 'Desert Eagle', en: 'Desert Eagle' }, price: 700, damage: 63, armorPen: 0.93, rpm: 267, mag: 7, reserve: 35, reload: 2.2, speed: 0.92, spreadStand: 0.01, spreadMove: 0.07, recoil: 0.05, recoilMax: 0.2, falloff: 0.81, model: 'deagle' }),

  mac10: W({ id: 'mac10', slot: SLOT.PRIMARY, name: { tr: 'MAC-10', en: 'MAC-10' }, team: 'T', price: 1050, damage: 29, armorPen: 0.57, rpm: 800, mag: 30, reserve: 100, reload: 2.6, speed: 0.96, auto: true, spreadStand: 0.012, spreadMove: 0.03, recoil: 0.006, falloff: 0.8, reward: 600, model: 'smg' }),
  mp9: W({ id: 'mp9', slot: SLOT.PRIMARY, name: { tr: 'MP9', en: 'MP9' }, team: 'CT', price: 1250, damage: 26, armorPen: 0.6, rpm: 857, mag: 30, reserve: 120, reload: 2.1, speed: 0.96, auto: true, spreadStand: 0.01, spreadMove: 0.028, recoil: 0.006, falloff: 0.87, reward: 600, model: 'smg' }),
  mp5: W({ id: 'mp5', slot: SLOT.PRIMARY, name: { tr: 'MP5-SD', en: 'MP5-SD' }, price: 1500, damage: 27, armorPen: 0.63, rpm: 750, mag: 30, reserve: 120, reload: 2.6, speed: 0.94, auto: true, spreadStand: 0.008, spreadMove: 0.025, recoil: 0.005, falloff: 0.85, silenced: true, reward: 600, model: 'smg' }),
  p90: W({ id: 'p90', slot: SLOT.PRIMARY, name: { tr: 'P90', en: 'P90' }, price: 2350, damage: 26, armorPen: 0.69, rpm: 857, mag: 50, reserve: 100, reload: 3.3, speed: 0.92, auto: true, spreadStand: 0.012, spreadMove: 0.03, recoil: 0.005, falloff: 0.86, reward: 300, model: 'p90' }),

  nova: W({ id: 'nova', slot: SLOT.PRIMARY, name: { tr: 'Nova Pompalı', en: 'Nova Shotgun' }, price: 1050, damage: 26, pellets: 9, armorPen: 0.5, rpm: 68, mag: 8, reserve: 32, reload: 3.6, speed: 0.88, spreadStand: 0.06, spreadMove: 0.07, spreadCrouch: 0.06, recoil: 0.06, recoilMax: 0.15, falloff: 0.7, range: 40, headMul: 4, reward: 900, model: 'shotgun' }),

  galil: W({ id: 'galil', slot: SLOT.PRIMARY, name: { tr: 'Galil AR', en: 'Galil AR' }, team: 'T', price: 1800, damage: 30, armorPen: 0.77, rpm: 666, mag: 35, reserve: 90, reload: 3.0, speed: 0.86, auto: true, spreadStand: 0.006, spreadMove: 0.1, recoil: 0.009, falloff: 0.98, model: 'rifle_t' }),
  famas: W({ id: 'famas', slot: SLOT.PRIMARY, name: { tr: 'FAMAS', en: 'FAMAS' }, team: 'CT', price: 2050, damage: 30, armorPen: 0.7, rpm: 666, mag: 25, reserve: 90, reload: 3.3, speed: 0.88, auto: true, spreadStand: 0.006, spreadMove: 0.1, recoil: 0.009, falloff: 0.96, model: 'rifle_ct' }),
  ak47: W({ id: 'ak47', slot: SLOT.PRIMARY, name: { tr: 'AK-47', en: 'AK-47' }, team: 'T', price: 2700, damage: 36, armorPen: 0.775, rpm: 600, mag: 30, reserve: 90, reload: 2.5, speed: 0.86, auto: true, spreadStand: 0.005, spreadMove: 0.12, recoil: 0.014, recoilMax: 0.16, falloff: 0.98, model: 'ak' }),
  m4a1: W({ id: 'm4a1', slot: SLOT.PRIMARY, name: { tr: 'M4A1-S', en: 'M4A1-S' }, team: 'CT', price: 2900, damage: 33, armorPen: 0.7, rpm: 600, mag: 25, reserve: 75, reload: 3.1, speed: 0.9, auto: true, spreadStand: 0.004, spreadMove: 0.1, recoil: 0.011, recoilMax: 0.13, falloff: 0.99, silenced: true, model: 'm4' }),

  ssg08: W({ id: 'ssg08', slot: SLOT.PRIMARY, name: { tr: 'SSG 08 Keskin', en: 'SSG 08 Scout' }, price: 1700, damage: 88, armorPen: 0.85, rpm: 48, mag: 10, reserve: 90, reload: 3.7, speed: 0.92, spreadStand: 0.03, spreadMove: 0.12, spreadCrouch: 0.025, scopedSpread: 0.0008, recoil: 0.04, falloff: 0.98, zoom: [2.4, 6], model: 'scout' }),
  awp: W({ id: 'awp', slot: SLOT.PRIMARY, name: { tr: 'AWP Keskin Nişancı', en: 'AWP' }, price: 4750, damage: 115, armorPen: 0.975, rpm: 41, mag: 5, reserve: 30, reload: 3.7, speed: 0.8, spreadStand: 0.06, spreadMove: 0.2, spreadCrouch: 0.05, scopedSpread: 0.0004, recoil: 0.08, falloff: 0.99, zoom: [2.5, 8], reward: 100, model: 'awp' }),

  he: W({ id: 'he', slot: SLOT.GRENADE, name: { tr: 'El Bombası', en: 'HE Grenade' }, price: 300, damage: 98, grenade: 'he', mag: 1, reserve: 0, rpm: 60, speed: 1.0, model: 'grenade' }),
  flash: W({ id: 'flash', slot: SLOT.GRENADE, name: { tr: 'Flaş Bombası', en: 'Flashbang' }, price: 200, damage: 0, grenade: 'flash', mag: 1, reserve: 0, rpm: 60, speed: 1.0, model: 'flash' }),
  smoke: W({ id: 'smoke', slot: SLOT.GRENADE, name: { tr: 'Sis Bombası', en: 'Smoke Grenade' }, price: 300, damage: 0, grenade: 'smoke', mag: 1, reserve: 0, rpm: 60, speed: 1.0, model: 'smoke' }),

  bomb: W({ id: 'bomb', slot: SLOT.BOMB, name: { tr: 'C4 Bomba', en: 'C4 Bomb' }, team: 'T', price: 0, damage: 0, rpm: 60, mag: 0, reserve: 0, speed: 0.98, model: 'bomb' }),
};

export const WEAPON_IDS = Object.keys(WEAPONS);
export const WEAPON_CODE = Object.fromEntries(WEAPON_IDS.map((id, i) => [id, i]));

// Player hitboxes relative to the feet, for a standing body (scaled by crouch factor)
export const HITBOXES = [
  { zone: 'head', type: 'sphere', y: 1.68, r: 0.15 },
  { zone: 'chest', type: 'cyl', y0: 1.08, y1: 1.52, r: 0.25 },
  { zone: 'stomach', type: 'cyl', y0: 0.8, y1: 1.08, r: 0.23 },
  { zone: 'legs', type: 'cyl', y0: 0.0, y1: 0.8, r: 0.2 },
];

// ray vs one player's hitboxes; returns { t, zone } or null
export function rayHitPlayer(ox, oy, oz, dx, dy, dz, px, py, pz, crouch, maxT) {
  const k = 1 - 0.3 * crouch;
  let best = null;
  for (const h of HITBOXES) {
    let t = null;
    if (h.type === 'sphere') {
      const cy = py + h.y * k;
      const fx = ox - px, fy = oy - cy, fz = oz - pz;
      const b = fx * dx + fy * dy + fz * dz, c = fx * fx + fy * fy + fz * fz - h.r * h.r;
      const disc = b * b - c;
      if (disc >= 0) { const tt = -b - Math.sqrt(disc); if (tt > 0) t = tt; }
    } else {
      const fx = ox - px, fz = oz - pz;
      const a = dx * dx + dz * dz, b = 2 * (fx * dx + fz * dz), c = fx * fx + fz * fz - h.r * h.r;
      const disc = b * b - 4 * a * c;
      if (disc >= 0 && a > 1e-9) {
        const s = Math.sqrt(disc);
        for (const tt of [(-b - s) / (2 * a), (-b + s) / (2 * a)]) {
          if (tt <= 0) continue;
          const y = oy + dy * tt;
          if (y >= py + h.y0 * k && y <= py + h.y1 * k) { t = tt; break; }
        }
      }
    }
    if (t !== null && t < maxT && (!best || t < best.t)) best = { t, zone: h.zone };
  }
  return best;
}

export const GEAR = {
  vest: { id: 'vest', name: { tr: 'Çelik Yelek', en: 'Kevlar Vest' }, price: 650 },
  vesthelm: { id: 'vesthelm', name: { tr: 'Yelek + Kask', en: 'Kevlar + Helmet' }, price: 1000 },
  defuser: { id: 'defuser', name: { tr: 'İmha Kiti', en: 'Defuse Kit' }, price: 400, team: 'CT' },
};

// Buy menu layout (categories -> items); team-only items are filtered per team.
export const BUY_MENU = [
  { id: 'pistols', name: { tr: 'Tabancalar', en: 'Pistols' }, items: ['glock', 'usp', 'p250', 'deagle'] },
  { id: 'smgs', name: { tr: 'Hafif Makineli', en: 'SMGs' }, items: ['mac10', 'mp9', 'mp5', 'p90'] },
  { id: 'heavy', name: { tr: 'Pompalı', en: 'Heavy' }, items: ['nova'] },
  { id: 'rifles', name: { tr: 'Tüfekler', en: 'Rifles' }, items: ['galil', 'famas', 'ak47', 'm4a1', 'ssg08', 'awp'] },
  { id: 'gear', name: { tr: 'Teçhizat', en: 'Gear' }, items: ['vest', 'vesthelm', 'defuser'] },
  { id: 'grenades', name: { tr: 'Bombalar', en: 'Grenades' }, items: ['he', 'flash', 'smoke'] },
];

export const BASE_SPEED = 6.2; // m/s with knife
export const MAX_MONEY = 16000;

export function canBuy(team, id) {
  const w = WEAPONS[id] || GEAR[id];
  if (!w) return false;
  return !w.team || w.team === team;
}

export function itemPrice(id) {
  return (WEAPONS[id] || GEAR[id])?.price ?? 0;
}

// Damage after distance falloff (per 25 m like CS) and armor.
export function computeDamage(weapon, dist, zone, armor, helmet) {
  let dmg = weapon.damage * Math.pow(weapon.falloff, dist / 25);
  let mul = 1;
  if (zone === 'head') mul = weapon.headMul;
  else if (zone === 'stomach') mul = 1.25;
  else if (zone === 'legs') mul = 0.75;
  dmg *= mul;
  let armorDmg = 0;
  const armored = zone === 'head' ? helmet && armor > 0 : zone !== 'legs' && armor > 0;
  if (armored) {
    const reduced = dmg * weapon.armorPen;
    armorDmg = Math.min(armor, (dmg - reduced) * 0.5);
    dmg = reduced;
  }
  return { hp: Math.max(1, Math.round(dmg)), armor: Math.round(armorDmg) };
}

// Current inaccuracy of a weapon for a player state
export function currentSpread(w, st) {
  if (w.melee) return 0;
  let s;
  if (!st.onGround) s = w.spreadJump;
  else if (st.speed > 1.2) s = w.spreadStand + (w.spreadMove - w.spreadStand) * Math.min(1, (st.speed - 1.2) / 3.5);
  else if (st.crouch) s = w.spreadCrouch;
  else s = w.spreadStand;
  if (w.zoom) s = st.scoped && st.speed < 1.2 && st.onGround ? w.scopedSpread : s;
  return s + (st.recoil || 0) * 0.35;
}

// Deterministic spread offsets shared by client (visual) and server (hit test)
export function spreadOffsets(seed, count, spread) {
  const out = [];
  let s = seed >>> 0 || 1;
  const rnd = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
  for (let i = 0; i < count; i++) {
    const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * spread;
    out.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return out;
}
