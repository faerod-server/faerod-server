// A game room: lobby, host settings, authoritative match simulation (rounds, economy, damage, bomb, grenades, bots).
import { buildArena, raycast, visible } from '../shared/arena.js';
import { generateLayout, applyLayout, mulberry32, navFree } from '../shared/layout.js';
import { stepBody, newBody, bodyHeight, eyeHeight, horizontalSpeed } from '../shared/physics.js';
import { WEAPONS, GEAR, SLOT, canBuy, itemPrice, computeDamage, MAX_MONEY, WEAPON_CODE, rayHitPlayer, BASE_SPEED } from '../shared/weapons.js';
import { MODES, sanitizeSettings, MAP_SIZES, ECON, BOMB, GUNGAME_LADDER, TICK_RATE, SNAPSHOT_RATE, PHYS } from '../shared/constants.js';
import { BotBrain, BOT_NAMES } from './bots.js';

const now = () => performance.now() / 1000;
let nextPlayerId = 1;

export function newPlayer(name, isBot = false) {
  return {
    id: nextPlayerId++, name, isBot, client: null, team: 'SPEC', alive: false,
    hp: 100, armor: 0, helmet: false, money: 800,
    body: newBody(), yaw: 0, pitch: 0, walk: false, scoped: false, crouchIn: false,
    inv: { primary: null, secondary: null, he: 0, flash: 0, smoke: 0, bomb: false, defuser: false },
    ammo: {}, weapon: 'knife', kills: 0, deaths: 0, assists: 0, score: 0, mvp: 0, damageBy: new Map(),
    nextFire: 0, reloadEnd: 0, reloading: null, lastIn: 0, hist: [], ready: false, ping: 0, gg: 0,
    spawnProt: 0, respawnAt: 0, flashUntil: 0, using: false, roundDamage: 0, lossStreak: 0, joinedMidRound: false,
  };
}

export class Room {
  constructor(server, code, host, settings) {
    this.server = server;
    this.code = code;
    this.settings = sanitizeSettings(settings);
    this.hostId = host.id;
    this.players = new Map();
    this.state = 'lobby'; // lobby | loading | playing | ended
    this.created = Date.now();
    this.banned = new Set();
    this.bots = [];
    this.lastSnap = 0;
    this.grenades = [];
    this.smokes = [];
    this.items = [];          // dropped weapons
    this.nextEntity = 1;
    this.add(host);
  }

  // ------------------------------------------------------------------ messaging
  send(p, msg) { if (p.client) p.client.send(msg); }
  broadcast(msg, except = null) { for (const p of this.players.values()) if (p !== except && p.client) p.client.send(msg); }
  sys(key, args = {}) { this.broadcast({ t: 'sys', key, args }); }

  info(full = false) {
    const s = { ...this.settings };
    const locked = !!s.password;
    delete s.password;
    const o = {
      code: this.code, name: s.name, mode: s.mode, mapName: s.mapName, players: this.humanCount(), bots: this.bots.length,
      max: s.maxPlayers, locked, state: this.state, isPublic: s.isPublic,
    };
    if (full) {
      o.settings = s;
      o.hostId = this.hostId;
      o.list = [...this.players.values()].map((p) => ({ id: p.id, name: p.name, team: p.team, bot: p.isBot, ping: p.ping, kills: p.kills, deaths: p.deaths, score: p.score }));
      o.score = this.score || { T: 0, CT: 0 };
    }
    return o;
  }
  humanCount() { let n = 0; for (const p of this.players.values()) if (!p.isBot) n++; return n; }
  pushRoom() { this.broadcast({ t: 'room', room: this.info(true) }); }

  // ------------------------------------------------------------------ lobby
  canJoin(password, playerKey) {
    if (this.banned.has(playerKey)) return 'banned';
    if (this.humanCount() >= this.settings.maxPlayers) return 'full';
    if (this.settings.password && password !== this.settings.password) return 'password';
    return null;
  }

  add(p) {
    this.players.set(p.id, p);
    p.room = this;
    p.money = this.settings.startMoney;
    p.team = this.autoTeam();
    p.ready = false;
    if (this.state === 'playing' || this.state === 'loading') {
      p.joinedMidRound = true;
      if (MODES[this.settings.mode].respawn) p.respawnAt = now() + 4;
    }
    this.balanceBots();
    this.pushRoom();
    this.sys('joined', { name: p.name });
  }

  remove(p) {
    if (!this.players.has(p.id)) return;
    if (p.alive && p.inv.bomb) this.dropBomb(p);
    this.players.delete(p.id);
    this.sys('left', { name: p.name });
    if (p.id === this.hostId) {
      const next = [...this.players.values()].find((q) => !q.isBot);
      if (next) { this.hostId = next.id; this.sys('newHost', { name: next.name }); }
    }
    if (this.humanCount() === 0) { this.server.closeRoom(this); return; }
    this.balanceBots();
    this.pushRoom();
  }

  autoTeam() {
    if (!MODES[this.settings.mode].teams) return 'T';
    let t = 0, ct = 0;
    for (const p of this.players.values()) { if (p.team === 'T') t++; else if (p.team === 'CT') ct++; }
    return t <= ct ? 'T' : 'CT';
  }

  setTeam(p, team) {
    if (!['T', 'CT', 'SPEC'].includes(team)) team = this.autoTeam();
    if (!MODES[this.settings.mode].teams && team !== 'SPEC') team = 'T';
    if (p.team === team) return;
    if (p.alive) this.killPlayer(p, null, 'suicide', false, true);
    p.team = team;
    this.balanceBots();
    this.pushRoom();
    if (this.state === 'playing' && MODES[this.settings.mode].respawn && team !== 'SPEC') p.respawnAt = now() + 1;
  }

  updateSettings(p, s) {
    if (p.id !== this.hostId) return;
    const before = this.settings;
    this.settings = sanitizeSettings(s, before);
    if (s.password === undefined) this.settings.password = before.password;
    if (this.state !== 'lobby') {
      // map / mode changes only apply in the lobby
      for (const k of ['mode', 'mapX', 'mapZ', 'mapName', 'mapSize']) this.settings[k] = before[k];
    }
    this.balanceBots();
    this.pushRoom();
  }

