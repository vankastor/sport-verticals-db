#!/usr/bin/env python3
"""Генерирует videos.json из videos.csv — источник данных для страницы и API.

index.html грузит videos.json через fetch (работает на GitHub Pages), поэтому
CSV остаётся единственным источником правды: правим CSV → запускаем скрипт →
коммитим/пушим → GitHub Pages обновляется.

Запуск:  python3 build_page.py
Публикация:  git add -A && git commit -m "update" && git push
Сайт:  https://vankastor.github.io/sport-verticals-db/
API :  https://vankastor.github.io/sport-verticals-db/videos.json
"""
import csv, json, pathlib

HERE = pathlib.Path(__file__).parent
rows = list(csv.DictReader(open(HERE / "videos.csv", encoding="utf-8")))

out = HERE / "videos.json"
out.write_text(json.dumps(rows, ensure_ascii=False), encoding="utf-8")
print(f"wrote {out} with {len(rows)} rows")
