/**
 * @purpose 换手率活跃度标尺 + 量比放缩对照。
 * @role    diagrams 模块单图,换手率与量比节使用。
 * @deps    ./primitives
 * @gotcha  配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { ArrowMarker, Diagram, DiagramLabel, type DiagramTone } from "./primitives";

// 换手率 gauge: 0–10% mapped across the bar; open-ended top zone.
const GAUGE_LEFT = 40;
const GAUGE_RIGHT = 520;
const GAUGE_MAX = 10;
const gaugeX = (v: number) => GAUGE_LEFT + (v / GAUGE_MAX) * (GAUGE_RIGHT - GAUGE_LEFT);

const zones: Array<{ from: number; to: number; word: string; range: string; tone: DiagramTone; fill: string }> = [
  { from: 0, to: 1, word: "冷清", range: "<1%", tone: "muted", fill: "var(--surface-secondary)" },
  { from: 1, to: 3, word: "温和", range: "1–3%", tone: "default", fill: "var(--surface-tertiary)" },
  { from: 3, to: 7, word: "活跃", range: "3–7%", tone: "line1", fill: "color-mix(in oklab, var(--chart-line-1) 25%, transparent)" },
  { from: 7, to: 10, word: "过热", range: ">7%", tone: "up", fill: "color-mix(in oklab, var(--stock-up) 25%, transparent)" },
];

const EXAMPLE = 2.8;
const GAUGE_Y = 58;
const GAUGE_H = 16;

// 量比 comparison bars.
const BASE_Y = 272;
const FIVE_DAY_H = 66;
const RATIO = 1.35;

export function TurnoverGaugeDiagram() {
  return (
    <Diagram height={300} label="换手率的活跃度分档，以及量比的放缩对照">
      {/* ---- 换手率 gauge ---- */}
      <DiagramLabel anchor="start" size="md" weight={700} x={30} y={26}>
        换手率
      </DiagramLabel>
      <DiagramLabel anchor="start" size="xs" tone="muted" weight={400} x={104} y={26}>
        = 成交量 ÷ 流通股本（今天有多少流通筹码换了手）
      </DiagramLabel>

      {zones.map((z) => (
        <g key={z.word}>
          <rect
            fill={z.fill}
            height={GAUGE_H}
            width={gaugeX(z.to) - gaugeX(z.from)}
            x={gaugeX(z.from)}
            y={GAUGE_Y}
          />
          <DiagramLabel size="sm" tone={z.tone} weight={600} x={(gaugeX(z.from) + gaugeX(z.to)) / 2} y={GAUGE_Y + 40}>
            {z.word}
          </DiagramLabel>
          <DiagramLabel size="xs" tone="muted" weight={400} x={(gaugeX(z.from) + gaugeX(z.to)) / 2} y={GAUGE_Y + 56}>
            {z.range}
          </DiagramLabel>
        </g>
      ))}

      {/* example cursor */}
      <ArrowMarker direction="down" tone="default" x={gaugeX(EXAMPLE)} y={GAUGE_Y - 8} />
      <DiagramLabel size="xs" x={gaugeX(EXAMPLE)} y={GAUGE_Y - 14}>
        本例 2.8%
      </DiagramLabel>

      {/* ---- 量比 ---- */}
      <line stroke="var(--border)" strokeWidth={1} x1={30} x2={530} y1={150} y2={150} />
      <DiagramLabel anchor="start" size="md" weight={700} x={30} y={176}>
        量比
      </DiagramLabel>
      <DiagramLabel anchor="start" size="xs" tone="muted" weight={400} x={90} y={176}>
        = 今日每分钟均量 ÷ 近 5 日每分钟均量
      </DiagramLabel>

      {/* baseline reference at 量比 = 1 */}
      <line
        stroke="var(--muted)"
        strokeDasharray="5 4"
        strokeWidth={1}
        x1={150}
        x2={430}
        y1={BASE_Y - FIVE_DAY_H}
        y2={BASE_Y - FIVE_DAY_H}
      />
      <DiagramLabel anchor="end" size="xs" tone="muted" weight={400} x={146} y={BASE_Y - FIVE_DAY_H + 3}>
        量比 = 1 基准
      </DiagramLabel>

      {/* 5-day average bar */}
      <rect fill="var(--surface-tertiary)" height={FIVE_DAY_H} width={72} x={188} y={BASE_Y - FIVE_DAY_H} />
      <DiagramLabel size="xs" tone="muted" weight={400} x={224} y={BASE_Y + 18}>
        近 5 日均量
      </DiagramLabel>

      {/* today's bar, taller by RATIO */}
      <rect fill="var(--stock-up)" height={FIVE_DAY_H * RATIO} width={72} x={340} y={BASE_Y - FIVE_DAY_H * RATIO} />
      <DiagramLabel size="xs" tone="up" x={376} y={BASE_Y - FIVE_DAY_H * RATIO - 8}>
        量比 1.35
      </DiagramLabel>
      <DiagramLabel size="xs" tone="muted" weight={400} x={376} y={BASE_Y + 18}>
        今日均量
      </DiagramLabel>

      <line stroke="var(--muted)" strokeWidth={1} x1={150} x2={430} y1={BASE_Y} y2={BASE_Y} />
      <DiagramLabel anchor="start" size="xs" tone="muted" weight={400} x={30} y={BASE_Y - 4}>
        {">1 放量　<1 缩量"}
      </DiagramLabel>
    </Diagram>
  );
}
