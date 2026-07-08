# 专题:部署到 Cloudflare Pages(静态导出 + Git 自动部署)

## 这是什么 / 为什么单独成篇

本站是 Next.js **静态导出**站(`next.config.mjs` 里 `output: "export"`),`pnpm build` 产出纯静态文件到 `out/`,托管在 **Cloudflare Pages**,用 **Cloudflare 原生 Git 集成**自动部署(Cloudflare 直接拉 GitHub 仓库、在它自己的 CI 里构建,不用 GitHub Actions)。配置跨 `next.config` / `wrangler.toml` / `.nvmrc`,故单独说明。见 [ADR-0003](../decisions/0003-static-export-cloudflare-pages.md)。

## 涉及的文件

- `next.config.mjs` — `output: "export"` + `images.unoptimized`(export 下 next/image 不能用默认优化器)。
- `wrangler.toml` — Pages 项目名 `stock-tutorial` + 产物目录 `pages_build_output_dir = "out"`(Cloudflare 构建会读它定位输出)。
- `.nvmrc` — `22`,让 Cloudflare 构建用 Node 22(Next 16 需要 20+)。
- `package.json` — 已设 `packageManager: pnpm@…`(Cloudflare 据此 + `pnpm-lock.yaml` 自动用 pnpm);`preview`(本地预览)、`deploy`(可选:手动 wrangler 部署)。

## 一次性配置(Cloudflare 控制台,自动部署)

在 [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**:

1. 授权并选择仓库 `BarrySong97/stock-tutorial`。
2. 生产分支:`main`。
3. 构建设置:
   - **Framework preset**:`Next.js (Static HTML Export)`(或选 `None`,手填下面两项)
   - **Build command**:`pnpm build`
   - **Build output directory**:`out`
4. 项目名建议填 `stock-tutorial`(与 `wrangler.toml` 的 `name` 一致)。
5. Save and Deploy。

配好后,**每次 push 到 `main`,Cloudflare 会自动拉代码、`pnpm build`、把 `out/` 发布上线**;其它分支的 push 会生成预览部署。全程不需要 GitHub Actions,也不用在 GitHub 存任何密钥。

> ⚠️ 连接仓库、授权 GitHub 都要你本人在 Cloudflare / GitHub 界面点授权,agent 不代操作账号。

## 本地验证 / 可选手动部署

```bash
pnpm build            # 产出 out/
pnpm preview          # 本地静态服务器起 out/,访问 http://localhost:6006
```

若想绕过 Git 集成手动推一次(需先 `npx wrangler login`):

```bash
pnpm deploy           # = npx wrangler pages deploy(读 wrangler.toml)
```

## 注意事项

- **静态导出限制**:不能用 SSR / API 路由 / 中间件 / ISR / `next/image` 默认优化。本站都不用,故 OK;若将来加这些,得改回 Node 运行时(换 `@cloudflare/next-on-pages` 或 Workers),Git 集成的构建设置也要随之改。
- **锁文件必须提交**:Cloudflare 构建用 `pnpm-lock.yaml` 复现依赖,所以它已从 `.gitignore` 移除、需随仓库提交。
- **项目名一致**:`wrangler.toml` 的 `name`、Cloudflare 项目名、(可选)手动部署命令三处都用 `stock-tutorial`。
- **Node 版本**:`.nvmrc` 固定 22;若 Cloudflare 默认版本偏低导致构建失败,也可在项目 Settings → 环境变量加 `NODE_VERSION=22`。
- **`next start` 不可用**:静态导出没有 Node 服务端,本地预览用 `pnpm preview`。
