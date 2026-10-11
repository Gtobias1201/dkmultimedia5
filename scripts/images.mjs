// Optimiza las imágenes originales a AVIF + WebP (conserva transparencia).
// Uso: npm run images   (requiere el repo original clonado; ver SRC abajo)
import sharp from 'sharp';
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Ruta al repo original clonado: npm run images -- <ruta>  (por defecto ../dkmultimedia5-original)
const SRC = resolve(process.argv[2] ?? '../dkmultimedia5-original');
const OUT = resolve('public/img');
mkdirSync(OUT, { recursive: true });

// [archivo origen, nombre salida, anchos]
const jobs = [
  ['svg/bimbo.png', 'card-bimbo', [640, 960]],
  ['pages/Animaciones/muestra_andes.png', 'card-andes', [640, 960]],
  ['pages/interactivos/juego.png', 'card-milanesa', [640, 960]],
  ['pages/interactivos/jum.jpg', 'card-jump', [640, 915]],
  ['pages/Graficos/g_1.png', 'card-suplemento', [640, 843]],
  ['pages/Graficos/infografia.jpg', 'card-infografia', [640, 960]],
  ['pages/Animaciones/panes.jpg', 'panes', [800, 1400]],
  ['pages/Animaciones/mattep.png', 'mattep', [900, 1800]],
  ['pages/interactivos/cel_mila3.png', 'cel-milanesa', [640, 1112]],
  ['pages/interactivos/loki cel.png', 'cel-jump', [640, 1112]],
  ['pages/Graficos/zoom.png', 'zoom-suplemento', [609]],
  ['pages/Graficos/tapa1.png', 'tapa1', [640, 1000]],
  ['pages/Graficos/tapa2.png', 'tapa2', [640, 1000]],
  ['pages/Graficos/tapa3bis.png', 'tapa3', [640, 1000]],
  ['pages/Graficos/zoom_infografia_1.png', 'zoom-infografia', [626]],
  ['pages/Graficos/infografiatapa.png', 'infografia-tapa', [640, 1100]],
  ['pages/Graficos/zoom_info.png', 'infografia-detalle', [640, 1000]],
  ['pages/interactivos/ciudad.png', 'ciudad', [1600]],
  ['pages/interactivos/nubes.png', 'nubes', [1200]],
  ['pages/Animaciones/pospo_bimbo.jpg', 'bg-bimbo', [900]],
  ['pages/Animaciones/pospo_1-100.jpg', 'bg-andes', [900]],
  ['svg/juegoicon.png', 'icon-juego', [110]],
  ['svg/icon_video.png', 'icon-video', [98]],
  ['svg/icon_grafico.png', 'icon-grafico', [100]],
  ['svg/icon_visualizacion.png', 'icon-visualizacion', [100]],
];

const sizes = {};
for (const [file, name, widths] of jobs) {
  const input = resolve(SRC, file);
  if (!existsSync(input)) { console.warn('falta', file); continue; }
  const meta = await sharp(input).metadata();
  sizes[name] = { w: meta.width, h: meta.height, widths: widths.map((w) => Math.min(w, meta.width)) };
  for (const w of widths) {
    const width = Math.min(w, meta.width);
    const base = sharp(input).resize({ width });
    await base.clone().webp({ quality: 78, effort: 5 }).toFile(`${OUT}/${name}-${width}.webp`);
    await base.clone().avif({ quality: 52, effort: 4 }).toFile(`${OUT}/${name}-${width}.avif`);
  }
  console.log('ok', name);
}
writeFileSync('scripts/sizes.json', JSON.stringify(sizes, null, 1));
