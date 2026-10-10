// Server-side bot AI: buying, A* navigation on the nav grid, target acquisition with reaction time,
// aim error and burst fire, bomb planting / defusing.
import { visible } from '../shared/arena.js';
import { stepBody, eyeHeight, horizontalSpeed } from '../shared/physics.js';
import { WEAPONS, currentSpread } from '../shared/weapons.js';
import { navFree } from '../shared/layout.js';

export const BOT_NAMES = ['Mehmet', 'Ahmet', 'Mustafa', 'Emre', 'Burak', 'Kerem', 'Deniz', 'Murat', 'Serkan', 'Oğuz', 'Tolga', 'Volkan', 'Cem', 'Barış', 'Eren', 'Kaan', 'Selin', 'Zeynep', 'Elif', 'Ece', 'Arda', 'Onur', 'Yiğit', 'Berk'];
const SKILL = {
  easy: { react: 0.75, aimErr: 0.11, turn: 3.0, burst: 3, head: 0.05, stopToShoot: false, fov: 0.35 },
  normal: { react: 0.45, aimErr: 0.06, turn: 5.5, burst: 5, head: 0.15, stopToShoot: true, fov: 0.2 },
  hard: { react: 0.22, aimErr: 0.02, turn: 11, burst: 8, head: 0.45, stopToShoot: true, fov: 0.05 },
};
const now = () => performance.now() / 1000;
const wrap = (a) => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };

export class BotBrain {
  constructor(room, p, level) {
    this.room = room; this.p = p; this.level = level;
    this.path = null; this.pi = 0; this.goal = null; this.goalKind = null; this.repathAt = 0;
    this.target = null; this.reactAt = 0; this.err = [0, 0]; this.thinkAt = 0;
    this.strafe = 0; this.strafeUntil = 0; this.shots = 0; this.pauseUntil = 0;
    this.stuckCheck = { t: 0, x: 0, z: 0 }; this.boughtRound = -1; this.holdSpot = null;
    this.lastEnemyPos = null; this.recoil = 0;
  }
  get sk() { return SKILL[this.level] || SKILL.normal; }

  update(dt) {
    const r = this.room, p = this.p;
    if (!p.alive || r.state !== 'playing' || !r.arena) return;
    const t = now();
    if (r.phase === 'freeze') { this.buy(); this.path = null; this.move(dt, 0, 0, false); return; }
    if (r.phase === 'post' || r.phase === 'ended') { this.move(dt, 0, 0, false); return; }
    if (t >= this.thinkAt) { this.thinkAt = t + 0.12; this.perceive(t); this.chooseGoal(t); }
    this.chooseWeapon();
    this.recoil = Math.max(0, this.recoil - dt * 4);

    let wantX = 0, wantZ = 0, walk = false, crouch = false;
    const eyeY = p.body.y + eyeHeight(p.body);
    if (this.target && this.target.alive) {
      const tg = this.target;
      const aimY = tg.body.y + (this.aimHead ? 1.62 : 1.25) * (1 - 0.3 * tg.body.crouch);
      const dx = tg.body.x - p.body.x, dz = tg.body.z - p.body.z, dy = aimY - eyeY;
      const dist = Math.hypot(dx, dz);
      const wantYaw = Math.atan2(-dx, -dz) + this.err[0] * (0.4 + Math.min(1.5, 25 / (dist + 5)));
      const wantPitch = Math.atan2(dy, dist) + this.err[1];
      this.turnTo(wantYaw, wantPitch, dt);
      this.err[0] *= Math.pow(0.25, dt); this.err[1] *= Math.pow(0.25, dt);
      const aimOff = Math.abs(wrap(wantYaw - p.yaw)) + Math.abs(wantPitch - p.pitch);
      const w = WEAPONS[p.weapon];
      if (w.melee) { wantX = dx; wantZ = dz; }
      else {
        if (t > this.strafeUntil) { this.strafe = [-1, 0, 1][Math.floor(Math.random() * 3)]; this.strafeUntil = t + 0.4 + Math.random() * 0.8; }
        if (this.level === 'hard' && dist > 20 && Math.random() < 0.01) crouch = true;
      }
      if (t >= this.reactAt && aimOff < 0.12 + 1.2 / (dist + 8) && t >= this.pauseUntil && p.flashUntil < t) {
        if (!w.melee || dist < 1.6) this.fire(t, dist);
      }
      if (w.melee) this.moveToward(dt, wantX, wantZ, false);
      else {
        const stand = this.sk.stopToShoot && t >= this.reactAt;
        const sx = Math.cos(p.yaw) * this.strafe, sz = -Math.sin(p.yaw) * this.strafe;
        this.moveToward(dt, stand ? sx * 0.0001 : sx, stand ? sz * 0.0001 : sz, true, crouch);
      }
      return;
    }

    // no target: navigate to goal
    this.shots = 0;
    if (p.reloading == null) {
      const a = p.ammo[p.weapon];
      const w = WEAPONS[p.weapon];
      if (a && w && !w.melee && a.mag < w.mag * 0.5 && a.res > 0) r.startReload(p);
    }
    if (this.goalKind === 'plant' || this.goalKind === 'defuse') {
      p.using = true;
      this.move(dt, 0, 0, false);
      return;
    }
    p.using = false;
    const wp = this.nextWaypoint(t);
    if (wp) {
      wantX = wp.x - p.body.x; wantZ = wp.z - p.body.z;
      const yaw = Math.atan2(-wantX, -wantZ);
      this.turnTo(yaw, 0, dt * 0.8);
      walk = false;
    } else if (this.lastEnemyPos) {
      this.turnTo(Math.atan2(-(this.lastEnemyPos.x - p.body.x), -(this.lastEnemyPos.z - p.body.z)), 0, dt * 0.5);
    }
    this.moveToward(dt, wantX, wantZ, walk);
  }

