// Prépare les médias du CDN : cdn/sources/ (originaux) → cdn/dist/ (fichiers à téléverser).
// Photos : WebP en 3 largeurs, suffixées (-480, -960, -1600), jamais agrandies au-delà de l'original.
// Vidéos : <nom>-av1.mp4 et <nom>-h264.mp4 (secours), 1080 px au plus, sans son.
// Couvertures de la galerie : téléchargées depuis Efrei Picture Studio d'après galerie.yml.
// Outils requis : cwebp, ffmpeg et ffprobe (Homebrew : webp, ffmpeg). Voir docs/CONTENT.md.
import { mkdir, readdir, readFile, stat } from 'node:fs/promises'
import { dirname, extname, join, relative } from 'node:path'
import { $ } from 'bun'
import { parse } from 'yaml'
import { CDN_IMAGE_WIDTHS } from '../app/utils/cdn'
import { DEFAULT_LOCALE } from '../app/utils/locales'
import type { GalleryItem } from '../app/utils/gallery'

const root = join(import.meta.dir, '../cdn')
const sources = join(root, 'sources')
const dist = join(root, 'dist')
const galleryContent = join(import.meta.dir, `../content/${DEFAULT_LOCALE}/pages/galerie.yml`)
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'])
const videoExtensions = new Set(['.mov', '.mp4', '.m4v'])

// Réglages retenus par mesure VMAF sur la vidéo d'accueil (source ProRes 1080) :
// AV1 CRF 33 ≈ 8 Mo, VMAF 96,8 ; H.264 CRF 23 ≈ 11 Mo, VMAF 96,3 (lu partout)
const videoEncodings = {
  av1: ['-c:v', 'libsvtav1', '-preset', '5', '-crf', '33'],
  h264: ['-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-profile:v', 'high'],
}

const walk = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name)
      if (entry.name.startsWith('.')) return []
      return entry.isDirectory() ? walk(path) : [path]
    }),
  )
  return files.flat()
}

// Fichier déjà généré et plus récent que sa source : rien à refaire
const isUpToDate = async (source: string, output: string) => {
  const out = await stat(output).catch(() => null)
  return out !== null && out.mtimeMs >= (await stat(source)).mtimeMs
}

const imageWidth = async (path: string) =>
  Number(
    await $`ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 ${path}`.text(),
  )

const buildImage = async (source: string) => {
  const base = relative(sources, source).slice(0, -extname(source).length)
  const width = await imageWidth(source)
  for (const target of CDN_IMAGE_WIDTHS) {
    const output = join(dist, `${base}-${target}.webp`)
    if (await isUpToDate(source, output)) continue
    await mkdir(dirname(output), { recursive: true })
    // EXIF et XMP retirés ; profil ICC gardé, sinon une photo Display P3 est lue en sRGB, couleurs ternes
    await $`cwebp -quiet -q 80 -m 6 -sharp_yuv -metadata icc -resize ${Math.min(target, width)} 0 ${source} -o ${output}`
    console.log(
      `${relative(root, output)}${width < target ? ` (${width} px, original plus petit)` : ''}`,
    )
  }
}

const videoFilter = "scale='min(1080,iw)':-2:flags=lanczos,format=yuv420p"

const buildVideo = async (source: string) => {
  const base = relative(sources, source).slice(0, -extname(source).length)
  for (const [codec, args] of Object.entries(videoEncodings)) {
    const output = join(dist, `${base}-${codec}.mp4`)
    if (await isUpToDate(source, output)) continue
    await mkdir(dirname(output), { recursive: true })
    await $`ffmpeg -hide_banner -loglevel error -y -i ${source} -an -map_metadata -1 -vf ${videoFilter} ${args} -movflags +faststart ${output}`
    console.log(relative(root, output))
  }
}

// `photo` d'un album pointe sur la vignette (/thumbnail) : l'original est en /full.
// Téléchargé une seule fois ; supprimer le fichier de cdn/sources/ pour le reprendre.
const fetchGalleryCovers = async () => {
  const { items } = parse(await readFile(galleryContent, 'utf8')) as { items: GalleryItem[] }
  for (const { type, date, photo } of items) {
    if (!photo?.endsWith('/thumbnail')) continue
    const output = join(sources, 'galerie', `${type}-${date}.jpg`)
    if (await Bun.file(output).exists()) continue
    const response = await fetch(photo.replace(/\/thumbnail$/, '/full'))
    if (!response.ok || response.headers.get('content-type') !== 'image/jpeg')
      throw new Error(`Couverture introuvable (${response.status}) : ${photo}`)
    await Bun.write(output, response)
    console.log(`${relative(root, output)} (téléchargée)`)
  }
}

await fetchGalleryCovers()
const files = await walk(sources)
for (const file of files) {
  const extension = extname(file).toLowerCase()
  if (imageExtensions.has(extension)) await buildImage(file)
  else if (videoExtensions.has(extension)) await buildVideo(file)
}
