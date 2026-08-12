/**
 * Generates the social-share preview image (Open Graph / Twitter card) as a
 * real PNG, with no image dependencies — same approach as generate-icons.mjs,
 * just a widescreen 1200×630 composition instead of a square mark.
 *
 * Run with: npm run og-image
 *
 * Why hand-rolled instead of an SVG-to-PNG pipeline (e.g. sharp, which is
 * only a transitive dependency here, not a direct one): the deploy workflow
 * never runs image generation — every PNG in public/ is pre-generated and
 * committed, exactly like the app icons. Adding a real dependency just for
 * this one script, and then not even running it in CI, would be pure
 * overhead for zero benefit.
 */

import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const ATLANTIC = [7, 27, 43];
const DEEP = [18, 58, 82];
const CORONA = [255, 214, 107];
const SUNSET = [232, 121, 76];
const DISK = [4, 14, 22];

const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * Math.min(1, Math.max(0, t))));

function crc32(buf) {
  let c;
  const table = crc32.table ?? (crc32.table = Array.from({ length: 256 }, (_, n) => {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  }));
  let crc = 0xffffffff;
  for (const byte of buf) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([length, typeAndData, crc]);
}

function encodePng(width, height, rgb) {
  const raw = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 3);
    raw[rowStart] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3;
      raw[rowStart + 1 + x * 3] = rgb[i];
      raw[rowStart + 2 + x * 3] = rgb[i + 1];
      raw[rowStart + 3 + x * 3] = rgb[i + 2];
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const W = 1200;
const H = 630;

function drawOgImage() {
  const rgb = Buffer.alloc(W * H * 3);

  // Low in the frame and off-centre: the eclipse the app is actually about
  // is a Sun sitting 12° above the horizon, not a tidy zenith illustration.
  const cx = W * 0.60;
  const cy = H * 0.40;
  const r = H * 0.24;
  const horizonY = H * 0.66;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let color = mix(ATLANTIC, DEEP, (y / H) * 0.6);

      if (y > horizonY) {
        // Sea: darker, with a warm reflection column under the eclipse.
        const reflection = Math.exp(-Math.abs(x - cx) / (W * 0.05));
        const depth = (y - horizonY) / (H - horizonY);
        color = mix(mix(ATLANTIC, DISK, 0.35), SUNSET, reflection * 0.4 * (1 - depth * 0.7));
      } else {
        const d = Math.hypot(x - cx, y - cy);
        if (d < r) {
          color = DISK;
        } else {
          // Corona: a crisp inner ring fading into a soft glow.
          const ring = d < r * 1.07 ? 1 : 0;
          const glow = Math.exp(-(d - r) / (r * 0.55));
          color = mix(color, CORONA, Math.min(1, ring + glow * 0.9));
        }
      }

      const i = (y * W + x) * 3;
      rgb[i] = color[0];
      rgb[i + 1] = color[1];
      rgb[i + 2] = color[2];
    }
  }

  return encodePng(W, H, rgb);
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'og-image.png'), drawOgImage());
console.log(`✓ og-image.png (${W}×${H})`);