  turnTo(yaw, pitch, dt) {
    const p = this.p, rate = this.sk.turn * dt;
    const dy = wrap(yaw - p.yaw);
    p.yaw = wrap(p.yaw + Math.max(-rate, Math.min(rate, dy)));
    p.pitch += Math.max(-rate, Math.min(rate, pitch - p.pitch));
  }

  moveToward(dt, wx, wz, walk, crouch = false) {
    const p = this.p;
    const l = Math.hypot(wx, wz);
    if (l < 0.05) return this.move(dt, 0, 0, walk, crouch);
    wx /= l; wz /= l;
    const fx = -Math.sin(p.yaw), fz = -Math.cos(p.yaw), rx = Math.cos(p.yaw), rz = -Math.sin(p.yaw);
    this.move(dt, wx * fx + wz * fz, wx * rx + wz * rz, walk, crouch);
  }

  move(dt, fwd, side, walk, crouch = false) {
    const p = this.p, r = this.room;
    const w = WEAPONS[p.weapon] || WEAPONS.knife;
    const jump = this.jumpNext; this.jumpNext = false;
    stepBody(r.arena, p.body, { fwd, side, jump, crouch, walk, yaw: p.yaw, speedMul: w.speed * (p.scoped ? 0.6 : 1) }, dt);
    p.walk = walk;
    // stuck detection
    const t = now();
    if (t - this.stuckCheck.t > 1.2) {
      const moved = Math.hypot(p.body.x - this.stuckCheck.x, p.body.z - this.stuckCheck.z);
      if (moved < 0.35 && (Math.abs(fwd) + Math.abs(side) > 0.5) && !this.target) {
        this.jumpNext = true; this.repathAt = 0;
        if (this.path && this.pi < this.path.length - 1) this.pi++;
      }
      this.stuckCheck = { t, x: p.body.x, z: p.body.z };
    }
  }

  chooseWeapon() {
    const p = this.p, r = this.room;
    if (this.goalKind === 'plant') { if (p.weapon !== 'bomb') r.switchWeapon(p, 'bomb'); return; }
    const has = (w) => w && p.ammo[w] && (p.ammo[w].mag > 0 || p.ammo[w].res > 0);
    const best = has(p.inv.primary) ? p.inv.primary : has(p.inv.secondary) ? p.inv.secondary : 'knife';
    if (p.weapon !== best && !p.reloading) r.switchWeapon(p, best);
    const a = p.ammo[p.weapon];
    if (a && a.mag === 0 && a.res > 0 && !p.reloading) r.startReload(p);
  }

