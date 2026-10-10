// HTML landing page for invite links (https://<server>/j/CODE?p=PASSWORD).
// Opens the installed app via the faerod:// scheme, otherwise offers downloads / the web version.
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const T = {
  tr: {
    title: 'Faerod oyununa davet edildin!',
    room: 'Oda', code: 'Oda kodu', players: 'oyuncu', noRoom: 'Bu oda artık açık değil — yine de oyunu açıp yeni bir oda kurabilirsin.',
    open: 'Oyunu Aç ve Katıl', notInstalled: 'Oyun yüklü değil mi?', android: 'Android için indir (APK)', windows: 'Windows için indir',
    ios: 'iPhone / iPad: tarayıcıda oyna', iosHint: 'Safari\'de açtıktan sonra Paylaş ▸ "Ana Ekrana Ekle" ile uygulama gibi kurabilirsin.',
    manual: 'Oyunu açıp "Kod ile Katıl" kısmına bu kodu yaz:', pw: 'Şifre', web: 'Tarayıcıda oyna',
  },
  en: {
    title: 'You are invited to a Faerod match!',
    room: 'Room', code: 'Room code', players: 'players', noRoom: 'This room is no longer open — you can still open the game and host a new one.',
    open: 'Open the Game & Join', notInstalled: 'Game not installed?', android: 'Download for Android (APK)', windows: 'Download for Windows',
    ios: 'iPhone / iPad: play in the browser', iosHint: 'After opening it in Safari use Share ▸ "Add to Home Screen" to install it like an app.',
    manual: 'Open the game and enter this code under "Join with Code":', pw: 'Password', web: 'Play in the browser',
  },
};

export function invitePage({ code, pw, room, base, lang, downloads }) {
  const t = T[lang] || T.tr;
  const q = `?s=${encodeURIComponent(base)}` + (pw ? `&p=${encodeURIComponent(pw)}` : '');
  const deep = `faerod://join/${code}${q}`;
  const apkFile = downloads.find((f) => /\.apk$/i.test(f)), exeFile = downloads.find((f) => /\.exe$/i.test(f));
  const apk = process.env.APK_URL || (apkFile ? `/download/${apkFile}` : '');
  const exe = process.env.WIN_URL || (exeFile ? `/download/${exeFile}` : '');
  const abs = (u) => (/^https?:/i.test(u) ? u : base + u);
  const webUrl = `${base}/?join=${code}${pw ? '&p=' + encodeURIComponent(pw) : ''}`;
  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>FAEROD — ${esc(t.title)}</title>
<meta property="og:title" content="FAEROD — ${esc(t.title)}">
<meta property="og:description" content="${esc(room ? room.name + ' · ' + room.mapName : code)}">
<style>
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 20%,#2b3440,#0b0e12 70%);color:#eef2f6;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:16px;box-sizing:border-box}
.card{max-width:460px;width:100%;background:rgba(18,22,28,.92);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:26px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.5)}
h1{margin:0;font-size:38px;letter-spacing:6px;font-weight:900;color:#fff}h1 span{color:#f5a623}
h2{font-size:17px;font-weight:600;margin:10px 0 18px;opacity:.9}
.code{font-size:40px;font-weight:900;letter-spacing:8px;background:#0b0e12;border:2px dashed #f5a623;border-radius:10px;padding:10px;margin:8px 0 6px;user-select:all}
.room{opacity:.85;font-size:15px;margin-bottom:16px}
a.btn{display:block;margin:10px 0;padding:15px;border-radius:10px;text-decoration:none;font-weight:800;font-size:17px}
.primary{background:linear-gradient(#ffb941,#e08a00);color:#1a1000}.sec{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.15)}
.small{font-size:13px;opacity:.7;line-height:1.5}.warn{color:#ffcf7a;font-size:14px}
</style></head><body><div class="card">
<h1>FAE<span>ROD</span></h1>
<h2>${esc(t.title)}</h2>
${room ? `<div class="room">${esc(t.room)}: <b>${esc(room.name)}</b> · ${esc(room.mapName)} · ${room.players}/${room.max} ${esc(t.players)}</div>` : `<p class="warn">${esc(t.noRoom)}</p>`}
<a class="btn primary" id="open" href="${esc(deep)}">${esc(t.open)}</a>
<p class="small">${esc(t.manual)}</p>
<div class="code">${esc(code)}</div>
${pw ? `<p class="small">${esc(t.pw)}: <b>${esc(pw)}</b></p>` : ''}
<p style="margin-top:22px;font-weight:700">${esc(t.notInstalled)}</p>
${apk ? `<a class="btn sec" href="${esc(abs(apk))}">${esc(t.android)}</a>` : ''}
${exe ? `<a class="btn sec" href="${esc(abs(exe))}">${esc(t.windows)}</a>` : ''}
<a class="btn sec" href="${esc(webUrl)}">${esc(t.ios)}</a>
<p class="small">${esc(t.iosHint)}</p>
<p class="small" style="margin-top:18px">www.faerod.com</p>
</div>
<script>
(function(){
  var ua=navigator.userAgent, deep=${JSON.stringify(deep)};
  var isAndroid=/Android/i.test(ua), isIOS=/iPhone|iPad|iPod/i.test(ua) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  var btn=document.getElementById('open');
  if(isAndroid){
    var fallback=${JSON.stringify(apk ? abs(apk) : webUrl)};
    btn.href='intent://join/${code}${q}#Intent;scheme=faerod;package=com.faerod.game;S.browser_fallback_url='+encodeURIComponent(fallback)+';end';
  } else if(isIOS){
    btn.href=${JSON.stringify(webUrl)};
  }
  if(!isIOS){ setTimeout(function(){ location.href=btn.href; }, 400); }
})();
</script>
</body></html>`;
}
