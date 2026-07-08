/**
 * @purpose 板块轮动图:资金在板块间轮流领涨,当前主线高亮 + 轮动箭头。
 * @role    diagrams 模块单图,板块轮动节使用。
 * @deps    ./primitives
 * @gotcha  主线用红、其余中性;配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { Diagram, DiagramLabel } from "./primitives";

const BASE_Y = 214;

interface Sector {
  x: number;
  label: string;
  height: number;
  fill: string;
  tag?: string;
  tagTone?: "up" | "muted";
}

const sectors: Sector[] = [
  {
    x: 110,
    label: "板块①",
    height: 66,
    fill: "var(--surface-tertiary)",
    tag: "已轮过",
    tagTone: "muted",
  },
  {
    x: 230,
    label: "板块②",
    height: 132,
    fill: "var(--stock-up)",
    tag: "当前主线",
    tagTone: "up",
  },
  {
    x: 350,
    label: "板块③",
    height: 56,
    fill: "color-mix(in oklab, var(--chart-line-1) 45%, var(--background))",
    tag: "轮动预期",
    tagTone: "muted",
  },
  { x: 470, label: "板块④", height: 38, fill: "var(--surface-tertiary)" },
];

const BAR_W = 64;

export function SectorRotationDiagram() {
  return (
    <Diagram height={260} label="资金在不同板块间轮动,当前主线最强">
      <DiagramLabel
        anchor="start"
        size="xs"
        tone="muted"
        weight={400}
        x={30}
        y={26}
      >
        柱子高矮 = 板块当前强弱;资金像走马灯一样在板块间轮流领涨
      </DiagramLabel>

      {/* 轮动箭头:① → ② → ③ */}
      <path
        d="M110 122 C150 92 190 90 226 76"
        fill="none"
        stroke="var(--muted)"
        strokeDasharray="5 4"
        strokeWidth={2}
      />
      <path
        d="M234 78 C280 92 316 120 348 150"
        fill="none"
        stroke="var(--muted)"
        strokeDasharray="5 4"
        strokeWidth={2}
      />
      <path d="M348 150 l-9 -3 l3 9 z" fill="var(--muted)" />
      <DiagramLabel size="xs" tone="muted" weight={400} x={300} y={104}>
        资金轮动
      </DiagramLabel>

      {sectors.map((s) => (
        <g key={s.label}>
          <rect
            fill={s.fill}
            height={s.height}
            rx={3}
            width={BAR_W}
            x={s.x - BAR_W / 2}
            y={BASE_Y - s.height}
          />
          {s.tag && (
            <DiagramLabel
              size="xs"
              tone={s.tagTone}
              weight={s.tagTone === "up" ? 700 : 400}
              x={s.x}
              y={BASE_Y - s.height - 8}
            >
              {s.tag}
            </DiagramLabel>
          )}
          <DiagramLabel
            size="sm"
            tone="muted"
            weight={400}
            x={s.x}
            y={BASE_Y + 20}
          >
            {s.label}
          </DiagramLabel>
        </g>
      ))}

      <line
        stroke="var(--muted)"
        strokeWidth={1}
        x1={40}
        x2={520}
        y1={BASE_Y}
        y2={BASE_Y}
      />

      <DiagramLabel
        anchor="middle"
        size="xs"
        tone="muted"
        weight={400}
        x={280}
        y={250}
      >
        结构性行情:很少所有板块一起涨,踏对当下主线比乱买更重要
      </DiagramLabel>
    </Diagram>
  );
}