  fire(t, dist) {
    const p = this.p, r = this.room;
    const w = WEAPONS[p.weapon];
    if (p.reloading || t < p.nextFire) return;
    if (!w.melee) { const a = p.ammo[p.weapon]; if (!a || a.mag <= 0) return; }
    if (w.zoom && !p.scoped && dist > 12) { p.scoped = true; p.nextFire = Math.max(p.nextFire, t + 0.25); return; }
    const spread = currentSpread(w, { onGround: p.body.onGround, speed: horizontalSpeed(p.body), crouch: p.body.crouch > 0.5, scoped: p.scoped, recoil: this.recoil });
    const ey = p.body.y + eyeHeight(p.body);
    const cp = Math.cos(p.pitch);
    const f = [-Math.sin(p.yaw) * cp, Math.sin(p.pitch), -Math.cos(p.yaw) * cp];
    const right = [Math.cos(p.yaw), 0, -Math.sin(p.yaw)];
    const up = [right[1] * f[2] - right[2] * f[1], right[2] * f[0] - right[0] * f[2], right[0] * f[1] - right[1] * f[0]];
    const dirs = [];
    for (let i = 0; i < w.pellets; i++) {
      const a = Math.random() * Math.PI * 2, s = Math.sqrt(Math.random()) * spread;
      const ox = Math.cos(a) * s, oy = Math.sin(a) * s;
      dirs.push([f[0] + right[0] * ox + up[0] * oy, f[1] + right[1] * ox + up[1] * oy, f[2] + right[2] * ox + up[2] * oy]);
    }
    r.onFire(p, { w: p.weapon, o: [p.body.x, ey, p.body.z], d: dirs, heavy: false });
    this.recoil = Math.min(w.recoilMax, this.recoil + w.recoil);
    this.err[1] += w.recoil * 0.4 * (this.level === 'hard' ? 0.3 : 1);
    if (w.zoom) p.scoped = false;
    this.shots++;
    if (this.shots >= (w.auto ? this.sk.burst : 1)) { this.shots = 0; this.pauseUntil = t + (w.auto ? 0.25 + Math.random() * 0.35 : 0.15 + Math.random() * 0.3); this.recoil = 0; }
  }

  perceive(t) {
    const p = this.p, r = this.room;
    const teams = r.settings.mode === 'bomb' || r.settings.mode === 'tdm';
    const eyeY = p.body.y + eyeHeight(p.body);
    const fx = -Math.sin(p.yaw), fz = -Math.cos(p.yaw);
    let best = null, bestD = Infinity;
    const blind = p.flashUntil > t;
    for (const q of r.players.values()) {
      if (q === p || !q.alive || (teams && q.team === p.team) || q.team === 'SPEC') continue;
      const dx = q.body.x - p.body.x, dz = q.body.z - p.body.z, d = Math.hypot(dx, dz);
      if (d > 110 || blind) continue;
      const facing = (dx * fx + dz * fz) / (d || 1);
      const attacked = p.damageBy.has(q.id) && d < 60;
      if (facing < this.sk.fov - 0.3 && !attacked && d > 4) continue;
      const qy = q.body.y + 1.3 * (1 - 0.3 * q.body.crouch);
      if (!visible(r.arena, p.body.x, eyeY, p.body.z, q.body.x, qy, q.body.z)) continue;
      if (r.smokeBlocks(p.body.x, eyeY, p.body.z, q.body.x, qy, q.body.z)) continue;
      if (d < bestD) { bestD = d; best = q; }
    }
    if (best !== this.target) {
      this.target = best;
      if (best) {
        this.reactAt = t + this.sk.react * (0.75 + Math.random() * 0.5);
        const e = this.sk.aimErr;
        this.err = [(Math.random() - 0.5) * 2 * e * 3, (Math.random() - 0.5) * e * 2];
        this.aimHead = Math.random() < this.sk.head;
        this.lastEnemyPos = { x: best.body.x, z: best.body.z };
      }
    }
    if (best) this.lastEnemyPos = { x: best.body.x, z: best.body.z };
  }

