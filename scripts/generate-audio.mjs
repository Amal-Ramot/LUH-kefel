// מייצר קובצי קול (קול נשי של Google Translate) לכל תרגיל ולכל מספר בקפיצות.
// הרצה: node scripts/generate-audio.mjs   (מדלג על קבצים שכבר קיימים)
import { mkdir, writeFile, access } from "node:fs/promises";

const OUT = new URL("../public/audio/", import.meta.url);
await mkdir(OUT, { recursive: true });

const jobs = [];
for (let a = 1; a <= 10; a++)
  for (let b = 1; b <= 10; b++) jobs.push([`f-${a}x${b}.mp3`, `${a} כפול ${b} שווה ${a * b}`]);
const products = new Set();
for (let a = 1; a <= 10; a++) for (let b = 1; b <= 10; b++) products.add(a * b);
for (const p of [...products].sort((x, y) => x - y)) jobs.push([`n-${p}.mp3`, String(p)]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let made = 0;
for (const [file, text] of jobs) {
  const dest = new URL(file, OUT);
  try {
    await access(dest);
    continue;
  } catch {}
  const url = new URL("https://translate.google.com/translate_tts");
  url.search = new URLSearchParams({ ie: "UTF-8", tl: "iw", client: "tw-ob", q: text }).toString();
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (res.ok) {
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
      made++;
      break;
    }
    if (attempt >= 4) throw new Error(`${file}: HTTP ${res.status}`);
    await sleep(2000 * attempt);
  }
  await sleep(250);
}
console.log(`done: ${made} new files, ${jobs.length} total`);
