import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.tesszhaolcsw.com',
  output: 'static',
  publicDir: './public',
  outDir: './dist',
  build: { format: 'directory' }
});
