// Páginas de proyecto: facade de juegos (carga diferida del iframe) y galería con scroll-snap.

for (const box of document.querySelectorAll('.game')) {
  const btn = box.querySelector('.game__play');
  btn?.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = box.dataset.src;
    frame.title = box.dataset.title;
    frame.allow = 'fullscreen; autoplay; gamepad';
    frame.allowFullscreen = true;
    box.append(frame);
    btn.remove();
    box.querySelector('picture')?.remove();
    frame.focus();
  });
}

for (const gal of document.querySelectorAll('.gallery')) {
  const track = gal.querySelector('.gallery__track');
  const items = [...track.children];
  if (items.length < 2) continue;
  const ui = gal.querySelector('.gallery__ui');
  const count = gal.querySelector('.gallery__count');
  const prev = gal.querySelector('[data-prev]');
  const next = gal.querySelector('[data-next]');
  ui.hidden = false;

  let index = 0;
  const show = (i) => {
    index = Math.max(0, Math.min(items.length - 1, i));
    count.textContent = `${index + 1} / ${items.length}`;
    prev.disabled = index === 0;
    next.disabled = index === items.length - 1;
  };
  const go = (i) => items[Math.max(0, Math.min(items.length - 1, i))].scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });

  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  gal.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
  });
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) show(items.indexOf(en.target));
  }, { root: track, threshold: 0.6 });
  items.forEach((it) => io.observe(it));
  show(0);
}
