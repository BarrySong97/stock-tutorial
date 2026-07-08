import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出:next build 产出纯静态站到 out/,用于 Cloudflare Pages 托管。
  // 站点全部页面都是预渲染静态内容,无 SSR / API 路由,故可 export。
  output: "export",
  // export 模式下 next/image 无法用默认优化器(需服务端),关掉即可(本站也未用 next/image)。
  images: { unoptimized: true },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
