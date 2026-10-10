// CS-style player movement shared by client prediction, server validation and bots.
import { PHYS } from './constants.js';
import { BASE_SPEED } from './weapons.js';
import { collideCircle, groundAt } from './arena.js';

export function newBody(x = 0, y = 0, z = 0) {
  return { x, y, z, vx: 0, vy: 0, vz: 0, onGround: true, crouch: 0, jumpHeld: false };
}

export function bodyHeight(b) { return PHYS.height + (PHYS.crouchHeight - PHYS.height) * b.crouch; }
export function eyeHeight(b) { return PHYS.eye + (PHYS.crouchEye - PHYS.eye) * b.crouch; }

function accelerate(b, wx, wz, wishSpeed, accel, dt) {
  const cur = b.vx * wx + b.vz * wz;
  const add = wishSpeed - cur;
  if (add <= 0) return;
  const a = Math.min(add, accel * wishSpeed * dt);
  b.vx += a * wx; b.vz += a * wz;
}

// inp: { fwd, side (-1..1), jump, crouch, walk, yaw, speedMul }
export function stepBody(arena, b, inp, dt) {
  b.crouch = inp.crouch ? Math.min(1, b.crouch + dt * 7) : Math.max(0, b.crouch - dt * 7);
  const h = bodyHeight(b);
  const sin = Math.sin(inp.yaw), cos = Math.cos(inp.yaw);
  let wx = -sin * inp.fwd + cos * inp.side;
  let wz = -cos * inp.fwd - sin * inp.side;
  let wl = Math.hypot(wx, wz);
  if (wl > 1e-4) { wx /= wl; wz /= wl; }
  wl = Math.min(1, wl);
  let maxSpeed = BASE_SPEED * (inp.speedMul || 1);
  if (b.crouch > 0.5) maxSpeed *= PHYS.crouchMul;
  else if (inp.walk) maxSpeed *= PHYS.walkMul;

  if (b.onGround) {
    const sp = Math.hypot(b.vx, b.vz);
    if (sp > 0) {
      const drop = Math.max(sp, PHYS.stopSpeed) * PHYS.friction * dt;
      const ns = Math.max(0, sp - drop) / sp;
      b.vx *= ns; b.vz *= ns;
    }
    accelerate(b, wx, wz, maxSpeed * wl, PHYS.accel / 6, dt);
    if (inp.jump && !b.jumpHeld && b.crouch < 0.6) { b.vy = PHYS.jumpSpeed; b.onGround = false; }
  } else {
    accelerate(b, wx, wz, Math.min(maxSpeed * wl, 1.0), PHYS.airAccel * 10, dt);
  }
  b.jumpHeld = !!inp.jump;
  // hard cap
  const hs = Math.hypot(b.vx, b.vz), cap = BASE_SPEED * 1.15;
  if (hs > cap) { b.vx *= cap / hs; b.vz *= cap / hs; }

  const x0 = b.x, z0 = b.z;
  const dist = hs * dt;
  const n = Math.max(1, Math.ceil(dist / (PHYS.radius * 0.5)));
  for (let i = 0; i < n; i++) {
    let nx = b.x + (b.vx * dt) / n, nz = b.z + (b.vz * dt) / n;
    [nx, nz] = collideCircle(arena, nx, nz, PHYS.radius, b.y + 0.02, b.y + h, PHYS.stepHeight);
    const lim = arena.half - PHYS.radius;
    b.x = Math.max(-lim, Math.min(lim, nx));
    b.z = Math.max(-lim, Math.min(lim, nz));
  }
  // velocity follows actual motion (slide along walls instead of pushing into them)
  if (dt > 0) {
    const ax = (b.x - x0) / dt, az = (b.z - z0) / dt;
    if (Math.abs(ax) < Math.abs(b.vx)) b.vx = ax;
    if (Math.abs(az) < Math.abs(b.vz)) b.vz = az;
  }

  b.vy -= PHYS.gravity * dt;
  b.y += b.vy * dt;
  const g = groundAt(arena, b.x, b.z, PHYS.radius, b.y, PHYS.stepHeight);
  if (b.y <= g) { b.y = g; if (b.vy < 0) b.vy = 0; b.onGround = true; }
  else if (b.onGround && b.vy <= 0 && b.y - g < PHYS.stepHeight) { b.y = g; b.vy = 0; }
  else b.onGround = false;
  return b;
}

export function horizontalSpeed(b) { return Math.hypot(b.vx, b.vz); }
