/**
 * @purpose 站点元信息(名称、描述)。
 * @role    配置常量,被 layout metadata 使用。
 * @deps    无
 * @gotcha  纯数据。
 */
export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "股票基础知识科普",
  description: "面向新手的股票基础知识科普文档站。",
};
