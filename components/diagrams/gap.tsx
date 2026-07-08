/**
 * @purpose 三类缺口(突破/持续/衰竭)在一段真实上涨序列中的位置。
 * @role    diagrams 模块单图,缺口节使用。
 * @deps    ./primitives、./series
 * @gotcha  配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { Diagram, DiagramLabel } from "./primitives";
import {
  CandleSeries,
  centerX,
  makeScale,
  type Ohlc,
  PriceGrid,
  type SeriesLayout,
} from "./series";

// Hand-authored so each candle opens above the previous high at the gaps:
// flat base → ① breakout gap → rise → ② runaway gap → rise → ③ exhaustion
// gap → stall and reversal.
const bars: Ohlc[] = [
  { open: 39.8, high: 40.6, low: 39.4, close: 40.2 },
  { open: 40.2, high: 40.9, low: 39.7, close: 40.5 },
  { open: 40.5, high: 41.0, low: 39.9, close: 40.1 },
  { open: 40.1, high: 40.8, low: 39.6, close: 40.4 },
  { open: 40.4, high: 41.2, low: 40.0, close: 40.8 },
  { open: 43.0, high: 44.6, low: 42.8, close: 44.2 },
  { open: 44.2, high: 45.4, low: 43.9, close: 45.0 },
  { open: 45.0, high: 45.8, low: 44.4, close: 44.7 },
  { open: 44.7, high: 46.4, low: 44.5, close: 46.0 },
  { open: 48.2, high: 49.8, low: 48.0, close: 49.4 },
  { open: 49.4, high: 50.6, low: 49.0, close: 50.2 },
  { open: 50.2, high: 51.0, low: 49.6, close: 49.9 },
  { open: 49.9, high: 51.8, low: 49.7, close: 51.4 },
  { open: 53.6, high: 55.0, low: 53.4, close: 54.6 },
  { open: 54.6, high: 55.6, low: 54.0, close: 54.2 },
  { open: 54.2, high: 55.4, low: 53.0, close: 53.4 },
  { open: 53.4, high: 53.8, low: 51.6, close: 51.9 },
  { open: 51.9, high: 52.4, low: 50.6, close: 50.9 },
];

const layout: SeriesLayout = { left: 30, right: 500, count: bars.length };
const AXIS_X = 508;

// Each gap: the empty price band between one bar's high and the next bar's low.
const gaps = [
  { after: 4, label: "① 突破缺口", note: "横盘后跳空，可能是启动" },
  { after: 8, label: "② 持续缺口", note: "上涨中再跳空，趋势加速" },
  { after: 12, label: "③ 衰竭缺口", note: "大涨后再跳空，随后冲高回落" },
];

export function GapDiagram() {
  const priceToY = makeScale(
    [...bars.map((b) => b.high), ...bars.map((b) => b.low)],
    56,
    240,
  );

  return (
    <Diagram height={272} label="突破缺口、持续缺口、衰竭缺口在一段上涨中的位置">
      <PriceGrid layout={layout} priceToY={priceToY} ticks={[42, 48, 54]} labelX={AXIS_X} />

      {gaps.map((gap) => {
        const prev = bars[gap.after];
        const next = bars[gap.after + 1];
        const x1 = centerX(layout, gap.after) - 6;
        const x2 = centerX(layout, gap.after + 1) + 6;
        const yTop = priceToY(next.low);
        const yBottom = priceToY(prev.high);

        return (
          <rect
            key={gap.label}
            fill="var(--stock-up-soft)"
            height={yBottom - yTop}
            stroke="var(--stock-up)"
            strokeDasharray="3 3"
            strokeWidth={1}
            width={x2 - x1}
            x={x1}
            y={yTop}
          />
        );
      })}

      <CandleSeries bars={bars} layout={layout} priceToY={priceToY} />

      {/* callouts, placed clockwise so they never sit on candles */}
      <DiagramLabel size="xs" tone="up" x={118} y={168}>
        ① 突破缺口
      </DiagramLabel>
      <DiagramLabel size="xs" tone="muted" weight={400} x={118} y={184}>
        横盘后跳空启动
      </DiagramLabel>

      <DiagramLabel size="xs" tone="up" x={218} y={112}>
        ② 持续缺口
      </DiagramLabel>
      <DiagramLabel size="xs" tone="muted" weight={400} x={218} y={128}>
        趋势中段加速
      </DiagramLabel>

      <DiagramLabel anchor="end" size="xs" tone="up" x={340} y={70}>
        ③ 衰竭缺口
      </DiagramLabel>
      <DiagramLabel anchor="end" size="xs" tone="muted" weight={400} x={340} y={86}>
        高位跳空后冲高回落
      </DiagramLabel>
    </Diagram>
  );
}