  chooseGoal(t) {
    const p = this.p, r = this.room, L = r.layout;
    const mode = r.settings.mode;
    let goal = null, kind = 'roam';
    if (mode === 'bomb' && L.sites.length) {
      const bomb = r.bomb;
      if (p.team === 'T') {
        if (!r.tSite || r.tSiteRound !== r.round) { r.tSite = L.sites[Math.floor(Math.random() * L.sites.length)]; r.tSiteRound = r.round; }
        if (bomb && bomb.state === 'planted') {
          if (!this.holdSpot || this.holdFor !== 'bomb') { const a = Math.random() * 6.28, d = 4 + Math.random() * 8; this.holdSpot = this.freeNear(bomb.x + Math.cos(a) * d, bomb.z + Math.sin(a) * d); this.holdFor = 'bomb'; }
          goal = this.holdSpot; kind = 'hold';
        } else if (bomb && bomb.state === 'dropped') { goal = { x: bomb.x, z: bomb.z }; kind = 'bomb'; }
        else {
          const site = r.tSite;
          goal = { x: site.x, z: site.z }; kind = 'site';
          if (p.inv.bomb && Math.hypot(p.body.x - site.x, p.body.z - site.z) < site.r - 0.5 && p.body.onGround) kind = 'plant';
        }
      } else {
        if (bomb && bomb.state === 'planted') {
          goal = { x: bomb.x, z: bomb.z }; kind = 'bomb';
          if (Math.hypot(p.body.x - bomb.x, p.body.z - bomb.z) < 1.4) kind = 'defuse';
        } else {
          if (!this.holdSpot || this.holdFor !== 'site' + r.round) {
            const idx = [...r.players.values()].filter((q) => q.team === 'CT' && q.isBot).indexOf(p);
            const site = L.sites[(idx < 0 ? 0 : idx) % L.sites.length];
            const a = Math.random() * 6.28, d = 2 + Math.random() * 9;
            this.holdSpot = this.freeNear(site.x + Math.cos(a) * d, site.z + Math.sin(a) * d);
            this.holdFor = 'site' + r.round;
          }
          goal = this.holdSpot; kind = 'hold';
        }
      }
    } else {
      // deathmatch styles: hunt the nearest enemy, otherwise roam
      let best = null, bd = Infinity;
      for (const q of r.players.values()) {
        if (q === p || !q.alive || (mode === 'tdm' && q.team === p.team)) continue;
        const d = Math.hypot(q.body.x - p.body.x, q.body.z - p.body.z);
        if (d < bd) { bd = d; best = q; }
      }
      if (best && Math.random() < 0.7) goal = { x: best.body.x, z: best.body.z };
      else if (!this.goal || Math.hypot(this.goal.x - p.body.x, this.goal.z - p.body.z) < 3) {
        const h = r.arena.half - 6;
        goal = this.freeNear((Math.random() * 2 - 1) * h, (Math.random() * 2 - 1) * h);
      } else goal = this.goal;
    }
    // recently shot at but no visual: look toward last enemy position
    if (kind !== 'plant' && kind !== 'defuse' && this.lastEnemyPos && !this.target && Math.random() < 0.3 && mode !== 'bomb') goal = this.lastEnemyPos;
    const changed = !this.goal || !goal || Math.hypot(goal.x - this.goal.x, goal.z - this.goal.z) > 3;
    this.goal = goal; this.goalKind = kind;
    if (goal && (changed || t > this.repathAt)) {
      this.path = findPath(r.nav, p.body.x, p.body.z, goal.x, goal.z);
      this.pi = 0;
      this.repathAt = t + 3 + Math.random() * 2;
    }
  }

  freeNear(x, z) {
    const nav = this.room.nav;
    for (let rad = 0; rad < 12; rad++) for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      const px = x + Math.cos(a) * rad, pz = z + Math.sin(a) * rad;
      if (navFree(nav, px, pz)) return { x: px, z: pz };
    }
    return { x, z };
  }

  nextWaypoint() {
    const p = this.p;
    if (!this.path || this.pi >= this.path.length) return null;
    let wp = this.path[this.pi];
    while (wp && Math.hypot(wp.x - p.body.x, wp.z - p.body.z) < 0.9) { this.pi++; wp = this.path[this.pi]; }
    return wp || null;
  }

  buy() {
    const p = this.p, r = this.room;
    if (r.settings.mode !== 'bomb' || this.boughtRound === r.round) return;
    if (Math.random() > 0.06) return; // stagger buys over the freeze time
    this.boughtRound = r.round;
    const T = p.team === 'T';
    const m = () => p.money;
    if (!p.inv.primary) {
      if (m() >= 5750 && Math.random() < 0.18) r.buy(p, 'awp');
      else if (m() >= (T ? 2700 : 2900) + 650) r.buy(p, T ? 'ak47' : 'm4a1');
      else if (m() >= (T ? 1800 : 2050) + 650 && Math.random() < 0.6) r.buy(p, T ? 'galil' : 'famas');
      else if (m() >= 1250 + 650 && Math.random() < 0.5) r.buy(p, T ? 'mac10' : 'mp9');
      else if (m() >= 700 && Math.random() < 0.3) r.buy(p, 'deagle');
    }
    if (m() >= 1000) r.buy(p, 'vesthelm'); else if (m() >= 650) r.buy(p, 'vest');
    if (!T && m() >= 400 && Math.random() < 0.6) r.buy(p, 'defuser');
    if (m() >= 300 && Math.random() < 0.3) r.buy(p, 'he');
  }
}

