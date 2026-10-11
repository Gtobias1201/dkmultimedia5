# DK Multimedia · portfolio (versión 2026)

Reconstrucción de [Danisdnk/dkmultimedia5](https://github.com/Danisdnk/dkmultimedia5) con la misma identidad visual
(dibujos de línea azul/rojo sobre blanco, scroll horizontal, tarjetas de proyecto) y tecnología actual.

## Comandos

```bash
npm install
npm run dev       # servidor de desarrollo
npm run build     # genera dist/ listo para subir a cualquier hosting estático
npm run preview   # sirve dist/
npm run images -- <ruta-al-repo-original>   # regenera AVIF/WebP
```

## Qué cambió

- **Sin jQuery, GSAP, ScrollMagic ni Bootstrap** (~400 KB de JS) → ~5 KB de JS propio.
  El scroll horizontal es `position: sticky` + una variable CSS; los trazos SVG usan `pathLength="1"` + `stroke-dashoffset`.
- **Responsive**: en escritorio se mantiene el scroll horizontal pineado; en móvil (o con "reducir movimiento")
  las secciones pasan a vertical y los dibujos se trazan al entrar en pantalla.
- **Imágenes**: PNG de 1–3 MB → AVIF/WebP con `srcset` (2.3 MB en total para todas las variantes).
- **Juegos Construct 2** cargan recién al tocar "Jugar"; los videos usan `preload="none"`.
- Carrusel de Bootstrap → galería nativa con scroll-snap. "Sobre mí" pasó de imagen a HTML/SVG real.
- View Transitions entre páginas, animaciones ligadas al scroll nativas (`animation-timeline`), SEO/OG, accesibilidad.

## Estructura

- `index.html`, `contacto.html` — páginas principales
- `scripts/gen-pages.mjs` — datos y plantilla de las 6 páginas de `proyectos/` (editar acá, no los HTML generados)
- `src/` — JS y CSS · `public/` — imágenes, juegos, videos, favicon

## Notas

- Los videos se recomprimieron para web (H.264, faststart): 101 MB → 5,4 MB.
- El formulario envía a `send_mail.php` como el original; en un hosting estático hay que apuntarlo a un servicio de formularios.

## Deploy

Cada push a `main` compila y publica en GitHub Pages con `.github/workflows/deploy.yml`.
