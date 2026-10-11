// Shared game constants and room settings schema.
export const VERSION = 1;
export const TICK_RATE = 30;          // server simulation Hz
export const SNAPSHOT_RATE = 20;      // server -> client state Hz
export const INPUT_RATE = 30;         // client -> server movement Hz
export const INTERP_DELAY = 0.1;      // seconds remote players are rendered in the past
export const DEFAULT_PORT = 8090;

export const PHYS = {
  radius: 0.38,
  height: 1.8,
  crouchHeight: 1.25,
  eye: 1.64,
  crouchEye: 1.16,
  gravity: 20,
  jumpSpeed: 6.4,
  accel: 55,
  airAccel: 10,
  friction: 7,
  stopSpeed: 2,
  walkMul: 0.52,
  crouchMul: 0.34,
  stepHeight: 0.45,
};

export const MODES = {
  bomb: { id: 'bomb', name: { tr: 'Bomba Senaryosu', en: 'Bomb Defusal' }, rounds: true, teams: true, respawn: false },
  tdm: { id: 'tdm', name: { tr: 'Takım Ölüm Maçı', en: 'Team Deathmatch' }, rounds: false, teams: true, respawn: true },
  dm: { id: 'dm', name: { tr: 'Herkes Tek (FFA)', en: 'Deathmatch (FFA)' }, rounds: false, teams: false, respawn: true },
  gungame: { id: 'gungame', name: { tr: 'Silah Yarışı', en: 'Gun Game' }, rounds: false, teams: false, respawn: true },
};

export const TEAM_NAMES = {
  T: { tr: 'Saldırı Timi', en: 'Attackers' },
  CT: { tr: 'Savunma Timi', en: 'Defenders' },
  SPEC: { tr: 'İzleyici', en: 'Spectator' },
};

// Host-configurable settings with defaults and limits (validated on the server)
export const SETTINGS_SCHEMA = {
  name: { type: 'string', def: 'Faerod Odası', max: 32 },
  mode: { type: 'enum', def: 'bomb', values: Object.keys(MODES) },
  maxPlayers: { type: 'int', def: 10, min: 2, max: 16 },
  password: { type: 'string', def: '', max: 24 },
  isPublic: { type: 'bool', def: true },
  mapX: { type: 'num', def: 0, min: -900, max: 900 },
  mapZ: { type: 'num', def: 0, min: -900, max: 900 },
  mapName: { type: 'string', def: 'Özlüce', max: 40 },
  mapSize: { type: 'enum', def: 'medium', values: ['small', 'medium', 'large'] },
  maxRounds: { type: 'enum', def: 16, values: [8, 12, 16, 24, 30] },
  roundTime: { type: 'int', def: 115, min: 60, max: 300 },
  freezeTime: { type: 'int', def: 8, min: 0, max: 20 },
  buyTime: { type: 'int', def: 20, min: 5, max: 60 },
  bombTime: { type: 'int', def: 40, min: 25, max: 60 },
  startMoney: { type: 'int', def: 800, min: 800, max: 16000 },
  timeLimit: { type: 'int', def: 10, min: 3, max: 30 },     // minutes (TDM / DM)
  killLimit: { type: 'int', def: 50, min: 10, max: 200 },    // TDM / DM
  friendlyFire: { type: 'bool', def: false },
  autoBalance: { type: 'bool', def: true },
  bots: { type: 'int', def: 4, min: 0, max: 14 },
  botLevel: { type: 'enum', def: 'normal', values: ['easy', 'normal', 'hard'] },
  timeOfDay: { type: 'enum', def: 'day', values: ['day', 'evening', 'night'] },
  weather: { type: 'enum', def: 'clear', values: ['clear', 'cloudy', 'fog'] },
};

export const MAP_SIZES = { small: 170, medium: 240, large: 340 };

export function sanitizeSettings(input = {}, base = null) {
  const out = {};
  for (const [k, s] of Object.entries(SETTINGS_SCHEMA)) {
    let v = input[k] !== undefined ? input[k] : base ? base[k] : s.def;
    if (s.type === 'string') v = String(v ?? '').slice(0, s.max);
    else if (s.type === 'int') v = Math.max(s.min, Math.min(s.max, Math.round(Number(v) || s.def)));
    else if (s.type === 'num') v = Math.max(s.min, Math.min(s.max, Number(v) || 0));
    else if (s.type === 'bool') v = !!v;
    else if (s.type === 'enum') v = s.values.includes(v) ? v : s.values.includes(Number(v)) ? Number(v) : s.def;
    out[k] = v;
  }
  out.name = out.name.trim() || SETTINGS_SCHEMA.name.def;
  return out;
}

// Gun Game weapon ladder
export const GUNGAME_LADDER = ['glock', 'p250', 'deagle', 'mac10', 'mp9', 'p90', 'nova', 'galil', 'famas', 'ak47', 'm4a1', 'ssg08', 'awp', 'knife'];

export const ECON = {
  winElim: 3250, winBomb: 3500, winDefuse: 3500, winTime: 3250,
  loss: [1400, 1900, 2400, 2900, 3400], plantBonus: 300, plantTeamLossBonus: 800, defuseBonus: 300,
};

export const BOMB = { plantTime: 3.2, defuseTime: 10, defuseKitTime: 5, radius: 18, damage: 500, siteRadius: 7 };
