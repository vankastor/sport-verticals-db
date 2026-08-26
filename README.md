# База вертикальных спорт-видео

Единая база референсов-роликов (вертикаль 9:16, YouTube Shorts) под видео-анонсы «Лига Ставок».
Собрано через **ego lite (ego-browser)** поиском по YouTube, метаданные — через YouTube oembed.

- **Дата сборки:** 2026-08-26
- **Источник:** YouTube Shorts (поиск ego lite) + oembed (канал/заголовок)
- **Файл базы:** `videos.csv` (открывается в Google Sheets / Excel; фильтруется grep)

## Колонки

| Колонка | Значения | Описание |
|---|---|---|
| `id` | число | Уникальный номер записи |
| `sport` | football / hockey / tennis / basketball / cs | Вид спорта |
| `subject_type` | team / player / generic | Что в центре: команда, игрок или общий момент |
| `subject` | текст | Название команды или имя игрока |
| `style` | celebration, action, goal, skills, dunk, entrance, emotion, slowmo (через `;`) | Тип момента |
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

## Пополнение

Формат строки CSV: поля с запятыми (заголовки/каналы) — в двойных кавычках. Дедуп — по video id
(часть url после `shorts/`). Новые прогоны добавляются новыми строками с инкрементом `id`.
