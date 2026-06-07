import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'

async function removeBg(inputPath, outputPath) {
  const img = sharp(inputPath)
  const { data, info } = await img
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixels = new Uint8Array(data)
  const threshold = 200

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i], g = pixels[i+1], b = pixels[i+2]
    // Siyah arka planı kaldır
    if (r < 30 && g < 30 && b < 30) {
      pixels[i+3] = 0
    }
    // Koyu gri de kaldır
    if (r < 50 && g < 50 && b < 50) {
      pixels[i+3] = 0
    }
    // Beyaz/açık arka planı kaldır
    if (r > threshold && g > threshold && b > threshold) {
      pixels[i+3] = 0
    }
    // Mor/pembe arka planı da kaldır
    const isMagenta = r > 120 && b > 120 && g < 100
    const isPurple = r > 80 && b > 150 && g < 80
    if (isMagenta || isPurple) {
      pixels[i+3] = 0
    }
  }

  await sharp(Buffer.from(pixels), {
    raw: { width: info.width, height: info.height, channels: 4 }
  })
  .png()
  .toFile(outputPath)

  console.log(`✓ ${outputPath} kaydedildi`)
}

removeBg('public/shard.png', 'public/shard.png')
