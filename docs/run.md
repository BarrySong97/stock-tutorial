# 运行手册

## 环境要求

- 运行时:Node.js `22+`
- 包管理:`pnpm`(仓库已设 `packageManager` 与 `pnpm.onlyBuiltDependencies`)
- 其他依赖:无(纯静态站,无数据库 / 环境变量)

## 安装

```bash
pnpm install
```

首装若跳过原生依赖构建脚本,补一次:

```bash
pnpm rebuild   # 构建 @tailwindcss/oxide、sharp、unrs-resolver
```

## 本地启动

```bash
pnpm dev
```

- 访问地址:`http://localhost:6006`(端口固定在 `package.json` 的 `dev`/`start` 脚本)
- 若报 `EMFILE: too many open files`:当前终端 `ulimit -n 10240` 后再起(macOS launchd 默认软上限偏低)。

## 构建

```bash
pnpm build      # 静态导出,产物在 out/(output: "export")
```

## 预览与部署(Cloudflare Pages)

```bash
pnpm preview    # 本地静态服务器起 out/,访问 http://localhost:6006
pnpm deploy     # 手动部署到 Cloudflare Pages(npx wrangler pages deploy)
```

- **自动部署**:在 Cloudflare 控制台把仓库连上 Pages(Git 集成)后,push 到 `main` 由 Cloudflare 自动构建发布,无需 GitHub Actions。构建设置与一次性配置见 [topics/deployment.md](topics/deployment.md)。
- 注:静态导出下没有 `next start`,本地预览用 `pnpm preview`。

## 测试

本项目没有自动化测试套件,验证靠「真跑 + 浏览器看图」。见 [testing.md](testing.md)。

## Lint / 格式化 / 类型检查

```bash
pnpm build      # 内含 TypeScript 类型检查(Next build 阶段)
npx prettier --write .   # 格式化
```

> ⚠️ `pnpm lint`(eslint)当前不可用:模板自带的 `eslint-config-next` 与 `@eslint/eslintrc` 版本组合会报
> `Unexpected top-level property "name"`。这是模板遗留问题,不影响 `build`/`dev`。format-lint hook 因此只接 prettier。

## 文档同步检查(收尾必跑)

```bash
node scripts/check-docs.mjs
```

## 常用脚本

- `node scripts/check-docs.mjs` — 防漂移检查(缺文件头 / 失效引用 / 文档漂移)
- `node scripts/check-docs.mjs --hook` — Stop hook 模式(有 ❌ 则 exit 2 拦截收尾)
