/**
 * @purpose 站点元信息(名称、标题、描述、SEO 关键词、站点 URL 与 OG 图)。
 * @role    配置常量,被 layout metadata 使用。
 * @deps    无
 * @gotcha  纯数据。url 为 Cloudflare Pages 域名,换自定义域名时改这里即可。
 */
export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "股票基础知识科普",
  // 用于 <title> 的完整标题(含核心关键词,利于搜索与分享展示)。
  title: "股票基础知识科普 | A股新手图解入门:K线、成交量、均线、盘口",
  description:
    "面向 A 股新手的图解科普站,用大量图表讲清 K 线、成交量、均线、盘口五档、主力资金、估值、仓位与风险、交易规则等基础概念。零基础也能看懂,配色遵循 A 股「红涨绿跌」习惯。",
  // 生产站点地址(Cloudflare Pages),用于 canonical / Open Graph / 站点地图。
  url: "https://stock-tutorial.pages.dev",
  // 社交分享封面(1200×630),放在 public/ 下。
  ogImage: "/og.png",
  keywords: [
    "股票基础知识",
    "A股入门",
    "新手炒股",
    "K线图解",
    "K线图怎么看",
    "成交量",
    "均线",
    "盘口五档",
    "主力资金",
    "市盈率",
    "市净率",
    "换手率",
    "量比",
    "打新股",
    "仓位管理",
    "风险管理",
    "股票科普",
  ],
};