  balanceBots() {
    const want = this.settings.bots;
    const mode = MODES[this.settings.mode];
    // total slots used by humans + bots must not exceed 16
    const target = Math.max(0, Math.min(want, 16 - this.humanCount()));
    while (this.bots.length > target) {
      const b = this.bots.pop();
      this.players.delete(b.id);
    }
    while (this.bots.length < target) {
      const used = new Set([...this.players.values()].map((p) => p.name));
      const name = 'BOT ' + (BOT_NAMES.find((n) => !used.has('BOT ' + n)) || 'Faerod' + this.bots.length);
      const b = newPlayer(name, true);
      b.room = this;
      b.money = this.settings.startMoney;
      b.team = this.autoTeam();
      b.brain = new BotBrain(this, b, this.settings.botLevel);
      this.players.set(b.id, b);
      this.bots.push(b);
      if (this.state === 'playing' && mode.respawn) b.respawnAt = now() + 1;
    }
    for (const b of this.bots) b.brain.level = this.settings.botLevel;
    if (mode.teams && this.settings.autoBalance) {
      // move bots to balance teams
      let guard = 20;
      while (guard--) {
        let t = 0, ct = 0;
        for (const p of this.players.values()) { if (p.team === 'T') t++; else if (p.team === 'CT') ct++; }
        if (Math.abs(t - ct) <= 1) break;
        const from = t > ct ? 'T' : 'CT';
        const bot = this.bots.find((b) => b.team === from);
        if (!bot) break;
        if (bot.alive) this.killPlayer(bot, null, 'suicide', false, true);
        bot.team = from === 'T' ? 'CT' : 'T';
      }
    }
  }

  kick(host, id) {
    if (host.id !== this.hostId || id === host.id) return;
    const p = this.players.get(id);
    if (!p) return;
    if (p.isBot) { this.bots = this.bots.filter((b) => b !== p); this.players.delete(p.id); this.settings.bots = this.bots.length; this.pushRoom(); return; }
    this.banned.add(p.key);
    this.send(p, { t: 'kicked' });
    this.remove(p);
    p.room = null;
  }

  // ------------------------------------------------------------------ match start
  start(p) {
    if (p && p.id !== this.hostId) return;
    if (this.state === 'loading') return;
    const s = this.settings;
    const t0 = Date.now();
    this.arena = buildArena(this.server.region, this.server.index, { cx: s.mapX, cz: s.mapZ, size: MAP_SIZES[s.mapSize] });
    this.seed = (Math.random() * 2 ** 31) | 0;
    this.layout = generateLayout(this.arena, this.seed, s.mode);
    applyLayout(this.arena, this.layout);
    this.nav = this.layout.nav;
    console.log(`[${this.code}] arena ${s.mapName} ${this.arena.buildings.length} buildings, ${this.layout.props.length} props, sites ${this.layout.sites.length} in ${Date.now() - t0} ms`);
    this.state = 'loading';
    this.score = { T: 0, CT: 0 };
    this.round = 0;
    this.matchStart = now();
    this.grenades = []; this.smokes = []; this.items = [];
    this.bomb = null;
    for (const q of this.players.values()) {
      Object.assign(q, { kills: 0, deaths: 0, assists: 0, score: 0, mvp: 0, gg: 0, money: s.startMoney, lossStreak: 0, ready: q.isBot, alive: false, joinedMidRound: false });
      q.inv = { primary: null, secondary: null, he: 0, flash: 0, smoke: 0, bomb: false, defuser: false };
      q.ammo = {};
    }
    this.lossStreak = { T: 0, CT: 0 };
    this.broadcast(this.startMessage());
    this.loadingUntil = now() + 12;
    this.pushRoom();
  }

  startMessage() {
    const { nav, ...layout } = this.layout;
    const s = { ...this.settings };
    delete s.password;
    return { t: 'start', arena: { cx: this.arena.cx, cz: this.arena.cz, size: this.arena.size }, layout, settings: s };
  }

  setReady(p) {
    p.ready = true;
    if (this.state === 'loading' && [...this.players.values()].every((q) => q.ready)) this.beginMatch();
    else if (this.state === 'playing') this.sendMe(p);
  }

  beginMatch() {
    this.state = 'playing';
    const mode = MODES[this.settings.mode];
    if (mode.rounds) this.startRound();
    else {
      this.phase = 'live';
      this.phaseEnd = now() + this.settings.timeLimit * 60;
      for (const p of this.players.values()) if (p.team !== 'SPEC') this.spawn(p);
      this.broadcast({ t: 'round', round: 0, phase: 'live', time: this.settings.timeLimit * 60 });
    }
    this.pushRoom();
  }

  // ------------------------------------------------------------------ rounds (bomb mode)
  startRound() {
    const s = this.settings;
    this.round++;
    const half = s.maxRounds / 2;
    if (this.round === half + 1) {
      // half time: swap sides, reset economy
      for (const p of this.players.values()) {
        if (p.team === 'T') p.team = 'CT'; else if (p.team === 'CT') p.team = 'T';
        p.money = s.startMoney; p.inv = { primary: null, secondary: null, he: 0, flash: 0, smoke: 0, bomb: false, defuser: false }; p.armor = 0; p.helmet = false;
        p.alive = false;
      }
      this.score = { T: this.score.CT, CT: this.score.T };
      this.lossStreak = { T: 0, CT: 0 };
      this.sys('halftime');
    }
    this.grenades = []; this.smokes = []; this.items = [];
    this.bomb = null;
    this.phase = 'freeze';
    this.phaseEnd = now() + s.freezeTime;
    this.buyEnd = now() + s.freezeTime + s.buyTime;
    this.roundDamage = new Map();
    for (const p of this.players.values()) {
      if (p.team === 'SPEC') { p.alive = false; continue; }
      const keep = p.alive; // survivors keep their gear
      this.spawn(p, keep);
      p.joinedMidRound = false;
    }
    // give the bomb to a random attacker
    const ts = [...this.players.values()].filter((p) => p.team === 'T' && p.alive);
    if (ts.length) { const c = ts[Math.floor(Math.random() * ts.length)]; c.inv.bomb = true; this.sendMe(c); }
    this.broadcast({ t: 'round', round: this.round, phase: 'freeze', time: s.freezeTime, buyTime: s.freezeTime + s.buyTime, score: this.score });
  }

