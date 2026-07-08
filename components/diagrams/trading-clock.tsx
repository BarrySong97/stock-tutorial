/**
 * @purpose 交易日时段时间轴:集合竞价/连续竞价/午休/不可撤单窗口。
 * @role    diagrams 模块单图,交易规则速查节使用。
 * @deps    ./primitives
 * @gotcha  时间轴为示意非等比;配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { Diagram, DiagramLabel } from "./primitives";

// Schematic (not to scale) so every phase is readable.
const BAR_Y = 96;
const BAR_H = 34;

interface Phase {
  x1: number;
  x2: number;
  name: string;
  time: string;
  fill: string;
}

const phases: Phase[] = [
  { x1: 40, x2: 136, name: "集合竞价", time: "9:15–9:25", fill: "color-mix(in oklab, var(--chart-line-1) 22%, transparent)" },
  { x1: 136, x2: 268, name: "连续竞价·上午", time: "9:30–11:30", fill: "var(--surface-tertiary)" },
  { x1: 268, x2: 338, name: "午休", time: "11:30–13:00", fill: "var(--surface-secondary)" },
  { x1: 338, x2: 470, name: "连续竞价·下午", time: "13:00–14:57", fill: "var(--surface-tertiary)" },
  { x1: 470, x2: 520, name: "尾盘竞价", time: "14:57–15:00", fill: "color-mix(in oklab, var(--chart-line-1) 22%, transparent)" },
];

// Within the open auction, 9:20–9:25 can't be cancelled — highlight it.
const NO_CANCEL_X1 = 88;
const NO_CANCEL_X2 = 136;

export function TradingClockDiagram() {
  return (
    <Diagram height={196} label="A股一个交易日的时段：集合竞价、连续竞价、午休、尾盘竞价">
      <DiagramLabel anchor="start" size="md" weight={700} x={30} y={26}>
        一个交易日（沪深）
      </DiagramLabel>

      {/* phase names above the bar */}
      {phases.map((p) => (
        <DiagramLabel key={p.name} size="xs" x={(p.x1 + p.x2) / 2} y={84}>
          {p.name}
        </DiagramLabel>
      ))}

      {/* the bar */}
      {phases.map((p) => (
        <rect key={p.name} fill={p.fill} height={BAR_H} width={p.x2 - p.x1} x={p.x1} y={BAR_Y} />
      ))}

      {/* no-cancel window inside the open auction */}
      <rect
        fill="color-mix(in oklab, var(--stock-up) 30%, transparent)"
        height={BAR_H}
        width={NO_CANCEL_X2 - NO_CANCEL_X1}
        x={NO_CANCEL_X1}
        y={BAR_Y}
      />
      <DiagramLabel size="xs" tone="up" weight={400} x={(NO_CANCEL_X1 + NO_CANCEL_X2) / 2} y={BAR_Y + 20}>
        不可撤
      </DiagramLabel>
      <DiagramLabel size="xs" tone="muted" weight={400} x={64} y={BAR_Y + 20}>
        可撤
      </DiagramLabel>

      {/* time ranges below */}
      {phases.map((p) => (
        <DiagramLabel key={p.name} size="xs" tone="muted" weight={400} x={(p.x1 + p.x2) / 2} y={BAR_Y + 52}>
          {p.time}
        </DiagramLabel>
      ))}

      <DiagramLabel anchor="start" size="xs" tone="muted" weight={400} x={30} y={188}>
        集合竞价 9:20–9:25 挂的单不能撤；连续竞价时段才是买卖实时撮合。
      </DiagramLabel>
    </Diagram>
  );
}
