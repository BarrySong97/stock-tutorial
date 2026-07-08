# 编码规范

## 命名

- 文件 / 目录:`kebab-case`(如 `moving-average.tsx`、`order-book.tsx`)
- 变量 / 函数:`camelCase`
- 组件 / 类型:`PascalCase`(组件导出如 `VolumeDiagram`)
- 常量:`UPPER_SNAKE`(如 `DIAGRAM_WIDTH`、`AXIS_X`)

## 目录与文件结构

- `app/` — Next.js App Router(`page.tsx` 单页、`layout.tsx`、`providers.tsx`、`error.tsx`)
- `components/` — 通用组件(`toc.tsx`、`diagram-figure.tsx`、`kline-chart.tsx`)
- `components/diagrams/` — 讲解图原子系统(每张图一个文件 + `primitives.tsx`/`series.tsx` 底层),见 [modules/diagrams/](modules/diagrams/)
- `config/` — 站点配置(`site.ts`、`fonts.ts`)
- `lib/` — 工具(`mock-kline-data.ts`)
- `styles/globals.css` — 全局样式 + 设计 token
- 每个源文件顶部必须有 AI 文件头(`@purpose/@role/@deps/@gotcha`),见 [../templates/file-headers/README.md](../templates/file-headers/README.md)。

## 架构边界

- 数据/展示分离:章节数据在 `app/page.tsx` 的 `sections` 数组,图表是纯展示组件(props 进、SVG 出),不含业务状态。
- 图表组件依赖方向:`具体图(volume/ma/…) → series.tsx / primitives.tsx → CSS 变量`,不反向。
- 颜色只从 CSS 变量取(`var(--*)`),不在组件里写死 hex(暗色红线)。

## Ratchet(棘轮原则)

- agent 犯了错,别只修这一处:固化成 ADR 或规范条目,保证同样的错不再犯。
- 能用确定性工具(prettier / tsc / check-docs)强制的,就别只写进文档。

## 错误处理

- 站点为纯静态展示,无运行时错误分支;`app/error.tsx` 是 Next 路由段错误兜底。

## 提交规范

- 格式:`type(scope): subject`(type: feat/fix/docs/refactor/chore)
- 一次提交一件事;信息说清「为什么」。
- 提交信息结尾按仓库约定加 `Co-Authored-By` 尾注。

---

# 术语表(领域词汇,中英对照)

| 术语          | 英文 / 标识符           | 含义                                  |
| ------------- | ----------------------- | ------------------------------------- |
| 蜡烛 / K 线   | `Candle` / `KLineData`  | 一个周期的开/高/低/收图形             |
| 阳线 / 阴线   | up / down               | 收盘高于/低于开盘(A 股:红/绿)         |
| 均线          | `movingAverage` / MA    | 过去 N 天收盘均价(MA5/MA10/MA30)      |
| 成交量 / 量柱 | `VolumeBars`            | 一段时间成交的股数                    |
| 放量 / 缩量   | —                       | 量柱变高 / 变矮(与涨跌无关)           |
| 换手率 / 量比 | turnover / volume ratio | 相对活跃度指标                        |
| 盘口 / 五档   | `OrderBook`             | 未成交的挂单排队(卖五~买五)           |
| 主力 / 散户   | money flow              | 按单笔金额分档的资金(特大+大 / 中+小) |
| 讲解图        | `Diagram`               | 单个概念的 SVG 图组件                 |

---

# 评审自查清单(收尾前对照)

- [ ] 改动小而内聚,没有夹带无关重构
- [ ] 命名、风格与周边代码一致
- [ ] 没有违反 AGENTS.md 的红线(红涨绿跌 / CSS 变量取色 / 确定性数据 / 文案精简)
- [ ] 涉及文件的 AI 文件头已更新
- [ ] 对应 `docs/modules/diagrams/`(或专题 `docs/topics/`)已同步;决策性改动已补 ADR
- [ ] 已在浏览器 6006 端口真跑验证(含暗色)
- [ ] `node scripts/check-docs.mjs` 无 ❌,`pnpm build` 通过
