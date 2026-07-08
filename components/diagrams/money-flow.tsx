/**
 * @purpose 单笔金额分档 + 主力/散户净流入分叉柱。
 * @role    diagrams 模块单图,大单与主力资金节使用。
 * @deps    ./primitives
 * @gotcha  红=净流入、绿=净流出;配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { Diagram, DiagramLabel } from "./primitives";

// Single-trade size tiers (top of the diagram).
const tiers = [
  { name: "特大单", range: ">100万", fill: "var(--stock-up)" },
  { name: "大单", range: "20–100万", fill: "color-mix(in oklab, var(--stock-up) 60%, var(--background))" },
  { name: "中单", range: "4–20万", fill: "color-mix(in oklab, var(--stock-down) 60%, var(--background))" },
  { name: "小单", range: "<4万", fill: "var(--stock-down)" },
];

// Net inflow per category, in 万元 (positive = 净流入, negative = 净流出).
const flows = [
  { name: "特大单", value: 2800, y: 172 },
  { name: "大单", value: 1200, y: 210 },
  { name: "中单", value: -1500, y: 248 },
  { name: "小单", value: -2500, y: 286 },
];

const AXIS_X = 300;
const SCALE = 190 / 2800; // px per 万元
const fmt = (v: number) => `${v > 0 ? "+" : "−"}${Math.abs(v)}万`;

export function MoneyFlowDiagram() {
  return (
    <Diagram height={330} label="按单笔金额分档的资金，以及主力与散户的净流入对比">
      {/* ---- tiers ---- */}
      <DiagramLabel anchor="start" size="md" weight={700} x={30} y={24}>
        单笔金额分档
      </DiagramLabel>
      <DiagramLabel anchor="start" size="xs" tone="muted" weight={400} x={166} y={24}>
        各软件口径略有差异
      </DiagramLabel>
      {tiers.map((tier, i) => {
        const x = 40 + i * 126;

        return (
          <g key={tier.name}>
            <rect fill={tier.fill} height={14} rx={2} width={14} x={x} y={50} />
            <DiagramLabel anchor="start" size="sm" x={x + 20} y={62}>
              {tier.name}
            </DiagramLabel>
            <DiagramLabel anchor="start" size="xs" tone="muted" weight={400} x={x + 20} y={80}>
              {tier.range}
            </DiagramLabel>
          </g>
        );
      })}

      {/* ---- net inflow ---- */}
      <line stroke="var(--border)" strokeWidth={1} x1={30} x2={530} y1={104} y2={104} />
      <DiagramLabel anchor="start" size="md" weight={700} x={30} y={130}>
        当日各类资金净流入
      </DiagramLabel>

      {/* grouping bands */}
      <rect fill="var(--stock-up-soft)" height={72} width={500} x={30} y={155} />
      <rect fill="var(--stock-down-soft)" height={72} width={500} x={30} y={231} />
      <DiagramLabel anchor="end" size="sm" tone="up" weight={700} x={522} y={187}>
        主力
      </DiagramLabel>
      <DiagramLabel anchor="end" size="xs" tone="muted" weight={400} x={522} y={203}>
        特大 + 大单
      </DiagramLabel>
      <DiagramLabel anchor="end" size="sm" tone="down" weight={700} x={522} y={263}>
        散户
      </DiagramLabel>
      <DiagramLabel anchor="end" size="xs" tone="muted" weight={400} x={522} y={279}>
        中 + 小单
      </DiagramLabel>

      {/* zero axis */}
      <line stroke="var(--muted)" strokeWidth={1} x1={AXIS_X} x2={AXIS_X} y1={150} y2={318} />
      <DiagramLabel size="xs" tone="muted" weight={400} x={AXIS_X} y={146}>
        0
      </DiagramLabel>

      {flows.map((f) => {
        const len = Math.abs(f.value) * SCALE;
        const positive = f.value > 0;
        const barX = positive ? AXIS_X : AXIS_X - len;

        return (
          <g key={f.name}>
            <DiagramLabel anchor="start" size="sm" tone="muted" weight={400} x={40} y={f.y + 4}>
              {f.name}
            </DiagramLabel>
            <rect
              fill={positive ? "var(--stock-up)" : "var(--stock-down)"}
              height={16}
              width={len}
              x={barX}
              y={f.y - 8}
            />
            <DiagramLabel
              anchor={positive ? "start" : "end"}
              size="xs"
              tone={positive ? "up" : "down"}
              x={positive ? AXIS_X + len + 6 : AXIS_X - len - 6}
              y={f.y + 4}
            >
              {fmt(f.value)}
            </DiagramLabel>
          </g>
        );
      })}
    </Diagram>
  );
}
