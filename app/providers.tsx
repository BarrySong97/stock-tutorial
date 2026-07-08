/**
 * @purpose 客户端 Provider 包装:接入 next-themes 主题切换。
 * @role    客户端组件,layout 里包裹 children。
 * @deps    next-themes
 * @gotcha  必须是 client 组件("use client");当前默认 light。
 */
"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>;
}