// ---------------------------------------------------------------- A* on the nav grid
export function findPath(nav, sx, sz, gx, gz) {
  const n = nav.n, cell = nav.cell, o = nav.o;
  const toCell = (x, z) => [Math.max(0, Math.min(n - 1, Math.floor((x - o) / cell))), Math.max(0, Math.min(n - 1, Math.floor((z - o) / cell)))];
  let [ax, az] = toCell(sx, sz), [bx, bz] = toCell(gx, gz);
  const free = (x, z) => x >= 0 && z >= 0 && x < n && z < n && !nav.blocked[z * n + x];
  const nearestFree = (x, z) => {
    if (free(x, z)) return [x, z];
    for (let r = 1; r < 10; r++) for (let dz = -r; dz <= r; dz++) for (let dx = -r; dx <= r; dx++) if (free(x + dx, z + dz)) return [x + dx, z + dz];
    return null;
  };
  const s = nearestFree(ax, az), g = nearestFree(bx, bz);
  if (!s || !g) return null;
  [ax, az] = s; [bx, bz] = g;
  const N = n * n;
  const gs = new Float32Array(N).fill(Infinity);
  const from = new Int32Array(N).fill(-1);
  const closed = new Uint8Array(N);
  const heap = [];
  const push = (k, f) => {
    heap.push([f, k]);
    let i = heap.length - 1;
    while (i > 0) { const pi = (i - 1) >> 1; if (heap[pi][0] <= heap[i][0]) break; [heap[pi], heap[i]] = [heap[i], heap[pi]]; i = pi; }
  };
  const pop = () => {
    const top = heap[0], last = heap.pop();
    if (heap.length) {
      heap[0] = last;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1, r = l + 1;
        let m = i;
        if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
        if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i], heap[m]]; i = m;
      }
    }
    return top;
  };
  const h = (x, z) => { const dx = Math.abs(x - bx), dz = Math.abs(z - bz); return Math.max(dx, dz) + 0.414 * Math.min(dx, dz); };
  const start = az * n + ax, goal = bz * n + bx;
  gs[start] = 0;
  push(start, h(ax, az));
  let iter = 0;
  const maxIter = N * 2;
  while (heap.length && iter++ < maxIter) {
    const [, k] = pop();
    if (closed[k]) continue;
    if (k === goal) break;
    closed[k] = 1;
    const x = k % n, z = (k / n) | 0;
    for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dz) continue;
      const nx = x + dx, nz = z + dz;
      if (!free(nx, nz)) continue;
      if (dx && dz && (!free(x + dx, z) || !free(x, z + dz))) continue;
      // keep a little distance from walls: penalise cells next to blocked ones
      let pen = 0;
      if (!free(nx + 1, nz) || !free(nx - 1, nz) || !free(nx, nz + 1) || !free(nx, nz - 1)) pen = 0.6;
      const nk = nz * n + nx;
      const ng = gs[k] + (dx && dz ? 1.414 : 1) + pen;
      if (ng < gs[nk]) { gs[nk] = ng; from[nk] = k; push(nk, ng + h(nx, nz)); }
    }
  }
  if (from[goal] < 0 && goal !== start) return null;
  const cells = [];
  for (let k = goal; k >= 0 && k !== start; k = from[k]) cells.push(k);
  cells.reverse();
  // string pulling: skip waypoints while the straight line stays walkable
  const pts = cells.map((k) => ({ x: o + ((k % n) + 0.5) * cell, z: o + (((k / n) | 0) + 0.5) * cell }));
  const out = [];
  let i = 0;
  while (i < pts.length) {
    let j = Math.min(pts.length - 1, i + 12);
    const base = out.length ? out[out.length - 1] : { x: sx, z: sz };
    while (j > i && !lineFree(nav, base.x, base.z, pts[j].x, pts[j].z)) j--;
    out.push(pts[j]);
    i = j + 1;
  }
  return out;
}

function lineFree(nav, ax, az, bx, bz) {
  const d = Math.hypot(bx - ax, bz - az), steps = Math.ceil(d / 0.5);
  for (let s = 1; s <= steps; s++) {
    const t = s / steps, x = ax + (bx - ax) * t, z = az + (bz - az) * t;
    if (!navFree(nav, x, z) || !navFree(nav, x + 0.45, z) || !navFree(nav, x - 0.45, z) || !navFree(nav, x, z + 0.45) || !navFree(nav, x, z - 0.45)) return false;
  }
  return true;
}
