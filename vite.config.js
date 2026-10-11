import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';

const dir = import.meta.dirname;
const proyectos = readdirSync(resolve(dir, 'proyectos')).filter((f) => f.endsWith('.html'));

export default defineConfig({
  root: dir,
  base: './',
  build: {
    target: 'es2022',
    cssMinify: 'lightningcss',
    rollupOptions: {
      input: {
        index: resolve(dir, 'index.html'),
        contacto: resolve(dir, 'contacto.html'),
        ...Object.fromEntries(proyectos.map((f) => [f.replace('.html', ''), resolve(dir, 'proyectos', f)])),
      },
    },
  },
});
