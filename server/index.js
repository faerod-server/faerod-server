// Faerod game server: serves the web client, invite pages and downloads over HTTP,
// and runs game rooms over WebSocket (/ws).
//   PORT=8090 PUBLIC_URL=https://oyun.faerod.com node server/index.js
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { decodeRegion, buildIndex } from '../shared/region.js';
import { TICK_RATE, VERSION, DEFAULT_PORT, MODES } from '../shared/constants.js';
import { Room, newPlayer } from './room.js';
import { invitePage } from './invite.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT || DEFAULT_PORT);
const WEB = path.join(ROOT, 'dist', 'web');
const DOWNLOADS = path.join(ROOT, 'dist', 'downloads');
const PUBLIC_URL = process.env.PUBLIC_URL || '';

const regionBuf = fs.readFileSync(path.join(ROOT, 'data', 'region.bin'));
const region = decodeRegion(regionBuf.buffer.slice(regionBuf.byteOffset, regionBuf.byteOffset + regionBuf.byteLength));
const index = buildIndex(region);
console.log(`region: ${region.buildings.length} buildings, ${region.roads.length} roads, ${region.places.length} places`);

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const server = {
  region, index, rooms: new Map(),
  closeRoom(room) { this.rooms.delete(room.code); console.log(`[${room.code}] closed`); },
};
function newCode() {
  for (;;) {
    let c = '';
    for (let i = 0; i < 5; i++) c += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    if (!server.rooms.has(c)) return c;
  }
}
function publicRooms() {
  return [...server.rooms.values()].filter((r) => r.settings.isPublic).map((r) => r.info()).slice(0, 100);
}

// ------------------------------------------------------------------ HTTP
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.bin': 'application/octet-stream', '.webmanifest': 'application/manifest+json',
  '.apk': 'application/vnd.android.package-archive', '.exe': 'application/octet-stream', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};
function serveFile(res, file, cache) {
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('404'); return; }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': st.size,
      'Cache-Control': cache ? 'public, max-age=86400' : 'no-cache',
      'Access-Control-Allow-Origin': '*',
    });
    fs.createReadStream(file).pipe(res);
  });
}

const httpServer = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const p = decodeURIComponent(url.pathname);
  if (p === '/health') { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ ok: true, rooms: server.rooms.size, version: VERSION })); return; }
  if (p === '/api/rooms') { res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }); res.end(JSON.stringify(publicRooms())); return; }
  const inv = p.match(/^\/j\/([A-Z0-9]{5})$/i);
  if (inv) {
    const code = inv[1].toUpperCase();
    const room = server.rooms.get(code);
    const base = PUBLIC_URL || `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`;
    const html = invitePage({ code, pw: url.searchParams.get('p') || '', room: room ? room.info() : null, base, lang: /^en/i.test(req.headers['accept-language'] || '') ? 'en' : 'tr', downloads: listDownloads() });
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
    res.end(html);
    return;
  }
  if (p.startsWith('/download/')) { serveFile(res, path.join(DOWNLOADS, path.basename(p)), false); return; }
  let file = path.join(WEB, p === '/' ? 'index.html' : p);
  if (!file.startsWith(WEB)) { res.writeHead(403); res.end(); return; }
  serveFile(res, file, /\.(bin|jpg|png)$/.test(file));
});

function listDownloads() {
  try { return fs.readdirSync(DOWNLOADS); } catch { return []; }
}

// ------------------------------------------------------------------ WebSocket
const wss = new WebSocketServer({ server: httpServer, path: '/ws', maxPayload: 64 * 1024 });
wss.on('connection', (ws, req) => {
  const p = newPlayer('Oyuncu');
  p.key = 'anon-' + p.id;
  let msgCount = 0, msgWindow = Date.now();
  p.client = {
    send(obj) { if (ws.readyState === 1) ws.send(JSON.stringify(obj)); },
  };
  p.client.send({ t: 'welcome', id: p.id, version: VERSION });

  ws.on('message', (data) => {
    // simple flood protection
    const t = Date.now();
    if (t - msgWindow > 1000) { msgWindow = t; msgCount = 0; }
    if (++msgCount > 120) return;
    let m;
    try { m = JSON.parse(data); } catch { return; }
    if (!m || typeof m.t !== 'string') return;
    try { onMessage(p, m); } catch (err) { console.error('message error', m.t, err); }
  });
  ws.on('close', () => { if (p.room) p.room.remove(p); p.client = null; });
  ws.on('error', () => {});
});

function cleanName(n) {
  const s = String(n || '').replace(/[<>\n\r\t]/g, '').trim().slice(0, 20);
  return s || 'Oyuncu';
}

function onMessage(p, m) {
  switch (m.t) {
    case 'hello':
      p.name = cleanName(m.name);
      p.key = String(m.key || p.key).slice(0, 40);
      p.lang = m.lang === 'en' ? 'en' : 'tr';
      if (m.version !== VERSION) p.client.send({ t: 'err', code: 'version' });
      return;
    case 'name':
      p.name = cleanName(m.name);
      if (p.room) p.room.pushRoom();
      return;
    case 'ping':
      p.ping = Math.max(0, Math.min(999, Number(m.rtt) || 0));
      p.client.send({ t: 'pong', c: m.c, s: Math.round(performance.now()) });
      return;
    case 'list':
      p.client.send({ t: 'rooms', list: publicRooms() });
      return;
    case 'create': {
      if (p.room) p.room.remove(p);
      const room = new Room(server, newCode(), p, m.settings || {});
      server.rooms.set(room.code, room);
      console.log(`[${room.code}] created by ${p.name}: ${room.settings.name} (${room.settings.mode}, ${room.settings.mapName})`);
      p.client.send({ t: 'joined', room: room.info(true), you: p.id });
      return;
    }
    case 'join': {
      const room = server.rooms.get(String(m.code || '').toUpperCase().trim());
      if (!room) { p.client.send({ t: 'err', code: 'noRoom' }); return; }
      if (p.room === room) return;
      const why = room.canJoin(String(m.password || ''), p.key);
      if (why) { p.client.send({ t: 'err', code: why }); return; }
      if (p.room) p.room.remove(p);
      room.add(p);
      p.client.send({ t: 'joined', room: room.info(true), you: p.id });
      if (room.state === 'playing' || room.state === 'loading') p.client.send(room.startMessage());
      return;
    }
    case 'leave':
      if (p.room) { p.room.remove(p); p.room = null; }
      p.client.send({ t: 'left' });
      return;
    default:
      if (p.room) p.room.handle(p, m);
  }
}

// ------------------------------------------------------------------ tick
let last = performance.now();
setInterval(() => {
  const t = performance.now();
  const dt = Math.min(0.1, (t - last) / 1000);
  last = t;
  for (const room of server.rooms.values()) {
    try { room.tick(dt); } catch (err) { console.error(`[${room.code}] tick error`, err); }
  }
}, 1000 / TICK_RATE);

httpServer.listen(PORT, () => console.log(`Faerod server on http://localhost:${PORT}  (modes: ${Object.keys(MODES).join(', ')})`));
