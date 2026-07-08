/**
 * @purpose 左侧固定目录(TOC):IntersectionObserver 跟踪滚动、高亮当前章节。
 * @role    客户端组件,page.tsx 传入 items 渲染。
 * @deps    react
 * @gotcha  IO 回调只报变化项,需自存可见性 map 取最上项;窄屏(<1240px)隐藏。见 docs/topics/page-structure.md
 */
"use client";

import { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  title: string;
  level: 2 | 3;
}

export interface TocProps {
  items: TocItem[];
}

export function Toc({ items }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    // IntersectionObserver callbacks only report entries whose state just
    // changed, not the full current state — so visibility has to be tracked
    // across calls to know which heading is topmost among those still
    // intersecting the "active" band near the top of the viewport.
    const isVisible = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible.set(entry.target.id, entry.isIntersecting);
        });

        const topVisible = items.find((item) => isVisible.get(item.id));

        if (topVisible) {
          setActiveId(topVisible.id);
        }
      },
      { rootMargin: "0px 0px -66% 0px", threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="hidden min-[1240px]:block fixed left-0 top-12 w-64 pl-12 pr-4 text-xs">
      <nav aria-label="Table of contents" className="flex flex-col gap-1">
        {items.map((item) => (
          <a
            key={item.id}
            className="toc-link text-left leading-tight py-0.5 text-foreground"
            data-active={activeId === item.id}
            href={`#${item.id}`}
            style={item.level === 3 ? { paddingLeft: "0.75rem" } : undefined}
          >
            {item.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}
