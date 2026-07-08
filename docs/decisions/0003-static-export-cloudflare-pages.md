# 0003. 静态导出 + Cloudflare Pages 托管

- 状态:已采纳
- 日期:2026-07-08

## 背景

站点是纯展示的科普单页,所有页面都是预渲染静态内容(`next build` 输出全是 `○ (Static)`),没有 SSR、API 路由、中间件、ISR,也不用 `next/image`。需要一个简单、便宜、可自动部署的托管方案。

## 决策

用 Next.js **静态导出**(`output: "export"`)产出 `out/`,托管到 **Cloudflare Pages**;用 Cloudflare **原生 Git 集成**在 push 到 `main` 时自动构建部署(Cloudflare 拉代码、在它自己的 CI 构建,不用 GitHub Actions)。

## 理由

- 站点无任何服务端运行时需求,静态导出最简单、CDN 全球分发、成本近乎为零。
- Cloudflare Pages 对静态站一等支持,自动 HTTPS、预览部署、回滚方便。
- 相比 `@cloudflare/next-on-pages`(为 SSR/Edge 场景)更轻:纯静态不需要 Workers 运行时。
- 用 Cloudflare 原生 Git 集成而非 GitHub Actions:Cloudflare 侧构建,GitHub 不用存密钥,配置更少。

## 后果

- **限制**:今后若要加 SSR / API 路由 / 中间件 / `next/image` 优化,必须放弃纯静态导出,改用 `@cloudflare/next-on-pages` 或 Cloudflare Workers 运行时。
- `pnpm-lock.yaml` 必须提交(CI `--frozen-lockfile`),已从 `.gitignore` 移除。
- 本地不能再用 `next start`;预览用 `pnpm preview`(静态服务器起 `out/`)。
- 部署细节见 [docs/topics/deployment.md](../topics/deployment.md)。
