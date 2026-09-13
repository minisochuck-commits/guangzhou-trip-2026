// 页面上所有照片的统一入口：路径、尺寸、三语 alt 与图说、授权。
//
// 三批素材合在这里：
//   lib/image-credits.ts  —— 老脚本 scripts/pick-images.py 生成的第一批（不手改）
//   lib/guide-photos.ts   —— scripts/build-guide-photos.mjs 生成的第二批（不手改，自带 alt 与图说）
//   lib/selected-photos.ts —— 用户给的原图与不走压缩脚本的素材，**手写的只有这一份**
// 组件只 import 这一份，不再各自去拼 IMG。

import { IMAGE_CREDITS } from "./image-credits";
import { GUIDE_PHOTOS } from "./guide-photos";
import { SELECTED_PHOTOS } from "./selected-photos";
import type { L10n } from "./trip-data";

export type PhotoCredit = {
  key: string;
  file: string;
  title: string;
  artist: string;
  license: string;
  /** CC 授权的条款页。来源页授权（政府、官网）与用户提供的原图没有这一项。 */
  licenseUrl?: string;
  /** 来源页。用户自己给的原图没有来源页，这一项就是空的，署名不挂链接。 */
  page?: string;
  /**
   * wikimedia：按 CC 条件署名；official：只写来源页与提供方，不冒充 CC；
   * owner：用户提供的原图，只写「用户提供」，既不挂外部链接也不冒充授权。
   */
  source: "wikimedia" | "official" | "owner";
};

/** CC 授权名 → 条款页。名字是脚本写进来的，这里只做一次映射，不改授权本身。 */
const LICENSE_URLS: Record<string, string> = {
  CC0: "https://creativecommons.org/publicdomain/zero/1.0/",
  "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
  "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/",
  "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
  "CC BY-SA 2.0": "https://creativecommons.org/licenses/by-sa/2.0/",
  "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
};

export const PHOTO_CREDITS: PhotoCredit[] = [
  ...IMAGE_CREDITS.map((credit) => ({
    ...credit,
    source: (credit.license === "来源页" ? "official" : "wikimedia") as PhotoCredit["source"],
    licenseUrl: LICENSE_URLS[credit.license],
  })),
  ...GUIDE_PHOTOS.map((photo) => ({
    key: photo.key,
    file: photo.file,
    title: photo.title,
    artist: photo.artist,
    license: photo.license,
    licenseUrl: photo.licenseUrl,
    page: photo.page,
    source: photo.source,
  })),
  ...SELECTED_PHOTOS.map((photo) => ({
    key: photo.key,
    file: photo.file,
    title: photo.title,
    artist: photo.artist,
    license: photo.license,
    page: photo.page,
    source: photo.source,
  })),
];

/** key → 相对路径。静态站、离线可用，所以是 "./images/x.jpg" 这种相对写法。 */
export const IMG: Record<string, string> = Object.fromEntries(
  PHOTO_CREDITS.map((credit) => [credit.key, "./" + credit.file]),
);

/** 第二、三批照片知道自己的像素尺寸：写进 <img width height>，滚动时不跳版。 */
const SIZES: Record<string, { width: number; height: number }> = Object.fromEntries(
  [...GUIDE_PHOTOS, ...SELECTED_PHOTOS].map((photo) => [
    photo.key,
    { width: photo.width, height: photo.height },
  ]),
);

export function photoSize(key: string) {
  return SIZES[key];
}

/** 第二、三批照片自带的三语 alt 与图说。第一批的说明写在各自的数据条目里。 */
const TEXTS: Record<string, { alt: L10n; caption: L10n }> = Object.fromEntries(
  [...GUIDE_PHOTOS, ...SELECTED_PHOTOS].map((photo) => [
    photo.key,
    { alt: photo.alt, caption: photo.caption },
  ]),
);

export function photoAlt(key: string): L10n | undefined {
  return TEXTS[key]?.alt;
}

export function photoCaption(key: string): L10n | undefined {
  return TEXTS[key]?.caption;
}
