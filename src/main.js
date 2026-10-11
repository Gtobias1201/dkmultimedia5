// Home: scroll horizontal pineado + dibujos de línea guiados por el scroll.
// Sin librerías: un único listener pasivo + requestAnimationFrame, estado en variables CSS.

const root = document.documentElement;
const story = document.querySelector('.story');
const track = document.querySelector('.track');
const panels = [...document.querySelectorAll('.panel')];
const navLinks = [...document.querySelectorAll('[data-i]')];

// Línea de tiempo del modo escenario, en unidades de 1svh de scroll.
const INTRO = 40;   // pausa inicial
const SLIDE = 70;   // desplazamiento entre paneles
const HOLD = 240;   // tiempo de dibujo de cada panel
const LAST_HOLD = 180;
const holds = [INTRO, HOLD, HOLD, LAST_HOLD];
const slideStart = [0, INTRO, INTRO + SLIDE + HOLD, INTRO + 2 * (SLIDE + HOLD)];
const holdEnd = slideStart.map((s, i) => (i === 0 ? INTRO : s + SLIDE + holds[i]));
const TOTAL = holdEnd[3];

const stageMQ = matchMedia('(min-width: 900px) and (min-height: 520px) and (prefers-reduced-motion: no-preference)');
const motionMQ = matchMedia('(prefers-reduced-motion: no-preference)');

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

let mode = 'static';
let ticking = false;
let lastX = -1;
const lastD = [];
const reveals = panels.map((p) => [...p.querySelectorAll('.round.reveal')]);

function setD(i, d) {
  const v = Math.round(d * 1000) / 1000;
  if (lastD[i] === v) return;
  lastD[i] = v;
  panels[i].style.setProperty('--d', v);
  for (const btn of reveals[i]) btn.inert = v < 0.9;
}

function update() {
  ticking = false;
  const vh = innerHeight;
  if (mode === 'stage') {
    const y = (scrollY - story.offsetTop) / (vh / 100); // en svh
    let x = 0;
    for (let i = 1; i < 4; i++) x += ease(clamp((y - slideStart[i]) / SLIDE));
    if (x !== lastX) { lastX = x; track.style.setProperty('--x', x.toFixed(4)); }
    for (let i = 1; i < 4; i++) {
      const a = slideStart[i] + SLIDE * 0.5;
      const b = holdEnd[i] - 25;
      setD(i, clamp((y - a) / (b - a)));
    }
    markCurrent(Math.round(x));
  } else if (mode === 'flow') {
    for (let i = 1; i < 4; i++) {
      const top = panels[i].getBoundingClientRect().top;
      setD(i, clamp((vh * 0.92 - top) / (vh * 0.7)));
    }
    let cur = 0;
    panels.forEach((p, i) => { if (p.getBoundingClientRect().top < vh * 0.5) cur = i; });
    markCurrent(cur);
  }
}

function markCurrent(i) {
  for (const a of navLinks) {
    if (!a.classList.contains('square_btn')) continue;
    if (Number(a.dataset.i) === i) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  }
}

function request() {
  if (!ticking) { ticking = true; requestAnimationFrame(update); }
}

function setMode() {
  const next = stageMQ.matches ? 'stage' : motionMQ.matches ? 'flow' : 'static';
  mode = next;
  root.classList.toggle('is-stage', next === 'stage');
  story.style.setProperty('--total', TOTAL);
  track.style.removeProperty('--x');
  lastX = -1;
  lastD.length = 0;
  panels.forEach((p, i) => { p.style.removeProperty('--d'); if (i) for (const b of reveals[i]) b.inert = false; });
  if (next !== 'static') update();
}

// Navegación por anclas: en modo escenario hay que saltar a la posición de scroll del panel.
function scrollTarget(i) {
  const vh = innerHeight / 100;
  return story.offsetTop + (i === 0 ? 0 : holdEnd[i] - 20) * vh;
}
function goTo(i, behavior = 'smooth') {
  if (mode === 'stage') scrollTo({ top: scrollTarget(i), behavior: motionMQ.matches ? behavior : 'auto' });
  else panels[i].scrollIntoView({ behavior: motionMQ.matches ? behavior : 'auto', block: 'start' });
}

for (const a of navLinks) {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const i = Number(a.dataset.i);
    closeAll();
    goTo(i);
    history.replaceState(null, '', i ? panels[i].id.replace(/^/, '#') : location.pathname);
  });
}

// Vista de proyectos de cada sección
function setView(panel, view) {
  panel.dataset.view = view;
  const intro = panel.querySelector('.view--intro');
  const work = panel.querySelector('.view--work');
  intro.inert = view === 'work';
  work.inert = view !== 'work';
  panel.querySelector('[data-open]').setAttribute('aria-expanded', String(view === 'work'));
  (view === 'work' ? work.querySelector('[data-close]') : panel.querySelector('[data-open]'))?.focus({ preventScroll: true });
}
function closeAll() {
  for (const p of panels) if (p.dataset.view === 'work') setView(p, 'intro');
}
for (const p of panels) {
  const work = p.querySelector('.view--work');
  if (!work) continue;
  work.inert = true;
  p.querySelector('[data-open]').addEventListener('click', () => setView(p, 'work'));
  p.querySelector('[data-close]').addEventListener('click', () => setView(p, 'intro'));
  p.addEventListener('keydown', (e) => { if (e.key === 'Escape' && p.dataset.view === 'work') setView(p, 'intro'); });
}

addEventListener('scroll', request, { passive: true });
addEventListener('resize', () => { setMode(); }, { passive: true });
stageMQ.addEventListener('change', setMode);
motionMQ.addEventListener('change', setMode);
setMode();

// Entrada con ancla (p. ej. volver desde un proyecto: index.html#animacion)
const hashIndex = panels.findIndex((p) => p.id && '#' + p.id === location.hash);
if (hashIndex > 0) requestAnimationFrame(() => goTo(hashIndex, 'auto'));
