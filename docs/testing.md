# 测试 & 验证策略

## 原则

- **真跑验证**:本站没有单元测试,验证 = 把页面在浏览器里真打开、逐图看。不要只读代码就收工。
- **确定性优先**:图内数据用种子伪随机(见 [modules/diagrams/](modules/diagrams/)),保证每次渲染一致、可对照。
- **完成闸门**:`node scripts/check-docs.mjs`(文档同步)+ `pnpm build`(编译 + TS 类型检查)是收尾必过的两关;Stop hook 会自动跑 `check-docs --hook`。

## 测什么

- **编译/类型**:`pnpm build`——Next 构建阶段跑 TypeScript,类型错即失败。
- **视觉/交互**(核心):每张改动过的图——文字无重叠、跨图字号一致、配色与页面 token 一致;TOC 高亮与锚点滚动;**暗色模式**下颜色跟随切换。
- **hydration**:图内若用随机数据,确认服务端/客户端一致(种子伪随机,禁 `Math.random`/`Date.now`)。

## 按应用类型选 E2E 工具

| 类型 | 工具                             | 要点                             |
| ---- | -------------------------------- | -------------------------------- |
| Web  | Claude-in-Chrome / agent-browser | 用截图 + 无障碍树看图,确定性验证 |

## 怎么跑

见 [run.md](run.md) 的「构建」节 + 本地起 `pnpm dev`(6006 端口)。

## 验证某个改动是否真生效

1. `pnpm build` 通过(编译 + 类型检查)。
2. `pnpm dev`,浏览器打开 `http://localhost:6006`,滚动到改动的章节逐图看。
3. 暗色抽查:给 `<html>` 加 `.dark` class(或系统切暗色),确认图表颜色跟随 CSS 变量切换、无写死 hex 残留。
4. `node scripts/check-docs.mjs` 无 ❌。
