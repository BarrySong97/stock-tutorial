/**
 * @purpose 图表容器:统一承载每节的 SVG 图 + 可选图例网格 + 图注。
 * @role    纯展示组件,被 page.tsx 每个章节调用。
 * @deps    无(纯展示)
 * @gotcha  无卡片背景/描边(融入米色底);图例与图注用细分隔线分区。
 */
import type { ReactNode } from "react";

export interface DiagramLegendItem {
  term: string;
  desc: string;
}

export interface DiagramFigureProps {
  svg: ReactNode;
  caption?: string;
  legend?: DiagramLegendItem[];
}

export function DiagramFigure({ svg, caption, legend }: DiagramFigureProps) {
  return (
    <figure className="my-12">
      <div className="flex justify-center py-4">{svg}</div>
      {legend && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 border-t border-border mt-6 pt-5">
          {legend.map((item) => (
            <div key={item.term}>
              <strong className="block text-[13px] text-foreground font-semibold mb-1">
                {item.term}
              </strong>
              <span className="block text-xs text-muted leading-relaxed">{item.desc}</span>
            </div>
          ))}
        </div>
      )}
      {caption && (
        <figcaption className="text-center text-xs text-muted border-t border-border mt-6 pt-4">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
