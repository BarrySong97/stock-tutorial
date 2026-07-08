# 专题:单页由 sections + TOC + 图 如何组合

## 这是什么 / 为什么单独成篇

整站只有一个页面(`app/page.tsx`),但它由三块跨文件协作拼成:章节数据、固定 TOC、每节一张图。改内容/加章节会同时牵动这三块,所以单独说明。

## 涉及的模块 / 文件

- `app/page.tsx` — 定义 `sections` 数组(每节:`id`/`title`/`paragraphs`/`list?`/`note?`/`rule?`/`figure`),并渲染整页。
- `components/toc.tsx` — 左侧固定 TOC(`Toc`),`tocItems` 由 `sections` 自动派生。
- `components/diagram-figure.tsx` — 每节图的容器(`DiagramFigure`:SVG + 可选图例网格 + 图注)。
- `components/diagrams/*` — 具体的图,见 [../modules/diagrams/](../modules/diagrams/)。

## 细节

1. **章节即数据**:`sections` 是唯一数据源,数组顺序 = 页面顺序 = TOC 顺序。`tocItems = sections.map(...)` 自动生成,**不要手维护两份**。
2. **每节结构**:标题(`<h2 id={section.id}>`)→ 段落 → 可选 list(术语/要点)→ 可选 note(旁注)/ rule(引用块)→ `<DiagramFigure>` 包一张图。
3. **TOC 联动**:`Toc` 用 `IntersectionObserver` 跟踪各 `h2#id` 的可见性,高亮当前章节。注意回调只报「变化项」,需自存可见性 map 再取最上面那个;窄屏(`<1240px`)整块隐藏。
4. **布局**:TOC `position: fixed` 脱离文档流(不占宽度),内容列 `max-w-[43.25rem]` 居中——两者互不影响。

## 注意事项

- **加一节** = 在 `sections` 里加一项 + 配一张图(见 diagrams 模块的「新增一张图」)。TOC 会自动多一条,无需改 `toc.tsx`。
- **文案精简是红线**:每节正文 1–2 短段,细节交给 list 与图内标注(见 [AGENTS.md](../../AGENTS.md))。
- 锚点滚动依赖 `id` 与 `scroll-margin-top`(globals.css 里设),改 id 要同步。
