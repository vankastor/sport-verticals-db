# База вертикальных спорт-видео

Единая база референсов-роликов (вертикаль 9:16, YouTube Shorts) под видео-анонсы «Лига Ставок».
Собрано через **ego lite (ego-browser)** поиском по YouTube, метаданные — через YouTube oembed.

- **Дата сборки:** 2026-08-26
- **Источник:** YouTube Shorts (поиск ego lite) + oembed (канал/заголовок)
- **Файл базы:** `videos.csv` (открывается в Google Sheets / Excel; фильтруется grep)

## Публичный доступ (открывается из любой сети)

- **Страница (поиск/фильтры):** https://vankastor.github.io/sport-verticals-db/
- **API (JSON, CORS `*`):** https://vankastor.github.io/sport-verticals-db/videos.json

Хостинг — GitHub Pages (репозиторий `vankastor/sport-verticals-db`). Обновление:
правим `videos.csv` → `python3 build_page.py` → `git add -A && git commit && git push`.
Через ~1 минуту Pages пересобирается.

**Пример использования API:**
```bash
curl -s https://vankastor.github.io/sport-verticals-db/videos.json | jq '.[] | select(.sport=="tennis")'
```

> В `api/videos.js` лежит serverless-версия API с фильтрами `?sport=&source_type=&q=&limit=`
> (для Vercel/Node). На GitHub Pages она не исполняется — Pages отдаёт статический
> `videos.json`, а фильтрация делается на странице/на стороне клиента.


## Колонки

| Колонка | Значения | Описание |
|---|---|---|
| `id` | число | Уникальный номер записи |
| `sport` | football / hockey / tennis / basketball / cs / boxing / mma / muaythai / dota2 / lol / valorant | Вид спорта |
| `subject_type` | team / player / generic | Что в центре: команда, игрок или общий момент |
| `subject` | текст | Название команды или имя игрока |
| `style` | celebration, action, goal, skills, dunk, entrance, emotion, slowmo, knockout, punch, highlights (через `;`) | Тип момента |
| `source_type` | official / broadcaster / fan | Тип канала-источника |
| `verified` | eye / meta | `eye` = просмотрено глазами, `meta` = по метаданным (заголовок/канал) |
| `title` | текст | Заголовок ролика |
| `channel` | текст | Канал-источник |
| `url` | ссылка | Прямая ссылка `youtube.com/shorts/…` |

## Как искать (примеры)

```bash
# Все клипы по футболу
grep ',football,' videos.csv

# Только официальные источники (чистый кадр под гифку)
grep ',official,' videos.csv

# Конкретная команда
grep 'Arsenal' videos.csv

# Конкретный игрок
grep 'Mbappe' videos.csv

# Эмоциональные крупняки (празднование/эмоция)
grep 'celebration\|emotion' videos.csv

# Хоккей + официальные каналы
grep ',hockey,' videos.csv | grep ',official,'
```

В Google Sheets: File → Import → загрузить `videos.csv` → включить фильтр по колонкам
`sport`, `subject`, `source_type`.

## Легенда качества

- `source_type=official` + `verified=eye` — максимально чистый исходник (нет фан-надписей).
- `source_type=fan` — фан-эдит: почти наверняка есть текст/музыка/вотермарка поверх кадра.
  Годится как референс движения/эмоции, но НЕ как чистый исходник под гифку.
- **Counter-Strike:** это игровой геймплей → HUD/killfeed всегда в кадре (без графики невозможно);
  для CS official = официальные турнирные/командные каналы (BLAST, ESL, NAVI CS2).
- **Теннис** — индивидуальный спорт: `subject` = игрок, «команда» неприменима.
- **Единоборства** (boxing/mma/muaythai) — индивидуальные: `subject` = боец или пара «X vs Y».
  Хайлайты часто с графикой/логотипами промоушена; `official` = каналы промоушенов/бойцов
  (UFC/PBC/ONE/Team Pacquiao), slo-mo — приоритет. Все записи — реальные проф-бойцы/бои.
- **Киберспорт** (dota2/lol/valorant) — берём НЕ голый геймплей, а ЭМОЦИЮ: реакции игроков/зала,
  слёзы, подъём трофея, празднования, клатч-камбэки (камера на людей). HUD/оверлеи турнира почти
  всегда в кадре — это ОК для эмоционального референса; `official` = каналы турниров
  (PGL/LoL Esports/VALORANT Champions Tour). Все записи — реальные проф-игроки/команды/турниры
  (TI, Worlds, VCT). **Counter-Strike** (`cs`) вынесен отдельным видом — эти 11 записей его не касаются.

## Пополнение

Формат строки CSV: поля с запятыми (заголовки/каналы) — в двойных кавычках. Дедуп — по video id
(часть url после `shorts/`). Новые прогоны добавляются новыми строками с инкрементом `id`.
