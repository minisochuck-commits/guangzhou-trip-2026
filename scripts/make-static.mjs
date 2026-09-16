/*
 * 把构建产物拼成一个纯静态站，用来发到国内能打开的托管上。
 *
 * 这一页没有任何接口调用，数据全在包里，服务端只负责吐第一屏 HTML。
 * 所以：把生产 worker 渲染出来的 HTML 存成 index.html，
 * 再把 dist/client 整个搬过去，就是一个不需要服务端的完整站点。
 *
 * 用法：先 `npm run build`，再起 `npm run start -- --port 8788`，然后
 *   node scripts/make-static.mjs http://127.0.0.1:8788 static
 */
import { cp, mkdir, rm, writeFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const origin = process.argv[2] ?? "http://127.0.0.1:8788";
const outDir = path.resolve(process.argv[3] ?? "static");

async function main() {
  const res = await fetch(`${origin}/`);
  if (!res.ok) throw new Error(`拉取首页失败：HTTP ${res.status}`);
  const raw = await res.text();
  if (!raw.includes("<html")) throw new Error("拿到的不是 HTML");

  // 预览服务可能仍保留上一次构建的清单；拒绝把旧 HTML 与新脚本拼成坏包。
  const assets = new Set([...raw.matchAll(/\/_next\/[A-Za-z0-9._/-]+\.(?:js|css)/g)].map((match) => match[0]));
  if (assets.size === 0) throw new Error("首页没有构建资源引用");
  for (const asset of assets) {
    await stat(path.join("dist/client", asset.slice(1))).catch(() => {
      throw new Error(`首页引用的资源不属于当前构建：${asset}；请重启生产预览后重新生成。`);
    });
  }

  // 绝对路径改成相对：这样放在任何子目录下都能开（GitHub Pages 的项目仓
  // 是 /<repo>/ 这种路径），也方便整个文件夹拷走。
  // JS 分包里没有任何绝对 /_next/ 引用，所以只需要改这一份 HTML。
  // 同一个路径在 HTML 属性里是 "/x"，在内嵌的 RSC 载荷里是转义过的 \"/x\"，
  // 两种写法都要改，否则子目录下 favicon 和 manifest 会 404。
  const html = raw
    .replaceAll('"/_next/', '"./_next/')
    .replaceAll('\\"/_next/', '\\"./_next/')
    .replaceAll('"/favicon.svg"', '"./favicon.svg"')
    .replaceAll('\\"/favicon.svg\\"', '\\"./favicon.svg\\"')
    .replaceAll('"/manifest.webmanifest"', '"./manifest.webmanifest"')
    .replaceAll('\\"/manifest.webmanifest\\"', '\\"./manifest.webmanifest\\"');
  const leftover = html.match(/"\/(?!\/)[a-z_]/gi);
  if (leftover) {
    console.warn(`注意：HTML 里还剩 ${leftover.length} 处绝对路径`);
  }

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  // dist/client 里就是全部静态资源（_next、favicon、sw.js、manifest…）
  await cp(path.resolve("dist/client"), outDir, { recursive: true });

  await writeFile(path.join(outDir, "index.html"), html, "utf8");
  // GitHub Pages 用 404.html 兜底，深链接也能落回同一个应用
  await writeFile(path.join(outDir, "404.html"), html, "utf8");
  // 别让 Pages 拿 Jekyll 处理下划线开头的 _next 目录
  await writeFile(path.join(outDir, ".nojekyll"), "", "utf8");

  let files = 0;
  let bytes = 0;
  const walk = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else {
        files += 1;
        bytes += (await stat(full)).size;
      }
    }
  };
  await walk(outDir);

  console.log(`静态站已生成：${outDir}`);
  console.log(`  index.html ${html.length} 字符`);
  console.log(`  共 ${files} 个文件，${(bytes / 1024).toFixed(0)} KB`);
}

main().catch((error) => {
  console.error(String(error?.message ?? error));
  process.exit(1);
});
