# 股票基础知识科普 — 设计系统

> 权威来源是 [styles/globals.css](styles/globals.css)(定义所有 CSS 变量 token)。本文件是导航与约定,数值以 globals.css 为准。HeroUI v3 通过 `@theme inline` 把这些语义变量接到 Tailwind 工具类(`bg-background` / `text-foreground` 等)。

## 设计 Token(全部在 globals.css,亮/暗双套)

- **色彩(语义)**:`--background` `--foreground` `--surface(-secondary/-tertiary)` `--muted` `--accent` `--border` `--separator`
- **A 股涨跌色(内容色,非装饰)**:`--stock-up` 红(涨/阳)、`--stock-down` 绿(跌/阴),各带 `-soft` 浅底。**红涨绿跌是红线**,见 [AGENTS.md](AGENTS.md)。
- **图表辅助线**:`--chart-line-1` 琥珀(MA5 / 均价)、`--chart-line-2` 蓝(MA10)、`--chart-line-3` 紫(MA30)
- **字体**:`--font-sans` = Inter(Latin,next/font)+ 系统中文栈(苹方/微软雅黑)兜底;`--font-mono` = Fira Code。CJK 不走 web 字体,见 [docs/decisions/0002-system-cjk-fonts.md](docs/decisions/0002-system-cjk-fonts.md)。
- **暖纸底色调**:亮色背景 `#f7f7f4`、文字 `#181816`;暗色背景 `#18181a`、文字 `#f2f2ee`。

## 正文排版(`.typography-prose`,在 globals.css 覆盖 HeroUI 默认)

- h2 `1.375rem/600`、h3 `1.125rem/600`、正文 `p`/`li` `0.9375rem` + `line-height: 1.85`(中文比英文更需要行距呼吸)。
- 标题去掉 HeroUI 的 `tracking-tight`(负字距会挤压中文)。
- `text-autospace: normal` 渐进增强(中西文之间自动留白)。

## 布局

- 单页:左侧 **固定 TOC**(`position: fixed`,不占布局宽度,窄屏 `<1240px` 隐藏)+ 中间内容列 **居中**(`max-w-[43.25rem]`)。见 [docs/topics/page-structure.md](docs/topics/page-structure.md)。
- 响应式:图表用相对宽度(`w-full max-w-[560px]`),窄屏自适应。

## 图表(SVG)约定

- 统一坐标系:每张图 viewBox 宽 **560 单位**,渲染宽度也封顶 560px → 1 单位 ≈ 1px,**跨图文字大小一致**。
- 文字字号档:`xs=11 / sm=13 / md=15`(`DiagramLabel` 的 `size`)。
- 颜色一律 `var(--*)`,自动跟随暗色。详见 [docs/modules/diagrams/README.md](docs/modules/diagrams/README.md)。

## 无障碍(a11y)

- 每张图 `<svg role="img" aria-label="...">` 描述图意。
- 涨跌不仅靠颜色:图内配文字标注(阳线/阴线、放量/缩量等),色盲也能读。
- 亮/暗两套色都保证正文与背景的对比度。
