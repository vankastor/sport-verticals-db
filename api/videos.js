// API базы вертикальных спорт-видео.
// Источник данных — videos.csv из публичного репозитория (единый источник правды).
// Эндпоинт: /api/videos → { count, total, results:[...] }
// Фильтры (query): sport, source_type, subject, q, limit
const CSV_URL =
  "https://raw.githubusercontent.com/vankastor/sport-verticals-db/main/videos.csv";

function splitLine(line) {
  const out = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else { q = false; }
      } else { cur += c; }
    } else if (c === '"') { q = true; }
    else if (c === ",") { out.push(cur); cur = ""; }
    else { cur += c; }
  }
  out.push(cur);
  return out;
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.length);
  const header = splitLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = splitLine(line);
    const o = {};
    header.forEach((h, i) => (o[h] = cells[i] == null ? "" : cells[i]));
    return o;
  });
}

let cache = null;
async function getVideos() {
  if (cache) return cache;
  const resp = await fetch(CSV_URL, { cache: "no-store" });
  if (!resp.ok) throw new Error("CSV fetch failed: " + resp.status);
  cache = parseCSV(await resp.text());
  return cache;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  let videos;
  try {
    videos = await getVideos();
  } catch (e) {
    res.status(502).send(JSON.stringify({ error: String(e) }));
    return;
  }
  const p = req.query || {};
  let list = videos;
  if (p.sport) list = list.filter((v) => v.sport === p.sport);
  if (p.source_type) list = list.filter((v) => v.source_type === p.source_type);
  if (p.subject) {
    const s = String(p.subject).toLowerCase();
    list = list.filter((v) => (v.subject || "").toLowerCase().includes(s));
  }
  if (p.q) {
    const needle = String(p.q).toLowerCase();
    list = list.filter((v) =>
      Object.values(v).join(" ").toLowerCase().includes(needle)
    );
  }
  const limit = parseInt(p.limit, 10);
  if (limit > 0) list = list.slice(0, limit);
  res.status(200).send(
    JSON.stringify({ count: list.length, total: videos.length, results: list }, null, 2)
  );
};