  endRound(winner, reason) {
    if (this.phase === 'post') return;
    const s = this.settings;
    this.phase = 'post';
    this.phaseEnd = now() + 5;
    this.score[winner]++;
    const loser = winner === 'T' ? 'CT' : 'T';
    this.lossStreak[winner] = 0;
    const lossIdx = Math.min(ECON.loss.length - 1, this.lossStreak[loser]);
    this.lossStreak[loser]++;
    const winMoney = reason === 'bomb' ? ECON.winBomb : reason === 'defuse' ? ECON.winDefuse : reason === 'time' ? ECON.winTime : ECON.winElim;
    for (const p of this.players.values()) {
      if (p.team === winner) this.addMoney(p, winMoney);
      else if (p.team === loser) {
        // attackers who ran out the clock without planting get nothing if alive
        if (!(reason === 'time' && p.team === 'T' && p.alive)) this.addMoney(p, ECON.loss[lossIdx] + (this.bombWasPlanted && p.team === 'T' ? ECON.plantTeamLossBonus : 0));
      }
    }
    // MVP: most damage on the winning team
    let mvp = null, best = -1;
    for (const p of this.players.values()) if (p.team === winner && (this.roundDamage.get(p.id) || 0) > best) { best = this.roundDamage.get(p.id) || 0; mvp = p; }
    if (mvp) mvp.mvp++;
    this.bombWasPlanted = false;
    const over = this.score[winner] > s.maxRounds / 2 || this.round >= s.maxRounds;
    this.broadcast({ t: 'roundEnd', winner, reason, score: this.score, mvp: mvp ? mvp.name : null, over });
    for (const p of this.players.values()) this.sendMe(p);
    if (over) this.endMatch(this.score.T === this.score.CT ? 'draw' : winner);
    this.pushRoom();
  }

  endMatch(winner) {
    this.state = 'ended';
    this.phase = 'ended';
    const stats = [...this.players.values()].filter((p) => p.team !== 'SPEC').map((p) => ({ id: p.id, name: p.name, team: p.team, kills: p.kills, deaths: p.deaths, assists: p.assists, score: p.score, mvp: p.mvp, bot: p.isBot }));
    stats.sort((a, b) => b.score - a.score);
    this.broadcast({ t: 'match', winner, stats, score: this.score });
    this.returnAt = now() + 15;
  }

  addMoney(p, v) { p.money = Math.max(0, Math.min(MAX_MONEY, p.money + v)); }

  // ------------------------------------------------------------------ spawning & loadouts
  spawnPoint(p) {
    const mode = MODES[this.settings.mode];
    const L = this.layout;
    if (!mode.teams || this.settings.mode === 'tdm') {
      // pick the free spot farthest from living enemies (random among good candidates)
      const enemies = [...this.players.values()].filter((q) => q.alive && q !== p && (!mode.teams || q.team !== p.team));
      let best = null, bestScore = -1;
      const pool = mode.teams ? L.spawns[p.team] || [] : [...L.spawns.T, ...L.spawns.CT];
      const candidates = [...pool];
      if (!mode.teams || this.settings.mode === 'tdm') {
        for (let i = 0; i < 40; i++) {
          const x = (Math.random() - 0.5) * (this.arena.size - 8), z = (Math.random() - 0.5) * (this.arena.size - 8);
          if (navFree(this.nav, x, z) && navFree(this.nav, x + 1, z) && navFree(this.nav, x - 1, z) && navFree(this.nav, x, z + 1) && navFree(this.nav, x, z - 1)) candidates.push({ x, z, y: this.arena.ground(x, z) });
        }
      }
      for (const c of candidates) {
        let d = 200;
        for (const e of enemies) d = Math.min(d, Math.hypot(e.body.x - c.x, e.body.z - c.z));
        const sc = d + Math.random() * 15;
        if (sc > bestScore) { bestScore = sc; best = c; }
      }
      if (best) return { ...best, yaw: Math.random() * Math.PI * 2 };
    }
    const list = L.spawns[p.team] || L.spawns.T;
    const used = [...this.players.values()].filter((q) => q.alive && q !== p);
    for (const sp of list) if (!used.some((q) => Math.hypot(q.body.x - sp.x, q.body.z - sp.z) < 1.2)) return sp;
    return list[Math.floor(Math.random() * list.length)] || { x: 0, z: 0, y: 0, yaw: 0 };
  }

  spawn(p, keepGear = false) {
    const sp = this.spawnPoint(p);
    p.body = newBody(sp.x, this.arena.ground(sp.x, sp.z), sp.z);
    p.yaw = sp.yaw || 0; p.pitch = 0;
    p.alive = true; p.hp = 100;
    p.spawnProt = now() + (MODES[this.settings.mode].respawn ? 2.5 : 0);
    p.reloading = null; p.scoped = false; p.using = false; p.flashUntil = 0;
    p.hist = [];
    p.damageBy = new Map();
    const mode = this.settings.mode;
    if (mode === 'gungame') {
      const w = GUNGAME_LADDER[Math.min(p.gg, GUNGAME_LADDER.length - 1)];
      p.inv = { primary: null, secondary: null, he: 0, flash: 0, smoke: 0, bomb: false, defuser: false };
      p.armor = 100; p.helmet = true;
      if (WEAPONS[w].slot === SLOT.PRIMARY) p.inv.primary = w; else if (WEAPONS[w].slot === SLOT.SECONDARY) p.inv.secondary = w;
      p.weapon = w;
    } else if (mode === 'tdm' || mode === 'dm') {
      if (!p.loadout) p.loadout = { primary: p.team === 'CT' ? 'm4a1' : 'ak47', secondary: p.team === 'CT' ? 'usp' : 'glock' };
      p.inv = { primary: p.loadout.primary, secondary: p.loadout.secondary, he: 1, flash: 0, smoke: 0, bomb: false, defuser: false };
      if (!canBuy(p.team, p.inv.primary)) p.inv.primary = p.team === 'CT' ? 'm4a1' : 'ak47';
      if (!canBuy(p.team, p.inv.secondary)) p.inv.secondary = p.team === 'CT' ? 'usp' : 'glock';
      p.armor = 100; p.helmet = true;
      p.weapon = p.inv.primary;
    } else {
      if (!keepGear) {
        p.inv = { primary: null, secondary: p.team === 'CT' ? 'usp' : 'glock', he: 0, flash: 0, smoke: 0, bomb: false, defuser: false };
        p.armor = 0; p.helmet = false;
      }
      p.inv.bomb = false;
      if (!p.inv.secondary && !p.inv.primary) p.inv.secondary = p.team === 'CT' ? 'usp' : 'glock';
      p.weapon = p.inv.primary || p.inv.secondary || 'knife';
    }
    for (const w of [p.inv.primary, p.inv.secondary]) if (w && (!keepGear || !p.ammo[w])) p.ammo[w] = { mag: WEAPONS[w].mag, res: WEAPONS[w].reserve };
    if (keepGear) for (const w of [p.inv.primary, p.inv.secondary]) if (w) p.ammo[w] = { mag: WEAPONS[w].mag, res: WEAPONS[w].reserve };
    this.send(p, { t: 'spawn', x: p.body.x, y: p.body.y, z: p.body.z, yaw: p.yaw });
    this.sendMe(p);
  }

