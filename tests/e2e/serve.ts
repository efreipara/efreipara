// Sert .output/public avec les règles de nginx/default.conf.template :
// try_files $uri $uri/index.html $uri.html, sinon 404.html avec un vrai statut 404.
import { join, normalize } from 'node:path'

const root = join(import.meta.dir, '../../.output/public')
const port = Number(process.env.PORT ?? 4173)

const fileAt = async (path: string) => {
  const file = Bun.file(join(root, path))
  return (await file.exists()) ? file : null
}

Bun.serve({
  port,
  hostname: '127.0.0.1',
  async fetch(req) {
    const path = normalize(decodeURIComponent(new URL(req.url).pathname))
    if (path.split('/').some((part) => part.startsWith('.'))) {
      return new Response(Bun.file(join(root, '404.html')), { status: 404 })
    }
    for (const candidate of [path, join(path, 'index.html'), `${path}.html`]) {
      if (candidate.endsWith('/')) continue
      const file = await fileAt(candidate)
      if (file) return new Response(file)
    }
    return new Response(Bun.file(join(root, '404.html')), {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  },
})

console.log(`Site généré servi sur http://127.0.0.1:${port}`)
