/**
 * MILES — Artist Portfolio
 * Main application module
 */

const CONFIG = {
  telegram: '',     // Твой ник в телеграме
  devEmail: '', // Твой email для заказов
  formspreeId: '',        // ID формы с formspree.io
  typingPhrases: [
    'Гатчина',
    'Пролетарская 38',
    'На всех площадках',
  ],
  album: {
    cover: 'img/album.jpg',       // обложка альбома
    comingSoon: 'Coming Soon',
    label: 'Новый альбом',
    name: 'Пролетарская 38',          // название альбома
    enabled: true,                // false — отключить экран анонса
  },
};

/* ---- Album splash ---- */
function initAlbumSplash() {
  const splash = document.getElementById('albumSplash');
  const enterBtn = document.getElementById('albumEnter');
  const cover = document.getElementById('albumCover');
  const dateEl = document.getElementById('albumDate');
  const soonEl = document.getElementById('albumSoon');
  const labelEl = splash?.querySelector('.album-splash__label');

  if (!CONFIG.album.enabled || !splash) {
    splash?.classList.add('hidden');
    return;
  }

  if (cover) cover.src = CONFIG.album.cover;
  if (dateEl) dateEl.textContent = CONFIG.album.releaseDate;
  if (soonEl) soonEl.textContent = CONFIG.album.comingSoon;
  if (labelEl) labelEl.textContent = CONFIG.album.label;

  document.body.classList.add('splash-open');

  const close = () => {
    splash.classList.add('hidden');
    document.body.classList.remove('splash-open');
  };

  enterBtn?.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !splash.classList.contains('hidden')) {
      close();
    }
  });
}

/* ---- Scroll progress ---- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  }, { passive: true });
}

/* ---- Navigation ---- */
function initNavigation() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section, .hero');

  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  burger?.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    links?.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      burger?.classList.remove('open');
      links?.classList.remove('open');
      burger?.setAttribute('aria-expanded', 'false');
    });
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -40% 0px' }
  );

  sections.forEach(section => {
    if (section.id) observer.observe(section);
  });
}

/* ---- Theme toggle ---- */
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (!prefersDark) {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  toggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* ---- Typing effect ---- */
function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = CONFIG.typingPhrases;
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ---- Scroll reveal ---- */
function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ---- Counter animation ---- */
function initCounters() {
  const counters = document.querySelectorAll('.stat__value[data-count]');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1500;
        const start = performance.now();

        function animate(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(animate);
          else el.textContent = target;
        }

        requestAnimationFrame(animate);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));
}

