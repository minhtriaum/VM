// index.html에 Apps Script 웹앱 URL/키를 암호화(난독화)해 삽입합니다. (의존성 없음, Node 14+)
const fs = require('fs');
const file = process.argv[2] || 'index.html';
const url = process.env.GAS_URL || '', key = process.env.GAS_KEY || '';
function ks(k){ let h=2166136261>>>0; for(let i=0;i<k.length;i++){ h^=k.charCodeAt(i); h=Math.imul(h,16777619)>>>0; }
  return function(){ h=(h+0x6D2B79F5)>>>0; let t=h; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)&255; }; }
function enc(s,k){ const r=ks(k); const b=Buffer.from(s,'utf8'); return Buffer.from(b.map(x=>x^r())).toString('base64'); }
if (!url) { console.log('GAS_URL 이 비어 있어 건너뜁니다.'); process.exit(0); }
if (!/^https:\/\/script\.google(usercontent)?\.com\//.test(url)) { console.error('웹앱 URL 형식이 아닙니다.'); process.exit(1); }
let html = fs.readFileSync(file, 'utf8');
if (!/const _CFG='[^']*';/.test(html)) { console.error('index.html에서 설정 위치를 찾지 못했습니다. (v3.3 이상 필요)'); process.exit(1); }
html = html.replace(/const _CFG='[^']*';/, () => "const _CFG='" + enc(JSON.stringify({ url, key }), 'tm-cfg-v1') + "';");
fs.writeFileSync(file, html);
console.log('삽입 완료:', file);
