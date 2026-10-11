// Genera las 6 páginas de proyecto (proyectos/*.html) desde los datos de abajo.
// Uso: npm run pages   (se ejecuta solo en dev/build)
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';

const sizes = JSON.parse(readFileSync('scripts/sizes.json', 'utf8'));

/** <picture> AVIF + WebP con srcset, dimensiones y lazy-loading */
function pic(name, alt, { cls = '', sizesAttr = '(min-width: 900px) 50vw, 100vw', eager = false } = {}) {
  const s = sizes[name];
  const ws = s.widths;
  const set = (ext) => ws.map((w) => `../img/${name}-${w}.${ext} ${w}w`).join(', ');
  const w = ws.at(-1);
  const h = Math.round((s.h * w) / s.w);
  const load = eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"';
  return `<picture${cls ? ` class="${cls}"` : ''}>
        <source type="image/avif" srcset="${set('avif')}" sizes="${sizesAttr}">
        <source type="image/webp" srcset="${set('webp')}" sizes="${sizesAttr}">
        <img src="../img/${name}-${ws[0]}.webp" alt="${alt}" width="${w}" height="${h}" ${load}>
      </picture>`;
}

const game = (src, poster, title) => `<div class="game" data-src="${src}" data-title="${title}">
        ${pic(poster, '', { sizesAttr: '(min-width: 900px) 60vw, 100vw' })}
        <button class="game__play" type="button"><span aria-hidden="true">▶</span> Jugar</button>
      </div>`;

const video = (src, poster, label) => `<video class="video" controls preload="none" playsinline poster="../img/${poster}-960.webp" aria-label="${label}">
        <source src="../video/${src}" type="video/mp4">
        Tu navegador no soporta video HTML5.
      </video>`;

const gallery = (items) => `<div class="gallery" role="region" aria-roledescription="carrusel" aria-label="Galería de imágenes" tabindex="0">
        <div class="gallery__track">
          ${items.map(([n, alt], i) => `<figure class="gallery__item" aria-label="${i + 1} de ${items.length}">${pic(n, alt, { sizesAttr: '(min-width: 900px) 45vw, 100vw' })}</figure>`).join('\n          ')}
        </div>
        <div class="gallery__ui" hidden>
          <button type="button" data-prev aria-label="Anterior"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M13 3 6 10l7 7" /></svg></button>
          <span class="gallery__count" aria-live="polite">1 / ${items.length}</span>
          <button type="button" data-next aria-label="Siguiente"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 3 7 7-7 7" /></svg></button>
        </div>
      </div>`;