/* ---- Lightbox ---- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');
  const items = document.querySelectorAll('.gallery__item');
  const images = Array.from(items).map(item => item.querySelector('img').src);
  let currentIndex = 0;

  function open(index) {
    currentIndex = index;
    lightboxImg.src = images[index];
    lightboxImg.alt = `Архив — фото ${index + 1}`;
    counter.textContent = `${index + 1} / ${images.length}`;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + images.length) % images.length;
    open(currentIndex);
  }

  items.forEach(item => {
    item.addEventListener('click', () => open(parseInt(item.dataset.index, 10)));
  });

  document.getElementById('lightboxClose')?.addEventListener('click', close);
  document.getElementById('lightboxPrev')?.addEventListener('click', () => navigate(-1));
  document.getElementById('lightboxNext')?.addEventListener('click', () => navigate(1));

  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

/* ---- SoundCloud Player ---- */
function initPlayer() {
  const player = document.getElementById('audioPlayer');
  const iframe = document.getElementById('scWidget');
  const playBtn = document.getElementById('playerPlay');
  const prevBtn = document.getElementById('playerPrev');
  const nextBtn = document.getElementById('playerNext');
  const progressBar = document.getElementById('playerProgressBar');
  const progressWrap = document.getElementById('playerProgress');
  const currentTime = document.getElementById('playerCurrent');
  const durationEl = document.getElementById('playerDuration');
  const cover = document.getElementById('playerCover');
  const title = document.getElementById('playerTitle');
  const playlistItems = document.querySelectorAll('.playlist__item');
  const muteBtn = document.getElementById('playerMute');
  const volumeWrap = document.getElementById('playerVolume');
  const volumeBar = document.getElementById('playerVolumeBar');

  if (!iframe || typeof SC === 'undefined') return;

  const widget = SC.Widget(iframe);
  let currentTrack = 0;
  let isPlaying = false;
  let currentVolume = 80;
  let lastVolume = 80;

  function formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  function loadTrack(index, autoPlay = false) {
    const item = playlistItems[index];
    if (!item) return;

    currentTrack = index;
    const url = item.dataset.url;

    widget.load(url, { auto_play: autoPlay });
    cover.src = item.dataset.cover;
    title.textContent = item.dataset.title;

    playlistItems.forEach((el, i) => {
      el.classList.toggle('playlist__item--active', i === index);
    });

    isPlaying = autoPlay;
  }

  widget.bind(SC.Widget.Events.READY, () => {
    widget.getDuration(duration => {
      durationEl.textContent = formatTime(duration);
    });
    widget.setVolume(currentVolume);
  });

  widget.bind(SC.Widget.Events.PLAY_PROGRESS, e => {
    widget.getDuration(duration => {
      if (duration) {
        progressBar.style.width = `${(e.currentPosition / duration) * 100}%`;
        currentTime.textContent = formatTime(e.currentPosition);
      }
    });
  });

  widget.bind(SC.Widget.Events.PLAY, () => {
    isPlaying = true;
    player.classList.add('playing');
  });

  widget.bind(SC.Widget.Events.PAUSE, () => {
    isPlaying = false;
    player.classList.remove('playing');
  });

  widget.bind(SC.Widget.Events.FINISH, () => {
    const next = (currentTrack + 1) % playlistItems.length;
    loadTrack(next, true);
  });

  playBtn?.addEventListener('click', () => widget.toggle());

  prevBtn?.addEventListener('click', () => {
    const prev = (currentTrack - 1 + playlistItems.length) % playlistItems.length;
    loadTrack(prev, true);
  });

  nextBtn?.addEventListener('click', () => {
    const next = (currentTrack + 1) % playlistItems.length;
    loadTrack(next, true);
  });

  playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (index === currentTrack) {
        widget.toggle();
      } else {
        loadTrack(index, true);
      }
    });
  });

  progressWrap?.addEventListener('click', e => {
    const rect = progressWrap.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    widget.getDuration(duration => {
      widget.seekTo(duration * percent);
    });
  });

  progressWrap?.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      widget.getCurrentSoundIndex?.();
      widget.getPosition(pos => {
        widget.getDuration(duration => {
          const step = duration * 0.05;
          widget.seekTo(Math.max(0, Math.min(duration, pos + (e.key === 'ArrowRight' ? step : -step))));
        });
      });
    }
  });

  function setVolume(percent) {
    currentVolume = Math.max(0, Math.min(100, percent));
    volumeBar.style.width = `${currentVolume}%`;
    volumeWrap.setAttribute('aria-valuenow', Math.round(currentVolume));
    widget.setVolume(currentVolume);
    muteBtn.classList.toggle('muted', currentVolume === 0);
  }

  volumeWrap?.addEventListener('click', e => {
    const rect = volumeWrap.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    setVolume(percent);
  });

  let isDraggingVolume = false;

  volumeWrap?.addEventListener('mousedown', () => { isDraggingVolume = true; });
  document.addEventListener('mousemove', e => {
    if (!isDraggingVolume) return;
    const rect = volumeWrap.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    setVolume(percent);
  });
  document.addEventListener('mouseup', () => { isDraggingVolume = false; });

  volumeWrap?.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setVolume(currentVolume + (e.key === 'ArrowRight' ? 5 : -5));
    }
  });

  muteBtn?.addEventListener('click', () => {
    if (currentVolume > 0) {
      lastVolume = currentVolume;
      setVolume(0);
    } else {
      setVolume(lastVolume || 80);
    }
  });
}

/* ---- Contact form ---- */
function initForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');

  const validators = {
    name: val => val.trim().length >= 2 || 'Минимум 2 символа',
    email: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Некорректный email',
    message: val => val.trim().length >= 10 || 'Минимум 10 символов',
  };

  function validate() {
    let valid = true;

    Object.entries(validators).forEach(([field, validateFn]) => {
      const input = document.getElementById(field);
      const error = document.getElementById(`${field}Error`);
      const result = validateFn(input.value);

      if (result !== true) {
        input.classList.add('error');
        error.textContent = result;
        valid = false;
      } else {
        input.classList.remove('error');
        error.textContent = '';
      }
    });

    return valid;
  }

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) return;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const data = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value,
    };

    try {
      if (CONFIG.formspreeId) {
        const res = await fetch(`https://formspree.io/f/${CONFIG.formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Send failed');
      } else {
        await new Promise(r => setTimeout(r, 1200));
      }

      form.reset();
      successMsg.hidden = false;
      setTimeout(() => { successMsg.hidden = true; }, 5000);
    } catch {
      document.getElementById('emailError').textContent = 'Ошибка отправки. Попробуй позже.';
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  form?.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      document.getElementById(`${input.id}Error`).textContent = '';
    });
  });
}

/* ---- Lazy video ---- */
function initVideo() {
  const video = document.getElementById('heroVideo');
  if (!video) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(video);
}

/* ---- PWA ---- */
function initPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

/* ---- Dev link config ---- */
function initDevLink() {
  // Ссылка на телеграм автора уже задана в HTML (href="https://t.me/"),
  // поэтому здесь её больше не перезаписываем.
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  initAlbumSplash();
  initScrollProgress();
  initNavigation();
  initTheme();
  initTyping();
  initReveal();
  initCounters();
  initLightbox();
  initForm();
  initVideo();
  initDevLink();
  initPWA();

  if (typeof SC !== 'undefined') {
    initPlayer();
  } else {
    window.addEventListener('load', initPlayer);
  }
});
