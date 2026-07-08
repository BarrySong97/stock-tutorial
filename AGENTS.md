# 股票基础知识科普 — Agent 指南

**是什么**:面向 A 股新手的单页图解科普站——用大量 SVG 图表把 K 线、成交量、均线、盘口、资金流等基础概念讲清楚。给零基础投资者看。
**架构**:前端(纯静态站) · TypeScript / Next.js 16(App Router) / React 19 / Tailwind CSS v4 / HeroUI v3 · 运行见 [docs/run.md](docs/run.md)

## 🚨 红线(不可逾越;每条都标出处)

- **A 股配色:红涨绿跌**——所有图表/涨跌语义色必须红=涨、绿=跌,与国际惯例相反。见 [ADR-0001](docs/decisions/0001-ashare-red-up-green-down.md)
- **图表颜色只走 CSS 变量**(`var(--stock-up)` / `var(--foreground)` / `var(--border)` 等),禁止在组件里写死 hex——否则暗色模式失效。见 [docs/modules/diagrams/README.md](docs/modules/diagrams/README.md)
- **不引入 CJK web 字体**——中文用系统字体栈兜底(体积 + 构建期网络)。见 [ADR-0002](docs/decisions/0002-system-cjk-fonts.md)
- **图内随机数据必须确定性**(种子伪随机),禁止 `Math.random()` / `Date.now()`——否则服务端/客户端渲染不一致(hydration mismatch)。见 [docs/modules/diagrams/README.md](docs/modules/diagrams/README.md)
- **文案精简、图为主**:概念讲解优先靠图 + 图内标注,正文每节控制在 1–2 短段。见 [docs/topics/page-structure.md](docs/topics/page-structure.md)

## ✅ 工作流(Definition of Done,缺一不算完成)

1. 读相关模块文档 [docs/modules/](docs/modules/)(+ 跨模块专题 [docs/topics/](docs/topics/))+ 待改文件的文件头
2. 大改先写 [docs/plans/](docs/plans/) 计划(Plan → Approve → Execute)
3. 改代码,遵循 [docs/conventions.md](docs/conventions.md)
4. 同步:文件头 + 对应 `docs/modules/<module>/`(或专题 `docs/topics/`);决策性改动补一条 [ADR](docs/decisions/)
5. 按 [docs/testing.md](docs/testing.md) **真跑验证**(浏览器打开 6006 逐图看,含暗色)
6. 跑 sensors:`node scripts/check-docs.mjs` + `pnpm build`,清掉报错
7. 按 [docs/conventions.md](docs/conventions.md) 提交

> **Ratchet 棘轮**:agent 犯了错,别只修这一处——固化成一条 test / lint 规则或 ADR,保证同样的错不再犯。

## 📚 导航

- **模块**:[docs/modules/diagrams/](docs/modules/diagrams/)(讲解图原子系统)
- **专题(跨模块 / 复杂)**:[docs/topics/page-structure.md](docs/topics/page-structure.md)(单页如何由 sections + TOC + 图组合) · [docs/topics/deployment.md](docs/topics/deployment.md)(静态导出 + Cloudflare Pages 部署)
- 设计系统 [design.md](design.md) · 运行手册 [docs/run.md](docs/run.md) · 规范&术语 [docs/conventions.md](docs/conventions.md)
- 测试&验证 [docs/testing.md](docs/testing.md) · 需求 [docs/specs/](docs/specs/) · 计划 [docs/plans/](docs/plans/) · 决策 [docs/decisions/](docs/decisions/)
