/**
 * @purpose 财报与业绩图:每股收益逐季增长带动股价上台阶,业绩暴雷则跳水。
 * @role    diagrams 模块单图,财报与业绩节使用。
 * @deps    ./primitives
 * @gotcha  上行段红、暴雷段绿;配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { Diagram, DiagramLabel } from "./primitives";

const quarters = [
  { x: 90, eps: 36, label: "①" },
  { x: 190, eps: 50, label: "②" },
  { x: 290, eps: 64, label: "③" },
  { x: 390, eps: 82, label: "④" },
  { x: 490, eps: 26, label: "暴雷" },
];
const BASE_Y = 252;
const BAR_W = 42;

export function FundamentalsDiagram() {
  return (
    <Diagram height={272} label="业绩逐季增长带动股价上台阶,业绩暴雷则跳水">
      {/* 股价:业绩驱动上行(红) */}
      <path
        d="M90 158 L190 130 L290 102 L390 74"
        fill="none"
        stroke="var(--stock-up)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
      />
      {/* 暴雷跳水(绿) */}
      <path
        d="M390 74 L490 152"
        fill="none"
        stroke="var(--stock-down)"
        strokeLinecap="round"
        strokeWidth={3}
      />
      {[158, 130, 102, 74].map((y, i) => (
        <circle
          key={i}
          cx={quarters[i].x}
          cy={y}
          fill="var(--stock-up)"
          r={4}
        />
      ))}
      <circle cx={490} cy={152} fill="var(--stock-down)" r={4} />

      <DiagramLabel anchor="start" size="xs" tone="up" x={116} y={112}>
        业绩增长 → 股价上台阶
      </DiagramLabel>
      <DiagramLabel
        anchor="end"
        size="xs"
        tone="down"
        weight={700}
        x={484}
        y={140}
      >
        暴雷 → 跳水
      </DiagramLabel>

      {/* 每股收益柱 */}
      <line
        stroke="var(--border)"
        strokeWidth={1}
        x1={40}
        x2={520}
        y1={182}
        y2={182}
      />
      <DiagramLabel
        anchor="start"
        size="xs"
        tone="muted"
        weight={400}
        x={40}
        y={198}
      >
        每股收益(逐季)
      </DiagramLabel>
      {quarters.map((q, i) => (
        <g key={q.label}>
          <rect
            fill={
              i === 4
                ? "color-mix(in oklab, var(--stock-down) 45%, var(--background))"
                : "var(--surface-tertiary)"
            }
            height={q.eps}
            width={BAR_W}
            x={q.x - BAR_W / 2}
            y={BASE_Y - q.eps}
          />
          <DiagramLabel
            size="xs"
            tone={i === 4 ? "down" : "muted"}
            weight={400}
            x={q.x}
            y={BASE_Y + 16}
          >
            {q.label}
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
        y={20}
      >
        拉长看,股价跟着业绩走;财报季尤其要看盈利是增是减
      </DiagramLabel>
    </Diagram>
  );
}
