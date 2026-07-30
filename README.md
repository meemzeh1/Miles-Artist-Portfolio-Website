# Miles — Artist Portfolio Website

Премиальный одностраничный сайт для рэп-исполнителя. Демонстрирует современный frontend: анимации, кастомный аудиоплеер, lightbox, PWA и адаптивную вёрстку.

## Возможности

- **Hero** с видео-фоном, typing-эффектом и CTA-кнопками
- **Навигация** — sticky header, blur, mobile menu, active section highlight
- **Scroll progress bar** — индикатор прогресса чтения
- **Dark / Light theme** — переключатель с сохранением в localStorage
- **Галерея** — lightbox с навигацией клавишами (← → Esc)
- **Аудиоплеер** — кастомный UI + SoundCloud Widget API, регулировка громкости, автовоспроизведение следующего трека
- **Контактная форма** — валидация полей, интеграция с Formspree
- **Scroll reveal** — Intersection Observer анимации
- **Counter animation** — анимированные цифры в секции «Обо мне»
- **PWA** — manifest + service worker, офлайн-кеш
- **SEO** — meta tags, Open Graph, semantic HTML
- **Accessibility** — ARIA labels, keyboard navigation, reduced motion

## Стек

- HTML5, CSS3 (Custom Properties, Grid, Flexbox)
- Vanilla JavaScript (ES Modules, Intersection Observer)
- SoundCloud Widget API
- Formspree (отправка формы обратной связи)
- PWA (Service Worker)

## Быстрый старт

```bash
# Локальный сервер (нужен для Service Worker и SoundCloud API)
npx serve .
# или
python3 -m http.server 8080
```

Открой `http://localhost:8080`

## Настройка

В `js/main.js` измени объект `CONFIG`:

```javascript
const CONFIG = {
  telegram: 'telegramUser',   // ник в Telegram
  devEmail: 'your@email.com',   // резервный email (не используется в футере)
  formspreeId: 'YOUR_ID',       // ID формы с formspree.io — куда приходят заявки с сайта
  typingPhrases: [...],         // фразы в hero
};
```

Ссылки на автора в футере ("Димой (meemzeh)" и "заказать сайт") ведут напрямую в Telegram и прописаны в `index.html`:

```html
<a href="https://t.me/whitewhale3301">Димой (meemzeh)</a>
```

Чтобы сообщения с контактной формы приходили на почту:
1. Зарегистрируйся на [formspree.io](https://formspree.io) и подтверди свою почту
2. Создай новую форму, скопируй её ID (часть адреса после `/f/`)
3. Вставь ID в `CONFIG.formspreeId`

## Деплой

Рекомендуется **GitHub Pages**, **Vercel** или **Netlify**:

```bash
# Vercel
npx vercel

# Netlify
npx netlify deploy --prod --dir=.
```

Для GitHub Pages: Settings → Pages → Source: Deploy from a branch → main / root.

## Структура

```
├── index.html
├── README.md
├── css/style.css
├── js/main.js
├── manifest.json
├── sw.js
├── bgvideo.mp4
└── img/
    ├── bio.jpg
    ├── album.jpg
    ├── track1.jpg
    ├── track2.jpg
    ├── img1.jpg
    ├── img2.jpg
    ├── img3.jpg
    ├── img4.jpg
    └── img5.jpg
```

## Автор

Сайт разработан [Димой (meemzeh)](https://t.me/whitewhale3301) как демонстрация frontend-навыков.
