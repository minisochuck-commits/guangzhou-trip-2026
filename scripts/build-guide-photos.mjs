// 把 scripts/guide-photos.json 里那几张照片压进 public/images/，并生成 lib/guide-photos.ts。
//
//   node scripts/build-guide-photos.mjs [输入目录]        默认 /tmp/guangzhou-polish-photos
//
// 为什么单独一份：lib/image-credits.ts 是老脚本 scripts/pick-images.py 生成的，
// 在那边手写会被下次重跑覆盖。新照片走这一份清单，两份在 lib/photos.ts 合并。
//
// 规矩：
//   - 最长边压到 1400，**不放大**原图，**不裁切** —— 建筑的塔尖、屋檐都要留在画面里。
//   - 三语 alt 与图说写在清单里，跟着照片走，页面上不会出现空 alt。
//   - 维基来源按 CC 条件署名作者与授权链接；官网/政府来源只写来源页与提供方，
//     不冒充 CC、不冒充维基。
//   - 原图不进仓：清单里的 assetUrl 记着从哪儿取，重跑前先把同名文件放回输入目录。

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const INPUT_DIR = process.argv[2] ?? "/tmp/guangzhou-polish-photos";
const OUT_DIR = path.join(ROOT, "public/images");
const MANIFEST = path.join(ROOT, "scripts/guide-photos.json");
const GENERATED = path.join(ROOT, "lib/guide-photos.ts");

const MAX_EDGE = 1400;
const QUALITY = 72; // 手机上先读得快；细节图 1400 宽 72 质量看不出差别

const { photos } = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
fs.mkdirSync(OUT_DIR, { recursive: true });

const records = [];
let missing = 0;
for (const photo of photos) {
  const input = path.join(INPUT_DIR, photo.input);
  const file = `images/${photo.key}.jpg`;
  const dest = path.join(ROOT, "public", file);
  if (!fs.existsSync(input)) {
    missing += 1;
    console.log(`跳过 ${photo.key}：输入不在 ${input}（按清单里的 assetUrl 取回）`);
    if (fs.existsSync(dest)) {
      const { width, height } = await sharp(dest).metadata();
      records.push({ photo, file, width, height });
    }
    continue;
  }
  const info = await sharp(input)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(dest);
  records.push({ photo, file, width: info.width, height: info.height });
  const kb = Math.round(fs.statSync(dest).size / 1024);
  console.log(`${photo.key}  ${info.width}×${info.height}  ${kb} KB`);
}

const lines = records.map(({ photo, file, width, height }) => {
  const entry = {
    key: photo.key,
    file,
    width,
    height,
    title: photo.title,
    artist: photo.artist,
    license: photo.license,
    ...(photo.licenseUrl ? { licenseUrl: photo.licenseUrl } : {}),
    page: photo.page,
    source: photo.source,
    alt: photo.alt,
    caption: photo.caption,
  };
  return `  ${JSON.stringify(entry)},`;
});

fs.writeFileSync(
  GENERATED,
  `// 自动生成：scripts/build-guide-photos.mjs（清单在 scripts/guide-photos.json）。不要手改。
//
// 每张照片带着自己的三语 alt 与一句图说：照片放到哪一章，说明就跟到哪一章，
// 不会出现空 alt，也不会把 alt 抄成一段长图说。
// source: "wikimedia" 按 CC 条件署名；source: "official" 只写来源页与提供方。
import type { L10n } from "./trip-data";

export type GuidePhoto = {
  key: string;
  file: string;
  width: number;
  height: number;
  title: string;
  artist: string;
  license: string;
  licenseUrl?: string;
  page: string;
  source: "wikimedia" | "official";
  alt: L10n;
  caption: L10n;
};

export const GUIDE_PHOTOS: GuidePhoto[] = [
${lines.join("\n")}
];
`,
  "utf8",
);

console.log(`\n写好 ${records.length} 张，生成 lib/guide-photos.ts${missing ? `（${missing} 张缺输入）` : ""}`);
