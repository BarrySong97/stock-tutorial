# 0002. 中文用系统字体,不引入 CJK web 字体

- 状态:已采纳
- 日期:2026-07-08

## 背景

站点是中文内容为主。最初想用 `next/font` 加载 Noto Sans SC 保证跨端一致,但:CJK web 字体分包体积达数 MB;且构建环境访问 `fonts.gstatic.com` 不稳定,`next/font` 在构建期拉取会失败。

## 决策

只用 `next/font` 加载 **Latin 字体(Inter)** 并暴露 CSS 变量;**中文交给系统字体栈兜底**(`--font-sans` 里接 `-apple-system`/`PingFang SC`/`Microsoft YaHei` 等)。等宽用 Fira Code。

## 理由

- 首屏零额外 CJK 字体负担,加载快。
- 不依赖构建期外网,构建稳定。
- macOS/iOS 苹方、Windows 雅黑渲染中文本就足够好,视觉损失小。
- 用户实测确认:中文排版的「不舒服」主因是英文调的排版参数(负字距、行高偏紧),而非字体本身——已在 `.typography-prose` 修正。

## 后果

- 不同操作系统中文字形会有差异(可接受)。
- 若将来要严格统一中文字形,需重新评估自托管 CJK 分包(`@fontsource` + `unicode-range`)的体积代价。
