#!/usr/bin/env bash
# @purpose 命令行创建 Cloudflare Pages「Git 集成」项目(push 自动构建),替代控制台点选。
# @role    一次性 bootstrap 脚本;用 Cloudflare REST API 建带 github source + build_config 的项目。
# 用法:
#   前提①:先在浏览器把 Cloudflare 的 GitHub App 授权安装到目标仓库(OAuth 握手,CLI 做不了)。
#          Cloudflare 控制台 → Workers & Pages → Create → Pages → Connect to Git → 授权 GitHub 一次即可(不用建项目,授权完退出)。
#   前提②:准备 API Token(权限含 Pages 写)和 Account ID。
#   运行:  CLOUDFLARE_API_TOKEN=xxx CLOUDFLARE_ACCOUNT_ID=xxx bash scripts/cf-setup.sh
#
# 成功后:每次 push 到 main,Cloudflare 自动 `pnpm build` 并发布 out/。详见 docs/topics/deployment.md
set -euo pipefail

: "${CLOUDFLARE_API_TOKEN:?请先设置 CLOUDFLARE_API_TOKEN 环境变量}"
: "${CLOUDFLARE_ACCOUNT_ID:?请先设置 CLOUDFLARE_ACCOUNT_ID 环境变量}"

PROJECT_NAME="${PROJECT_NAME:-stock-tutorial}"
GH_OWNER="${GH_OWNER:-BarrySong97}"
GH_REPO="${GH_REPO:-stock-tutorial}"
PROD_BRANCH="${PROD_BRANCH:-main}"

curl -fsS -X POST \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data @- <<JSON | (command -v jq >/dev/null && jq '.success, .errors, .result.subdomain' || cat)
{
  "name": "${PROJECT_NAME}",
  "production_branch": "${PROD_BRANCH}",
  "source": {
    "type": "github",
    "config": {
      "owner": "${GH_OWNER}",
      "repo_name": "${GH_REPO}",
      "production_branch": "${PROD_BRANCH}",
      "deployments_enabled": true,
      "production_deployments_enabled": true
    }
  },
  "build_config": {
    "build_command": "pnpm build",
    "destination_dir": "out",
    "root_dir": ""
  }
}
JSON

echo
echo "✅ 若上面 success=true,项目已创建并连上 GitHub。接下来 push 到 ${PROD_BRANCH} 即自动构建部署。"
echo "   若报仓库无法访问,多半是前提①的 GitHub App 还没授权到该仓库。"