const projects = [
  {
    slug: 'momento-milanesa', title: 'Momento Milanesa', cat: 'interactivos', anchor: 'interactivos', theme: 'mint', city: true,
    desc: 'Juego publicitario HTML5 para El club de la milanesa, pensado para conectar la experiencia mobile con los locales.',
    meta: ['Tipo: Juego publicitario', 'Plataforma: Mobile', 'Formato: HTML5'],
    body: () => `
    <section class="split">
      ${pic('cel-milanesa', 'El juego Momento Milanesa visto en un celular', { eager: true, sizesAttr: '(min-width: 900px) 55vw, 100vw' })}
      <div class="copy">
        <h2>Concepto</h2>
        <p>Fue desarrollado para el concurso y seminario de El club de la milanesa bajo la premisa “MOMENTOS MILANESA”, en relación a la estrategia del cliente, que planeaba la incorporación de shows en vivo a los locales.</p>
      </div>
    </section>
    <section class="split split--rev">
      <div class="copy">
        <h3>Momento Rockstar</h3>
        <p>Para la realización, el obtener “momentos milanesa” se pensó como un método de transmediar la experiencia mobile con la experiencia en los locales.</p>
      </div>
      ${game('../juegos/milanesa/index.html', 'card-milanesa', 'Momento Milanesa')}
    </section>`,
  },
  {
    slug: 'anidados-jump', title: 'Anidados Jump', cat: 'interactivos', anchor: 'interactivos', theme: 'warm', city: true,
    desc: 'Juego publicitario HTML5 desarrollado en Construct 2 para la identidad de marca Anidados.',
    meta: ['Tipo: Juego publicitario', 'Plataforma: Mobile', 'Formato: HTML5'],
    body: () => `
    <section class="split">
      ${pic('cel-jump', 'Anidados Jump visto en un celular', { eager: true, sizesAttr: '(min-width: 900px) 55vw, 100vw' })}
      <div class="copy">
        <h2>Acerca del juego</h2>
        <p>Juego desarrollado en Construct 2 para la identidad de marca “Anidados”, con el fin de fidelizar a través de sus personajes a los clientes que la eligen.</p>
        <p>Desarrollado en HTML5, es versátil y multiplataforma. Para jugarlo solo presioná el botón de “jugar”.</p>
      </div>
    </section>
    <section class="wide">
      ${game('../juegos/jump/index.html', 'card-jump', 'Anidados Jump')}
    </section>`,
  },
  {
    slug: 'pancitos-bimbo', title: 'Publicidad pancitos Bimbo', cat: 'animacion', anchor: 'animacion', theme: 'bimbo',
    desc: 'Animación 3D para pancitos Bimbo: personajes y escenario modelados en 3ds Max y posproducidos en After Effects.',
    meta: ['Tipo: Animación 3D', 'Plataforma: Videoplayer', 'Formato: MP4'],
    body: () => `
    <section class="split">
      ${pic('panes', 'Pancitos animados en 3D', { eager: true, sizesAttr: '(min-width: 900px) 55vw, 100vw' })}
      <div class="copy">
        <h2>Acerca de</h2>
        <p>El trabajo fue realizado en 3ds Max, donde se crearon tanto los personajes como el escenario, que luego fue posproducido en After Effects.</p>
      </div>
    </section>
    <section class="wide">
      ${video('comercial.mp4', 'card-bimbo', 'Comercial de pancitos Bimbo')}
    </section>`,
  },
  {
    slug: 'civilizaciones-andinas', title: 'Civilizaciones Andinas', cat: 'animacion', anchor: 'animacion', theme: 'andes',
    desc: 'Matte painting, rotoscopia y tracking: elementos artificiales integrados a una escena real.',
    meta: ['Tipo: Posproducción', 'Plataforma: Videoplayer', 'Formato: MP4'],
    body: () => `
    <section class="center copy">
      <h2>Rotoscopia y tracking</h2>
      <p>El trabajo consistió en agregar elementos de forma artificial que no pertenecieran a la naturaleza original de la escena, pero que lograsen adaptarse en ella como si siempre hubiesen estado allí.</p>
    </section>
    <section class="wide">
      ${pic('mattep', 'Matte painting de civilizaciones andinas', { eager: true, sizesAttr: '(min-width: 1200px) 1100px, 100vw' })}
    </section>
    <section class="wide">
      ${video('civilizaciones-andinas.mp4', 'card-andes', 'Civilizaciones Andinas, video completo')}
    </section>`,
  },
  {
    slug: 'impresion-del-ser', title: 'Impresión del ser', cat: 'impresos', anchor: 'impresos', theme: 'grey',
    desc: 'Conjunto de suplementos impresos en papel sulfito bajo el concepto del cuerpo como otra forma de arte.',
    meta: ['Tipo: Suplemento', 'Formato: Impreso', 'Tamaño: súper A3'],
    body: () => `
    <section class="split split--print">
      <div class="copy">
        <h2>Suplementos</h2>
        <p>Conjunto de suplementos impresos en papel sulfito bajo el concepto de el cuerpo como otra forma de arte.</p>
        ${pic('zoom-suplemento', 'Detalle de un suplemento impreso', { sizesAttr: '(min-width: 900px) 30vw, 80vw' })}
      </div>
      ${gallery([['tapa1', 'Tapa 1 del suplemento'], ['tapa2', 'Tapa 2 del suplemento'], ['tapa3', 'Tapa 3 del suplemento']])}
    </section>`,
  },
  {
    slug: 'mis-conexiones', title: 'Mis Conexiones', cat: 'impresos', anchor: 'impresos', theme: 'navy',
    desc: 'Infografía relacional: análisis y visualización de datos sobre vínculos personales.',
    meta: ['Tipo: Infografía relacional', 'Formato: Impreso', 'Tamaño: 1 m × 0,70 m'],
    body: () => `
    <section class="split split--print">
      <div class="copy">
        <h2>Infografía relacional</h2>
        <p>Análisis de datos y visualización de datos en relación a vínculos personales.</p>
        ${pic('zoom-infografia', 'Detalle de la infografía', { sizesAttr: '(min-width: 900px) 30vw, 80vw' })}
      </div>
      ${gallery([['infografia-tapa', 'Infografía “Mis conexiones” completa'], ['infografia-detalle', 'Detalle de la infografía']])}
    </section>`,
  },
];

const secLabel = { interactivos: 'Interactivos', animacion: 'Animación', impresos: 'Impresos' };

const page = (p, i) => {
  const prev = projects[(i + projects.length - 1) % projects.length];
  const next = projects[(i + 1) % projects.length];
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${p.title} · Daniela Knoska</title>
  <meta name="description" content="${p.desc}">
  <meta name="theme-color" content="#ffffff">
  <meta property="og:title" content="${p.title} · Daniela Knoska">
  <meta property="og:description" content="${p.desc}">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;700&display=swap">
  <link rel="stylesheet" href="/src/styles/main.css">
  <link rel="stylesheet" href="/src/styles/proyecto.css">
  <script type="module" src="/src/proyecto.js"></script>
</head>
<body class="proyecto proyecto--${p.theme}${p.city ? ' proyecto--city' : ''}">
  <a class="cerrar" href="../index.html#${p.anchor}" aria-label="Cerrar y volver a ${secLabel[p.cat]}"><span aria-hidden="true">&times;</span></a>
  <main>
    <header class="head">
      <p class="eyebrow">${secLabel[p.cat]}</p>
      <h1>${p.title}</h1>
      <ul class="meta">
        ${p.meta.map((m) => `<li>${m}</li>`).join('\n        ')}
      </ul>
    </header>
    ${p.body()}
  </main>
  <nav class="pager" aria-label="Más proyectos">
    <a href="${prev.slug}.html" rel="prev"><span aria-hidden="true">←</span> ${prev.title}</a>
    <a href="../index.html#${p.anchor}">Todos los proyectos</a>
    <a href="${next.slug}.html" rel="next">${next.title} <span aria-hidden="true">→</span></a>
  </nav>
</body>
</html>
`;
};

mkdirSync('proyectos', { recursive: true });
projects.forEach((p, i) => writeFileSync(`proyectos/${p.slug}.html`, page(p, i)));
console.log(`${projects.length} páginas generadas`);