  sendMe(p) {
    if (!p.client) return;
    this.send(p, {
      t: 'me', money: p.money, hp: p.hp, armor: p.armor, helmet: p.helmet, alive: p.alive, team: p.team,
      inv: p.inv, ammo: p.ammo, weapon: p.weapon, gg: p.gg,
    });
  }

  // ------------------------------------------------------------------ input handling
  handle(p, m) {
    switch (m.t) {
      case 'in': return this.onMove(p, m);
      case 'fire': return this.onFire(p, m);
      case 'reload': return this.startReload(p);
      case 'sw': return this.switchWeapon(p, m.w);
      case 'buy': return this.buy(p, m.item);
      case 'loadout': return this.setLoadout(p, m);
      case 'drop': return this.dropCurrent(p);
      case 'nade': return this.throwGrenade(p, m);
      case 'use': p.using = !!m.on; return;
      case 'scope': p.scoped = !!m.on; return;
      case 'ready': return this.setReady(p);
      case 'team': return this.setTeam(p, m.team);
      case 'settings': return this.updateSettings(p, m.settings || {});
      case 'start': return this.start(p);
      case 'kick': return this.kick(p, m.id);
      case 'bots': if (p.id === this.hostId) { this.settings.bots = Math.max(0, Math.min(14, m.n | 0)); this.balanceBots(); this.pushRoom(); } return;
      case 'chat': {
        const text = String(m.text || '').slice(0, 120).trim();
        if (!text) return;
        const msg = { t: 'chat', from: p.name, team: p.team, teamOnly: !!m.team, text, dead: !p.alive && this.state === 'playing' };
        for (const q of this.players.values()) if (!m.team || q.team === p.team) this.send(q, msg);
        return;
      }
      case 'toLobby': if (p.id === this.hostId) this.toLobby(); return;
    }
  }

  frozen() { return this.phase === 'freeze' || this.state !== 'playing'; }

  onMove(p, m) {
    if (!p.alive || this.state !== 'playing') return;
    const t = now();
    p.yaw = +m.yaw || 0; p.pitch = Math.max(-1.55, Math.min(1.55, +m.pitch || 0));
    p.walk = !!m.walk; p.crouchIn = !!m.crouch;
    const b = p.body;
    const nx = +m.x, ny = +m.y, nz = +m.z;
    if (![nx, ny, nz].every(Number.isFinite)) return;
    if (this.frozen()) { if (Math.hypot(nx - b.x, nz - b.z) > 0.6) this.send(p, { t: 'corr', x: b.x, y: b.y, z: b.z }); return; }
    const dt = Math.min(0.5, Math.max(0.01, t - (p.lastIn || t - 0.033)));
    p.lastIn = t;
    const maxStep = BASE_SPEED * 1.35 * dt + 0.35;
    const d = Math.hypot(nx - b.x, nz - b.z);
    let ok = d <= maxStep && Math.abs(nx) <= this.arena.half && Math.abs(nz) <= this.arena.half && ny < b.y + 3 && ny > this.arena.ground(nx, nz) - 1.5;
    if (ok && d > 0.05) {
      // no walking through walls
      const hit = raycast(this.arena, b.x, b.y + 0.6, b.z, (nx - b.x) / d, 0, (nz - b.z) / d, d);
      if (hit && hit.what !== 'ground' && hit.what !== 'prop') ok = false;
    }
    if (!ok) { this.send(p, { t: 'corr', x: b.x, y: b.y, z: b.z }); return; }
    b.vx = (nx - b.x) / dt; b.vz = (nz - b.z) / dt;
    b.x = nx; b.y = ny; b.z = nz;
    b.crouch = Math.max(0, Math.min(1, +m.c || 0));
    b.onGround = !!m.g;
    if (Math.hypot(b.vx, b.vz) > 0.5) p.spawnProt = Math.min(p.spawnProt, t + 0.3);
  }

  // ------------------------------------------------------------------ weapons
  switchWeapon(p, w) {
    if (!p.alive) return;
    const has = w === 'knife' || p.inv.primary === w || p.inv.secondary === w || (WEAPONS[w]?.grenade && p.inv[w] > 0) || (w === 'bomb' && p.inv.bomb);
    if (!has) return;
    p.weapon = w;
    p.reloading = null;
    p.scoped = false;
    p.nextFire = Math.max(p.nextFire, now() + 0.35);
  }

  startReload(p) {
    const w = WEAPONS[p.weapon];
    const a = p.ammo[p.weapon];
    if (!p.alive || !w || w.melee || w.grenade || !a || a.mag >= w.mag || a.res <= 0 || p.reloading) return;
    p.reloading = p.weapon;
    p.reloadEnd = now() + w.reload;
    p.scoped = false;
    this.broadcast({ t: 'reload', id: p.id }, p);
  }

  finishReload(p) {
    const w = WEAPONS[p.reloading], a = p.ammo[p.reloading];
    if (a) { const take = Math.min(w.mag - a.mag, a.res); a.mag += take; a.res -= take; }
    p.reloading = null;
    this.sendMe(p);
  }

  onFire(p, m) {
    if (!p.alive || this.state !== 'playing' || this.phase === 'freeze') return;
    const w = WEAPONS[p.weapon];
    if (!w || w.grenade || w.id === 'bomb' || m.w !== p.weapon) return;
    const t = now();
    if (t < p.nextFire - 0.03) return;
    if (p.reloading) return;
    p.nextFire = t + 60 / w.rpm;
    const o = m.o, dirs = m.d;
    if (!Array.isArray(o) || !Array.isArray(dirs) || !o.every(Number.isFinite)) return;
    // origin must be near the player's eye
    const ey = p.body.y + eyeHeight(p.body);
    if (Math.hypot(o[0] - p.body.x, o[1] - ey, o[2] - p.body.z) > 1.2) return;
    if (!w.melee) {
      const a = p.ammo[p.weapon];
      if (!a || a.mag <= 0) return;
      a.mag--;
    }
    p.spawnProt = 0;
    // lag compensation: rewind other players to what the shooter saw
    const rewind = Math.max(t - 0.4, Math.min(t, t - (p.ping || 0) / 2000 - 0.1));
    const pellets = dirs.slice(0, w.pellets);
    const hitsByVictim = new Map();
    let shotEnd = null;
    for (const d of pellets) {
      if (!Array.isArray(d) || !d.every(Number.isFinite)) continue;
      const l = Math.hypot(d[0], d[1], d[2]) || 1;
      const dx = d[0] / l, dy = d[1] / l, dz = d[2] / l;
      const range = w.melee ? w.range : w.range;
      const wh = raycast(this.arena, o[0], o[1], o[2], dx, dy, dz, range);
      let maxT = wh ? wh.t : range;
      let victim = null, zone = null;
      for (const q of this.players.values()) {
        if (q === p || !q.alive) continue;
        const pos = this.historyAt(q, rewind);
        const h = rayHitPlayer(o[0], o[1], o[2], dx, dy, dz, pos.x, pos.y, pos.z, pos.c, maxT);
        if (h) { maxT = h.t; victim = q; zone = h.zone; }
      }
      // smoke does not stop bullets (only sight)
      if (victim) {
        const e = hitsByVictim.get(victim) || { dmg: 0, armor: 0, head: false, dist: maxT, pos: [o[0] + dx * maxT, o[1] + dy * maxT, o[2] + dz * maxT] };
        const dm = computeDamage(w, maxT, zone, victim.armor, victim.helmet);
        let hpDmg = dm.hp;
        if (w.melee) hpDmg = this.knifeDamage(p, victim, m.heavy);
        e.dmg += hpDmg; e.armor += dm.armor; e.head = e.head || zone === 'head';
        hitsByVictim.set(victim, e);
      }
      if (!shotEnd) shotEnd = [o[0] + dx * maxT, o[1] + dy * maxT, o[2] + dz * maxT, wh && !victim ? 1 : 0];
    }
    if (!w.melee) this.broadcast({ t: 'shot', id: p.id, w: p.weapon, o, e: shotEnd }, p);
    else this.broadcast({ t: 'slash', id: p.id }, p);
    for (const [victim, e] of hitsByVictim) this.damage(p, victim, e.dmg, e.armor, w, e.head, e.pos);
  }

