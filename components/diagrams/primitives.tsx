/**
 * @purpose 图表共享原子:统一 560 视口的 Diagram 外壳、Candle、GuideLine、DiagramLabel、ChartGrid、ArrowMarker、色板 tone。
 * @role    diagrams 模块的底层构件,被各图表复用。
 * @deps    react;CSS 变量(styles/globals.css 图表 token)
 * @gotcha  颜色走 var(--*) 自动跟随暗色;字号档 xs=11/sm=13/md=15。见 docs/modules/diagrams/README.md
 */
import type { ReactNode } from "react";

/*
 * Shared SVG building blocks for the lesson diagrams. Every diagram renders
 * inside a viewBox that is DIAGRAM_WIDTH units wide and is capped at the same
 * CSS width, so 1 SVG unit ≈ 1px and text sizes stay consistent across
 * diagrams instead of scaling with each diagram's own viewBox.
 * Colors reference the theme tokens in styles/globals.css so the diagrams
 * follow light/dark mode automatically.
 */

export const DIAGRAM_WIDTH = 560;

const tones = {
  default: "var(--foreground)",
  muted: "var(--muted)",
  up: "var(--stock-up)",
  down: "var(--stock-down)",
  line1: "var(--chart-line-1)",
  line2: "var(--chart-line-2)",
  line3: "var(--chart-line-3)",
} as const;

export type DiagramTone = keyof typeof tones;

export function diagramColor(tone: DiagramTone): string {
  return tones[tone];
}

export interface DiagramProps {
  label: string;
  height: number;
  children: ReactNode;
}

export function Diagram({ label, height, children }: DiagramProps) {
  return (
    <svg
      aria-label={label}
      className="w-full max-w-[560px]"
      role="img"
      viewBox={`0 0 ${DIAGRAM_WIDTH} ${height}`}
    >
      {children}
    </svg>
  );
}

export interface CandleProps {
  x: number;
  wickTop: number;
  wickBottom: number;
  bodyTop: number;
  bodyBottom: number;
  direction: "up" | "down";
  width?: number;
  strokeWidth?: number;
}

export function Candle({
  x,
  wickTop,
  wickBottom,
  bodyTop,
  bodyBottom,
  direction,
  width = 48,
  strokeWidth = 4,
}: CandleProps) {
  const stroke = direction === "up" ? tones.up : tones.down;
  const fill =
    direction === "up" ? "var(--stock-up-soft)" : "var(--stock-down-soft)";

  return (
    <g>
      <line
        stroke={stroke}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        x1={x}
        x2={x}
        y1={wickTop}
        y2={wickBottom}
      />
      <rect
        fill={fill}
        height={bodyBottom - bodyTop}
        rx={3}
        stroke={stroke}
        strokeWidth={strokeWidth}
        width={width}
        x={x - width / 2}
        y={bodyTop}
      />
    </g>
  );
}

export interface GuideLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  tone?: DiagramTone;
  strokeWidth?: number;
}

export function GuideLine({
  x1,
  y1,
  x2,
  y2,
  tone = "muted",
  strokeWidth = 2,
}: GuideLineProps) {
  return (
    <line
      stroke={tones[tone]}
      strokeDasharray="6 6"
      strokeWidth={strokeWidth}
      x1={x1}
      x2={x2}
      y1={y1}
      y2={y2}
    />
  );
}

const labelSizes = { xs: 11, sm: 13, md: 15 } as const;

export interface DiagramLabelProps {
  x: number;
  y: number;
  children: ReactNode;
  tone?: DiagramTone;
  size?: "xs" | "sm" | "md";
  weight?: number;
  anchor?: "start" | "middle" | "end";
}

export function DiagramLabel({
  x,
  y,
  children,
  tone = "default",
  size = "sm",
  weight = 600,
  anchor = "middle",
}: DiagramLabelProps) {
  return (
    <text
      fill={tones[tone]}
      fontSize={labelSizes[size]}
      fontWeight={weight}
      textAnchor={anchor}
      x={x}
      y={y}
    >
      {children}
    </text>
  );
}

/** Faint dashed horizontal grid lines, the backdrop every real chart has. */
export function ChartGrid({
  x1,
  x2,
  ys,
}: {
  x1: number;
  x2: number;
  ys: number[];
}) {
  return (
    <g>
      {ys.map((y) => (
        <line
          key={y}
          stroke="var(--border)"
          strokeDasharray="4 4"
          strokeWidth={1}
          x1={x1}
          x2={x2}
          y1={y}
          y2={y}
        />
      ))}
    </g>
  );
}

/** Small triangle marker, e.g. pointing at where price touches a level. */
export function ArrowMarker({
  x,
  y,
  direction,
  tone,
}: {
  x: number;
  y: number;
  direction: "up" | "down";
  tone: DiagramTone;
}) {
  const d =
    direction === "down"
      ? `M ${x - 5} ${y} L ${x + 5} ${y} L ${x} ${y + 7} Z`
      : `M ${x - 5} ${y} L ${x + 5} ${y} L ${x} ${y - 7} Z`;

  return <path d={d} fill={tones[tone]} />;
}
