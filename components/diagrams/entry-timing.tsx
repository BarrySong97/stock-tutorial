/**
 * @purpose 买卖点图:平台突破 + 回踩确认(买点),对照假突破的概念。
 * @role    diagrams 模块单图,买卖点节使用。
 * @deps    ./primitives、./series
 * @gotcha  概念级形态,非买卖信号;配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { ArrowMarker, Diagram, DiagramLabel } from "./primitives";
import {
  buildBars,
  CandleSeries,
  centerX,
  makeScale,
  type SeriesLayout,
} from "./series";

// 平台横盘 → 放量突破 → 回踩不破平台上沿 → 继续上行。
const closes = [
  50, 49.5, 50.2, 49.8, 50.1, 50, 49.7, 50.3, 52, 53.5, 53, 52, 51.2, 52.6, 54,
  55.5, 57, 58,
];
const bars = buildBars(closes);
const layout: SeriesLayout = { left: 30, right: 500, count: closes.length };
const AXIS_X = 508;
const PLATFORM = 50.7;

const BREAKOUT = 8; // 突破那根
const PULLBACK = 12; // 回踩确认那根(买点)

export function EntryTimingDiagram() {
  const priceToY = makeScale(
    [...bars.map((b) => b.high), ...bars.map((b) => b.low)],
    58,
    212,
  );
  const py = priceToY(PLATFORM);

  return (
    <Diagram height={252} label="平台突破与回踩确认的买点示意">
      <line
        stroke="var(--muted)"
        strokeDasharray="6 5"
        strokeWidth={1.5}
        x1={layout.left}
        x2={layout.right}
        y1={py}
        y2={py}
      />
      <DiagramLabel
        anchor="start"
        size="xs"
        tone="muted"
        weight={400}
        x={layout.left}
        y={py - 8}
      >
        平台上沿(压力)
      </DiagramLabel>

      <CandleSeries bars={bars} layout={layout} priceToY={priceToY} />

      {/* 突破 */}
      <ArrowMarker
        direction="up"
        tone="up"
        x={centerX(layout, BREAKOUT)}
        y={priceToY(bars[BREAKOUT].high) - 12}
      />
      <DiagramLabel
        size="xs"
        tone="up"
        x={centerX(layout, BREAKOUT)}
        y={priceToY(bars[BREAKOUT].high) - 18}
      >
        突破
      </DiagramLabel>

      {/* 回踩确认 = 买点 */}
      <circle
        cx={centerX(layout, PULLBACK)}
        cy={priceToY(bars[PULLBACK].low) + 12}
        fill="var(--stock-up)"
        r={5}
      />
      <DiagramLabel
        size="xs"
        tone="up"
        weight={700}
        x={centerX(layout, PULLBACK)}
        y={priceToY(bars[PULLBACK].low) + 30}
      >
        回踩确认·买点
      </DiagramLabel>

      <DiagramLabel
        anchor="middle"
        size="xs"
        tone="muted"
        weight={400}
        x={280}
        y={238}
      >
        突破后回踩不跌破平台,是较稳的进场点;若很快跌回平台下方,就是假突破
      </DiagramLabel>
    </Diagram>
  );
}