  knifeDamage(p, victim, heavy) {
    // backstab when hitting from behind
    const ang = Math.atan2(-(victim.body.x - p.body.x), -(victim.body.z - p.body.z));
    let diff = Math.abs(((ang - victim.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    const back = diff < Math.PI / 3;
    if (back) return heavy ? 180 : 90;
    return heavy ? 65 : 40;
  }

  historyAt(q, t) {
    const h = q.hist;
    if (!h.length || t >= h[h.length - 1].t) return { x: q.body.x, y: q.body.y, z: q.body.z, c: q.body.crouch };
    for (let i = h.length - 1; i > 0; i--) {
      if (h[i - 1].t <= t) {
        const a = h[i - 1], b = h[i], k = (t - a.t) / (b.t - a.t || 1);
        return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, z: a.z + (b.z - a.z) * k, c: a.c + (b.c - a.c) * k };
      }
    }
    return { x: h[0].x, y: h[0].y, z: h[0].z, c: h[0].c };
  }

  damage(attacker, victim, hp, armorDmg, weapon, head, pos) {
    if (!victim.alive) return;
    const mode = MODES[this.settings.mode];
    const sameTeam = attacker && mode.teams && attacker.team === victim.team && attacker !== victim;
    if (sameTeam && !this.settings.friendlyFire) return;
    if (victim.spawnProt > now()) return;
    if (sameTeam) hp = Math.round(hp * 0.35);
    hp = Math.min(hp, victim.hp);
    victim.hp -= hp;
    victim.armor = Math.max(0, victim.armor - armorDmg);
    if (victim.armor === 0) victim.helmet = false;
    if (attacker && attacker !== victim) {
      victim.damageBy.set(attacker.id, (victim.damageBy.get(attacker.id) || 0) + hp);
      if (this.roundDamage && !sameTeam) this.roundDamage.set(attacker.id, (this.roundDamage.get(attacker.id) || 0) + hp);
    }
    const ev = { t: 'hit', a: attacker ? attacker.id : 0, v: victim.id, dmg: hp, head, pos: pos && pos.map((v) => Math.round(v * 100) / 100), hp: victim.hp };
    this.broadcast(ev);
    if (victim.hp <= 0) this.killPlayer(victim, attacker, weapon ? weapon.id : 'world', head);
    else this.sendMe(victim);
  }

  killPlayer(victim, killer, weaponId, head, silent = false) {
    if (!victim.alive) return;
    victim.alive = false;
    victim.hp = 0;
    victim.deaths++;
    victim.reloading = null;
    const mode = MODES[this.settings.mode];
    const w = WEAPONS[weaponId];
    let assist = null;
    if (killer && killer !== victim) {
      const sameTeam = mode.teams && killer.team === victim.team;
      if (sameTeam) { killer.kills--; killer.score -= 2; this.addMoney(killer, -300); }
      else {
        killer.kills++;
        killer.score += 2;
        if (this.settings.mode === 'bomb') this.addMoney(killer, w ? w.reward : 300);
        if (this.settings.mode === 'gungame') this.gungameAdvance(killer, weaponId);
      }
      for (const [aid, dmg] of victim.damageBy) {
        if (aid !== killer.id && dmg >= 40) { const a = this.players.get(aid); if (a && (!mode.teams || a.team !== victim.team)) { a.assists++; a.score += 1; assist = a.name; } break; }
      }
      this.sendMe(killer);
    } else if (!silent) victim.score -= 1;
    // drop gear
    if (this.settings.mode === 'bomb') {
      if (victim.inv.bomb) this.dropBomb(victim);
      const drop = victim.inv.primary || (victim.inv.secondary && victim.inv.secondary !== 'glock' && victim.inv.secondary !== 'usp' ? victim.inv.secondary : null);
      if (drop) this.dropItem(drop, victim.body.x, victim.body.y, victim.body.z, victim.ammo[drop]);
      victim.inv = { primary: null, secondary: null, he: 0, flash: 0, smoke: 0, bomb: false, defuser: false };
      victim.armor = 0; victim.helmet = false;
    }
    if (!silent || killer) this.broadcast({ t: 'kill', k: killer ? killer.id : 0, kn: killer ? killer.name : '', kt: killer ? killer.team : '', v: victim.id, vn: victim.name, vt: victim.team, w: weaponId, head: !!head, assist });
    this.sendMe(victim);
    if (mode.respawn) victim.respawnAt = now() + (this.settings.mode === 'dm' ? 2 : 3);
    this.checkRoundEnd();
    this.checkLimits();
    this.pushRoom();
  }

  gungameAdvance(p, weaponId) {
    p.gg++;
    if (p.gg >= GUNGAME_LADDER.length) { this.endMatch(p.name); return; }
    const w = GUNGAME_LADDER[p.gg];
    p.inv.primary = WEAPONS[w].slot === SLOT.PRIMARY ? w : null;
    p.inv.secondary = WEAPONS[w].slot === SLOT.SECONDARY ? w : null;
    p.ammo[w] = { mag: WEAPONS[w].mag, res: WEAPONS[w].reserve };
    p.weapon = w;
    this.send(p, { t: 'gg', level: p.gg, weapon: w });
  }

  checkLimits() {
    const s = this.settings;
    if (this.state !== 'playing' || MODES[s.mode].rounds) return;
    if (s.mode === 'tdm') {
      const k = { T: 0, CT: 0 };
      for (const p of this.players.values()) if (p.team in k) k[p.team] += p.kills;
      this.score = k;
      if (k.T >= s.killLimit || k.CT >= s.killLimit) this.endMatch(k.T >= s.killLimit ? 'T' : 'CT');
    } else if (s.mode === 'dm') {
      for (const p of this.players.values()) if (p.kills >= s.killLimit) { this.endMatch(p.name); break; }
    }
  }

  dropItem(w, x, y, z, ammo) {
    const it = { id: this.nextEntity++, w, x, y: this.arena.ground(x, z) + 0.05, z, ammo: ammo ? { ...ammo } : { mag: WEAPONS[w].mag, res: WEAPONS[w].reserve }, t: now() };
    this.items.push(it);
    if (this.items.length > 30) this.items.shift();
  }

  dropCurrent(p) {
    if (!p.alive) return;
    const w = p.weapon;
    if (w === 'bomb' && p.inv.bomb) { this.dropBomb(p); p.weapon = p.inv.primary || p.inv.secondary || 'knife'; this.sendMe(p); return; }
    if (w === 'knife' || WEAPONS[w].grenade) return;
    const f = [-Math.sin(p.yaw), -Math.cos(p.yaw)];
    this.dropItem(w, p.body.x + f[0] * 1.2, p.body.y, p.body.z + f[1] * 1.2, p.ammo[w]);
    if (p.inv.primary === w) p.inv.primary = null; else if (p.inv.secondary === w) p.inv.secondary = null;
    p.weapon = p.inv.primary || p.inv.secondary || 'knife';
    p.pickupBlock = now() + 1;
    this.sendMe(p);
  }

  dropBomb(p) {
    p.inv.bomb = false;
    this.bomb = { state: 'dropped', x: p.body.x, y: this.arena.ground(p.body.x, p.body.z) + 0.1, z: p.body.z };
    this.sys('bombDropped');
  }

  buy(p, item) {
    if (!p.alive || this.settings.mode !== 'bomb' || this.state !== 'playing') return;
    if (now() > this.buyEnd) { this.send(p, { t: 'err', code: 'buyTime' }); return; }
    const sp = p.team === 'T' ? this.layout.tSpawn : this.layout.ctSpawn;
    if (Math.hypot(p.body.x - sp.x, p.body.z - sp.z) > 22) { this.send(p, { t: 'err', code: 'buyZone' }); return; }
    if (!canBuy(p.team, item)) return;
    const price = itemPrice(item);
    if (p.money < price) { this.send(p, { t: 'err', code: 'money' }); return; }
    const w = WEAPONS[item];
    if (w) {
      if (w.grenade) {
        const max = item === 'flash' ? 2 : 1;
        const total = p.inv.he + p.inv.flash + p.inv.smoke;
        if (p.inv[item] >= max || total >= 4) return;
        p.inv[item]++;
      } else if (w.slot === SLOT.PRIMARY) {
        if (p.inv.primary === item) return;
        if (p.inv.primary) this.dropItem(p.inv.primary, p.body.x, p.body.y, p.body.z, p.ammo[p.inv.primary]);
        p.inv.primary = item; p.ammo[item] = { mag: w.mag, res: w.reserve }; p.weapon = item;
      } else if (w.slot === SLOT.SECONDARY) {
        if (p.inv.secondary === item) return;
        p.inv.secondary = item; p.ammo[item] = { mag: w.mag, res: w.reserve }; p.weapon = item;
      }
    } else if (item === 'vest') { if (p.armor >= 100) return; p.armor = 100; }
    else if (item === 'vesthelm') {
      if (p.armor >= 100 && p.helmet) return;
      const cost = p.armor >= 100 ? 350 : price;
      if (p.money < cost) return;
      p.armor = 100; p.helmet = true; p.money -= cost; this.sendMe(p); return;
    } else if (item === 'defuser') { if (p.inv.defuser || p.team !== 'CT') return; p.inv.defuser = true; }
    p.money -= price;
    this.sendMe(p);
  }

  setLoadout(p, m) {
    if (this.settings.mode !== 'tdm' && this.settings.mode !== 'dm') return;
    const pri = WEAPONS[m.primary], sec = WEAPONS[m.secondary];
    p.loadout = {
      primary: pri && pri.slot === SLOT.PRIMARY && canBuy(p.team, m.primary) ? m.primary : (p.loadout?.primary || 'ak47'),
      secondary: sec && sec.slot === SLOT.SECONDARY && canBuy(p.team, m.secondary) ? m.secondary : (p.loadout?.secondary || 'glock'),
    };
  }

  // ------------------------------------------------------------------ grenades
  throwGrenade(p, m) {
    const type = m.g;
    if (!p.alive || !['he', 'flash', 'smoke'].includes(type) || p.inv[type] <= 0 || this.phase === 'freeze') return;
    const o = m.o, v = m.v;
    if (!Array.isArray(o) || !Array.isArray(v) || !o.every(Number.isFinite) || !v.every(Number.isFinite)) return;
    const sp = Math.hypot(v[0], v[1], v[2]);
    const k = sp > 22 ? 22 / sp : 1;
    p.inv[type]--;
    if (p.weapon === type && p.inv[type] <= 0) p.weapon = p.inv.primary || p.inv.secondary || 'knife';
    const g = { id: this.nextEntity++, type, owner: p.id, x: o[0], y: o[1], z: o[2], vx: v[0] * k, vy: v[1] * k, vz: v[2] * k, fuse: now() + (type === 'he' ? 1.6 : type === 'flash' ? 1.4 : 1.8), rest: false };
    this.grenades.push(g);
    this.broadcast({ t: 'throw', id: p.id, g: type });
    this.sendMe(p);
  }

  updateGrenades(dt) {
    const t = now();
    for (const g of [...this.grenades]) {
      if (!g.rest) {
        g.vy -= 14 * dt;
        const steps = 3;
        for (let s = 0; s < steps; s++) {
          const sdt = dt / steps;
          const sp = Math.hypot(g.vx, g.vy, g.vz);
          if (sp < 1e-3) break;
          const dx = g.vx / sp, dy = g.vy / sp, dz = g.vz / sp;
          const dist = sp * sdt;
          const hit = raycast(this.arena, g.x, g.y, g.z, dx, dy, dz, dist + 0.08);
          if (hit) {
            g.x += dx * Math.max(0, hit.t - 0.08); g.y += dy * Math.max(0, hit.t - 0.08); g.z += dz * Math.max(0, hit.t - 0.08);
            const vn = g.vx * hit.nx + g.vy * hit.ny + g.vz * hit.nz;
            g.vx = (g.vx - 2 * vn * hit.nx) * 0.45; g.vy = (g.vy - 2 * vn * hit.ny) * 0.45; g.vz = (g.vz - 2 * vn * hit.nz) * 0.45;
            if (hit.ny > 0.7 && Math.hypot(g.vx, g.vy, g.vz) < 1.2) { g.rest = true; g.vx = g.vy = g.vz = 0; }
            this.broadcast({ t: 'bounce', x: g.x, y: g.y, z: g.z });
          } else { g.x += g.vx * sdt; g.y += g.vy * sdt; g.z += g.vz * sdt; }
        }
        const lim = this.arena.half;
        if (Math.abs(g.x) > lim || Math.abs(g.z) > lim) { g.vx *= -0.4; g.vz *= -0.4; g.x = Math.max(-lim, Math.min(lim, g.x)); g.z = Math.max(-lim, Math.min(lim, g.z)); }
      }
      if (t >= g.fuse) {
        this.grenades.splice(this.grenades.indexOf(g), 1);
        this.explode(g);
      }
    }
    this.smokes = this.smokes.filter((s) => s.until > t);
  }

  explode(g) {
    const owner = this.players.get(g.owner);
    this.broadcast({ t: 'boom', g: g.type, x: g.x, y: g.y, z: g.z });
    if (g.type === 'he') {
      for (const q of this.players.values()) {
        if (!q.alive) continue;
        const cy = q.body.y + 1.0;
        const d = Math.hypot(q.body.x - g.x, cy - g.y, q.body.z - g.z);
        if (d > 11) continue;
        if (!visible(this.arena, g.x, g.y + 0.2, g.z, q.body.x, cy, q.body.z)) continue;
        let dmg = WEAPONS.he.damage * Math.max(0, 1 - d / 11);
        if (q.armor > 0) { dmg *= 0.6; q.armor = Math.max(0, q.armor - Math.round(dmg * 0.3)); }
        if (dmg >= 1) this.damage(owner || null, q, Math.round(dmg), 0, WEAPONS.he, false, [q.body.x, cy, q.body.z]);
      }
    } else if (g.type === 'smoke') {
      this.smokes.push({ x: g.x, y: g.y, z: g.z, r: 5, until: now() + 18 });
    } else if (g.type === 'flash') {
      // bots get blinded on the server; humans compute their own flash on the client
      for (const b of this.bots) {
        if (!b.alive) continue;
        const ey = b.body.y + eyeHeight(b.body);
        const d = Math.hypot(b.body.x - g.x, ey - g.y, b.body.z - g.z);
        if (d > 25 || !visible(this.arena, g.x, g.y, g.z, b.body.x, ey, b.body.z)) continue;
        const fx = -Math.sin(b.yaw), fz = -Math.cos(b.yaw);
        const facing = ((g.x - b.body.x) * fx + (g.z - b.body.z) * fz) / (Math.hypot(g.x - b.body.x, g.z - b.body.z) || 1);
        const dur = (facing > 0.3 ? 3.5 : 1.2) * (1 - d / 30);
        b.flashUntil = Math.max(b.flashUntil, now() + dur);
      }
    }
  }

  smokeBlocks(ax, ay, az, bx, by, bz) {
    for (const s of this.smokes) {
      const dx = bx - ax, dy = by - ay, dz = bz - az, l2 = dx * dx + dy * dy + dz * dz || 1;
      const t = Math.max(0, Math.min(1, ((s.x - ax) * dx + (s.y + 1 - ay) * dy + (s.z - az) * dz) / l2));
      if (Math.hypot(ax + dx * t - s.x, ay + dy * t - s.y - 1, az + dz * t - s.z) < s.r) return true;
    }
    return false;
  }

  // ------------------------------------------------------------------ bomb
  updateBomb(dt) {
    if (this.settings.mode !== 'bomb' || this.phase !== 'live') return;
    const t = now();
    // pick up dropped bomb
    if (this.bomb && this.bomb.state === 'dropped') {
      for (const p of this.players.values()) {
        if (p.alive && p.team === 'T' && Math.hypot(p.body.x - this.bomb.x, p.body.z - this.bomb.z) < 1.2) {
          p.inv.bomb = true; this.bomb = null; this.sendMe(p); this.sys('bombPicked', { name: p.name }); break;
        }
      }
    }
    // planting
    for (const p of this.players.values()) {
      if (!p.alive) { p.plant = 0; p.defuse = 0; continue; }
      if (p.team === 'T' && p.inv.bomb && p.using && p.weapon === 'bomb' && horizontalSpeed(p.body) < 0.6 && p.body.onGround) {
        const site = this.layout.sites.find((s) => Math.hypot(p.body.x - s.x, p.body.z - s.z) < s.r + 1.5);
        if (site) {
          p.plant = (p.plant || 0) + dt;
          if (p.plant >= BOMB.plantTime) {
            p.inv.bomb = false; p.plant = 0;
            p.weapon = p.inv.primary || p.inv.secondary || 'knife';
            this.bomb = { state: 'planted', x: p.body.x, y: this.arena.ground(p.body.x, p.body.z) + 0.05, z: p.body.z, site: site.id, explodeAt: t + this.settings.bombTime, planter: p.id };
            this.bombWasPlanted = true;
            this.addMoney(p, ECON.plantBonus);
            p.score += 1;
            this.phaseEnd = this.bomb.explodeAt;
            this.broadcast({ t: 'bomb', state: 'planted', site: site.id, x: this.bomb.x, y: this.bomb.y, z: this.bomb.z, time: this.settings.bombTime });
            this.sendMe(p);
          }
          continue;
        }
      }
      p.plant = 0;
      if (p.team === 'CT' && p.using && this.bomb && this.bomb.state === 'planted' && Math.hypot(p.body.x - this.bomb.x, p.body.z - this.bomb.z) < 1.8) {
        if (!p.defuse) this.broadcast({ t: 'defusing', id: p.id, kit: p.inv.defuser });
        p.defuse = (p.defuse || 0) + dt;
        const need = p.inv.defuser ? BOMB.defuseKitTime : BOMB.defuseTime;
        if (p.defuse >= need) {
          this.bomb.state = 'defused';
          p.score += 2;
          this.addMoney(p, ECON.defuseBonus);
          this.broadcast({ t: 'bomb', state: 'defused', by: p.name });
          this.endRound('CT', 'defuse');
        }
      } else p.defuse = 0;
    }
    if (this.bomb && this.bomb.state === 'planted' && t >= this.bomb.explodeAt) {
      this.bomb.state = 'exploded';
      this.broadcast({ t: 'bomb', state: 'exploded', x: this.bomb.x, y: this.bomb.y, z: this.bomb.z });
      for (const q of this.players.values()) {
        if (!q.alive) continue;
        const d = Math.hypot(q.body.x - this.bomb.x, q.body.z - this.bomb.z);
        const R = BOMB.radius * 1.8;
        if (d < R) this.damage(null, q, Math.round(BOMB.damage * Math.pow(1 - d / R, 1.5) + (d < BOMB.radius ? 100 : 0)), 0, null, false, null);
      }
      this.endRound('T', 'bomb');
    }
  }

  checkRoundEnd() {
    if (this.settings.mode !== 'bomb' || this.phase !== 'live' || this.state !== 'playing') return;
    const alive = { T: 0, CT: 0 }, total = { T: 0, CT: 0 };
    for (const p of this.players.values()) { if (p.team in total) { total[p.team]++; if (p.alive) alive[p.team]++; } }
    if (!total.T || !total.CT) return;
    const planted = this.bomb && this.bomb.state === 'planted';
    if (alive.CT === 0) this.endRound('T', 'elim');
    else if (alive.T === 0 && !planted) this.endRound('CT', 'elim');
  }

  toLobby() {
    this.state = 'lobby';
    this.phase = null;
    for (const p of this.players.values()) { p.alive = false; p.ready = p.isBot; }
    this.broadcast({ t: 'lobby' });
    this.pushRoom();
  }

  // ------------------------------------------------------------------ main tick
  tick(dt) {
    const t = now();
    if (this.state === 'loading' && t > this.loadingUntil) this.beginMatch();
    if (this.state === 'ended') { if (t > this.returnAt) this.toLobby(); return; }
    if (this.state !== 'playing') return;
    const s = this.settings, mode = MODES[s.mode];

    // phases
    if (mode.rounds) {
      if (this.phase === 'freeze' && t >= this.phaseEnd) {
        this.phase = 'live';
        this.phaseEnd = t + s.roundTime;
        this.broadcast({ t: 'round', round: this.round, phase: 'live', time: s.roundTime, buyTime: Math.max(0, this.buyEnd - t), score: this.score });
      } else if (this.phase === 'live' && t >= this.phaseEnd && !(this.bomb && this.bomb.state === 'planted')) {
        this.endRound('CT', 'time');
      } else if (this.phase === 'post' && t >= this.phaseEnd) {
        this.startRound();
      }
    } else if (t >= this.phaseEnd) {
      // time limit reached
      if (s.mode === 'tdm') this.endMatch(this.score.T === this.score.CT ? 'draw' : this.score.T > this.score.CT ? 'T' : 'CT');
      else { let best = null; for (const p of this.players.values()) if (!best || p.kills > best.kills) best = p; this.endMatch(best ? best.name : 'draw'); }
      return;
    }

    for (const p of this.players.values()) {
      if (p.reloading && t >= p.reloadEnd) this.finishReload(p);
      if (!p.alive && mode.respawn && p.team !== 'SPEC' && p.respawnAt && t >= p.respawnAt) { p.respawnAt = 0; this.spawn(p); }
      if (p.isBot) p.brain.update(dt);
      if (p.alive) {
        p.hist.push({ t, x: p.body.x, y: p.body.y, z: p.body.z, c: p.body.crouch });
        while (p.hist.length && p.hist[0].t < t - 1) p.hist.shift();
        // weapon pickups
        if (s.mode === 'bomb' && this.items.length && !(p.pickupBlock > t)) {
          for (const it of this.items) {
            if (Math.hypot(it.x - p.body.x, it.z - p.body.z) > 1.1) continue;
            const w = WEAPONS[it.w];
            const slot = w.slot === SLOT.PRIMARY ? 'primary' : 'secondary';
            if (p.inv[slot]) continue;
            p.inv[slot] = it.w; p.ammo[it.w] = it.ammo;
            this.items.splice(this.items.indexOf(it), 1);
            this.sendMe(p);
            break;
          }
        }
      }
    }
    this.updateGrenades(dt);
    this.updateBomb(dt);
    if (t - this.lastSnap >= 1 / SNAPSHOT_RATE - 0.002) { this.lastSnap = Math.max(this.lastSnap + 1 / SNAPSHOT_RATE, t - 0.1); this.snapshot(t); }
  }

  snapshot(t) {
    const r2 = (v) => Math.round(v * 100) / 100;
    const players = [];
    for (const p of this.players.values()) {
      if (p.team === 'SPEC' && !p.alive) continue;
      const b = p.body;
      const flags = (p.alive ? 1 : 0) | (b.onGround ? 2 : 0) | (p.walk ? 4 : 0) | (p.scoped ? 8 : 0) | (p.inv.bomb ? 16 : 0) | (p.plant > 0 || p.defuse > 0 ? 32 : 0) | (p.reloading ? 64 : 0) | (p.inv.defuser ? 128 : 0);
      players.push([p.id, r2(b.x), r2(b.y), r2(b.z), r2(p.yaw), r2(p.pitch), r2(b.crouch), flags, WEAPON_CODE[p.weapon] ?? 0, p.hp, p.team === 'T' ? 1 : p.team === 'CT' ? 2 : 0, r2(Math.hypot(b.vx, b.vz))]);
    }
    const msg = {
      t: 'snap', st: Math.round(t * 1000), ph: this.phase, tl: Math.max(0, Math.round((this.phaseEnd - t) * 10) / 10),
      p: players,
      g: this.grenades.map((g) => [g.id, g.type, r2(g.x), r2(g.y), r2(g.z)]),
      i: this.items.map((it) => [it.id, it.w, r2(it.x), r2(it.y), r2(it.z)]),
      b: this.bomb ? [this.bomb.state, r2(this.bomb.x), r2(this.bomb.y), r2(this.bomb.z), this.bomb.state === 'planted' ? Math.round((this.bomb.explodeAt - t) * 10) / 10 : 0] : null,
      sc: this.score,
    };
    for (const p of this.players.values()) {
      if (!p.client) continue;
      msg.pr = p.plant ? Math.min(1, p.plant / BOMB.plantTime) : p.defuse ? Math.min(1, p.defuse / (p.inv.defuser ? BOMB.defuseKitTime : BOMB.defuseTime)) : 0;
      p.client.send(msg);
    }
  }
}
