/**
 * @purpose 通过 next/font 加载 Latin 字体(Inter/Fira Code),暴露 CSS 变量。
 * @role    配置;layout 引入变量,CJK 由系统字体兜底。
 * @deps    next/font/google
 * @gotcha  不加载 CJK web 字体。见 docs/decisions/0002-system-cjk-fonts.md
 */
import { Fira_Code as FontMono, Inter as FontLatin } from "next/font/google";

// Inter only covers Latin glyphs; CJK characters fall back to the system
// stack composed in styles/globals.css (`--font-sans`) since a web-hosted
// CJK font (e.g. Noto Sans SC) would add several MB to every page load.
export const fontSans = FontLatin({
  subsets: ["latin"],
  variable: "--font-latin",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});
