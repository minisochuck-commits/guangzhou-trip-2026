// 手工登记的照片：用户自己给的原图，以及主窗口逐张看过、但不走压缩脚本的素材。
//
//   lib/image-credits.ts   —— scripts/pick-images.py 生成的第一批（不手改）
//   lib/guide-photos.ts    —— scripts/build-guide-photos.mjs 生成的第二批（不手改）
//   lib/selected-photos.ts —— 这一份：手写的，原图常规 copy 入仓
//
// 规矩：
//   1. **原图原样入仓**：不重新编码、不缩放、不裁剪、不抹画面里的水印。
//      因此不受生成脚本那条「最长边 1400」的限制（那条是压缩脚本的口径）。
//   2. **署名照实写**：用户给的写「用户提供」、没有来源页；官网素材只写来源页与提供方。
//      两种都不冒充 CC、不冒充维基。
//   3. 每张自带三语 alt 与图说，两样都不能空。
import type { L10n } from "./trip-data";

export type SelectedPhoto = {
  key: string;
  file: string;
  width: number;
  height: number;
  /** 画面内容，不是文件名 —— 「图片来源」那一段列的就是这一行。 */
  title: string;
  /** 用户给的写「用户提供」；官网素材写提供方。 */
  artist: string;
  /** 授权说明。不能出现 CC / Creative Commons 字样。 */
  license: string;
  /** 官网素材的来源页。用户提供的原图没有这一项，署名就不挂链接。 */
  page?: string;
  source: "owner" | "official";
  alt: L10n;
  caption: L10n;
};

export const SELECTED_PHOTOS: SelectedPhoto[] = [
  {
    key: "chigang-canton-tower",
    file: "images/chigang-canton-tower.jpg",
    width: 1320,
    height: 1957,
    title: "赤岗塔与广州塔",
    artist: "用户提供",
    license: "用户提供，原图未改动",
    source: "owner",
    alt: {
      zh: "一座层层出檐的砖塔立在树丛之上，正后方是细腰收束的广州塔，再往两边是珠江新城成排的玻璃高楼，天上是大片积云。",
      en: "A tiered brick pagoda rising out of the treetops, the slender waisted Canton Tower directly behind it, the glass towers of Zhujiang New Town spread out on either side under banked cloud.",
      ar: "باغودا من الآجر بطبقات متدرّجة ترتفع فوق قمم الأشجار، وخلفها مباشرةً برج كانتون النحيل المشدود الخصر، وعلى الجانبين أبراج تشوجيانغ الجديدة الزجاجية تحت سُحُب متراكمة.",
    },
    caption: {
      zh: "赤岗塔与广州塔同框，沿着海珠江岸看广州的古今。",
      en: "The Chigang pagoda and the Canton Tower in one frame — the old and the new of Guangzhou along the Haizhu riverbank.",
      ar: "باغودا تشيغانغ وبرج كانتون في إطار واحد — قديم قوانغتشو وحديثها على ضفة هايتشو.",
    },
  },
  {
    key: "cantonese-chicken-soup",
    file: "images/cantonese-chicken-soup.jpg",
    width: 1600,
    height: 2400,
    title: "广式鸡汤（《广州明天将举行这场中华美食盛“荟”，千万别错过！》，2022-07-26）",
    artist: "广州市商务局供图 · 花城（广州日报报业集团）",
    license: "来源页",
    page: "https://huacheng.gz-cmc.com/pages/2022/07/26/7a3a2b46d8b54c26a11aa95cd2521f4b.html",
    source: "official",
    alt: {
      zh: "一只白瓷汤盅里盛着清澈的鸡汤，汤里是一条带骨的鸡腿和几样配料，盅边搭着一只汤勺。",
      en: "A clear chicken soup in a white porcelain pot: a chicken leg on the bone and a few other ingredients in the broth, a spoon resting at the rim.",
      ar: "حساء دجاج صافٍ في وعاء خزفي أبيض: فخذ دجاج بعظمه وبعض المكوّنات في المرق، وملعقة مستقرّة على الحافة.",
    },
    caption: {
      zh: "粤式鸡汤（菜式示意）。",
      en: "A Cantonese chicken soup (an example of the dish).",
      ar: "حساء دجاج كانتوني (نموذج للطبق).",
    },
  },
];
