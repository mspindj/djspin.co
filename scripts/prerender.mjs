// Después de `vite build`: escribe la página ya armada de cada idioma.
//   dist/index.html      español  (/)
//   dist/en/index.html   inglés   (/en)
// Cada una con su <html lang>, su cabecera (src/seo.ts) y el contenido dentro de #root.
// El navegador vuelve a montar la app encima con createRoot: el HTML es para buscadores,
// vistas previas de redes y para que el contenido se vea antes de que cargue el JavaScript.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const SSR = resolve('node_modules/.ssr/entry-server.js')
const { locales, render, headFor, pathFor } = await import(pathToFileURL(SSR).href)

const template = readFileSync('dist/index.html', 'utf8')
const START = '<!--seo:start-->', END = '<!--seo:end-->'
const a = template.indexOf(START), b = template.indexOf(END)
if (a < 0 || b < 0) throw new Error('prerender: faltan las marcas seo:start / seo:end en index.html')
if (!template.includes('<div id="root"></div>')) throw new Error('prerender: no encontré <div id="root"></div> vacío')

for (const locale of locales) {
  const body = render(locale)
  if (body.length < 5000) throw new Error(`prerender: el HTML de "${locale}" salió sospechosamente corto (${body.length})`)
  const html = (template.slice(0, a) + headFor(locale) + template.slice(b + END.length))
    .replace('<html lang="es">', `<html lang="${locale}">`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  const dir = resolve('dist', '.' + pathFor(locale))
  mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, 'index.html'), html)
  console.log(`prerender ${locale}: ${pathFor(locale)} · ${(html.length / 1024).toFixed(1)} kB`)
}
rmSync(resolve('node_modules/.ssr'), { recursive: true, force: true })
