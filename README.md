# Сайт строительной компании

Статический сайт для строительной компании, которая строит дома.

## Файлы

- `index.html` — главная страница
- `styles.css` — стили сайта

## Публикация на GitHub Pages

1. Создайте новый публичный репозиторий на GitHub.
2. Загрузите в него файлы из этой папки.
3. Откройте `Settings` -> `Pages`.
4. В блоке `Build and deployment` выберите:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main` и папку `/ (root)`
5. Сохраните настройки.

Через 1–3 минуты сайт появится по адресу вида:

`https://USERNAME.github.io/REPOSITORY-NAME/`

## Локальный запуск

```bash
python3 -m http.server 8000
```
