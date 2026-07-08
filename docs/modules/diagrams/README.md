# diagrams — 讲解图原子系统

## 职责

`components/diagrams/` 把每个股票概念画成一张 SVG「讲解图」。整个目录是一套原子系统:底层是共享构件,上层是一张图一个文件。管什么:概念的可视化呈现;不管什么:章节文字/页面布局(那在 `app/page.tsx` 与 `components/`)。

## 文件清单与关系

- `primitives.tsx` — 底层原子:`Diagram`(560 单位统一视口的 svg 外壳)、`Candle`、`GuideLine`、`DiagramLabel`(字号档 xs/sm/md)、`ChartGrid`、`ArrowMarker`、色板 `tones`/`diagramColor`。
- `series.tsx` — 蜡烛序列层:`buildBars`(收盘价→OHLC,open=上一根 close)、`movingAverage` + `MALine`、`makeScale`(价格→像素)、`CandleSeries`、`VolumeBars`、`PriceGrid`、`LastPriceMark`。
- 单张图(各一个文件,由 `index.ts` 桶导出):
  - 纯 `primitives`:`quote-panel` `kline-anatomy` `yin-yang` `turnover-gauge` `order-book` `money-flow` `levels` `trading-clock`
  - 用 `series`(真实蜡烛序列):`timeshare` `volume` `moving-average` `support-resistance` `trend` `gap`
- 调用关系:`page.tsx → index.ts → 各图 → series/primitives → CSS 变量`。

## 数据流

图内数据是**硬编码或种子伪随机生成的静态常量**(模块顶层),渲染成纯 SVG。无 props 输入业务数据(个别图如 `KLineChart` 例外,但那是备用组件、未上页)。全站共用一只虚拟股(现价 40.20 / 昨收 39.10)。

## 对外接口

- 每张图导出一个无参组件(如 `export function VolumeDiagram()`),在 `index.ts` 登记。
- `page.tsx` 对应章节的 `figure.svg` 里实例化,外面包 `components/diagram-figure.tsx`(容器 + 图例 + 图注)。

## 注意事项

- **颜色只走 CSS 变量**:红涨绿跌 `var(--stock-up)`/`var(--stock-down)`,中性 `var(--foreground)`/`var(--muted)`/`var(--border)`,均线 `var(--chart-line-1..3)`。禁写死 hex,否则暗色失效(红线)。
- **统一视口 560**:所有图 viewBox 宽 560、渲染封顶 560px,保证跨图文字大小一致。新图沿用 `Diagram` 外壳,别自定义 viewBox 比例。
- **确定性数据**:序列/路径用种子伪随机(如 `timeshare.tsx` 的 seeded PRNG),**禁 `Math.random()`/`Date.now()`**——否则 SSR 与客户端不一致(hydration mismatch)。
- **新增一张图**:建 `components/diagrams/<name>.tsx`(加文件头)→ 在 `index.ts` 导出 → 在 `page.tsx` 章节引用 → 更新本文档文件清单。
