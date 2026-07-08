#!/usr/bin/env node
/**
 * @purpose PostToolUse 质量回灌:改完文件后跑格式化/lint,把报错作为 additionalContext 喂回 agent 自纠。
 * @role    强制层 sensor(最快层,毫秒~秒);Claude / Codex 共用。
 * @deps    node 内置 + 项目自己的 lint/format 命令(在 LINT_CMD 填,用 {{FILE}} 占位)
 * @gotcha  按技术栈改 LINT_CMD;留空则不动(先靠 check-docs / pre-commit 兜底)。成功静默,只在有问题时回灌。
 */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

let payload = {};
try {
  payload = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {}
const file = payload?.tool_input?.file_path ?? "";
if (!file) process.exit(0);

// ⬇️ 本项目:只用 prettier 格式化单文件(快、稳)。
// 不接 eslint —— 现有 eslint.config.mjs 与 eslint-config-next 存在已知不兼容(pnpm lint 会报
// "Unexpected top-level property name"),接进来会每次编辑都噪音报错。详见 docs/run.md。
const LINT_CMD = 'npx prettier --write "{{FILE}}"';

if (!LINT_CMD) process.exit(0);
try {
  execSync(LINT_CMD.replaceAll("{{FILE}}", file), {
    stdio: ["ignore", "pipe", "pipe"],
  });
  process.exit(0); // 成功:静默
} catch (e) {
  const out = `${e.stdout ?? ""}${e.stderr ?? ""}`.trim();
  if (out) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext: `Lint/format 报告(${file}):\n${out}`,
        },
      }),
    );
  }
  process.exit(0);
}
