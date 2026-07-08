/**
 * @purpose 根布局:挂载全局样式与字体变量、包裹主题 Provider,设中文 lang 与暖色主题。
 * @role    App Router 根 layout(服务端组件),包裹所有页面。
 * @deps    @/styles/globals.css、@/config/fonts、@/config/site、./providers
 * @gotcha  默认 light 主题;字体走 CSS 变量 + 系统中文兜底。见 design.md
 */
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffcf1" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1310" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="zh-CN">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
