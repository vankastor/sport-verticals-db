// API базы вертикальных спорт-видео.
// Эндпоинт: /api/videos  → JSON { count, total, results:[...] }
// Фильтры (query): sport, source_type, subject, q (полнотекст), limit
const videos = require("../videos.json");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  const q = req.query || {};
  let list = videos;

  if (q.sport) list = list.filter((v) => v.sport === q.sport);
  if (q.source_type) list = list.filter((v) => v.source_type === q.source_type);
  if (q.subject) {
    const s = String(q.subject).toLowerCase();
    list = list.filter((v) => (v.subject || "").toLowerCase().includes(s));
  }
  if (q.q) {
    const needle = String(q.q).toLowerCase();
    list = list.filter((v) =>
      Object.values(v).join(" ").toLowerCase().includes(needle)
    );
  }

  const limit = parseInt(q.limit, 10);
  if (limit > 0) list = list.slice(0, limit);

  res.status(200).send(
    JSON.stringify(
      { count: list.length, total: videos.length, results: list },
      null,
      2
    )
  );
};
