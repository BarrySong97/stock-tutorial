/**
 * @purpose MA5/MA10/MA30 三条均线穿行价格蜡烛。
 * @role    diagrams 模块单图,均线节使用。
 * @deps    ./primitives、./series
 * @gotcha  短均线贴价快、长均线滞后;配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { Diagram, DiagramLabel } from "./primitives";
import {
  buildBars,
  CandleSeries,
  LastPriceMark,
  makeScale,
  MALine,
  movingAverage,
  PriceGrid,
  type SeriesLayout,
} from "./series";

// ~40 closes so MA30 has enough points to render as a smooth, lagging line.
const closes = [
  48, 48.5, 47.8, 47, 46.5, 47.2, 48, 49, 48.4, 49.5, 51, 50.4, 52, 53.5, 52.8,
  54, 55.5, 54.8, 53.9, 55, 57, 56.2, 58, 59.5, 58.6, 57.5, 59, 61, 60.2, 62,
  63.5, 62.6, 61.5, 63, 65, 64.2, 66, 67.5, 66.8, 68,
];

const bars = buildBars(closes);
const ma5 = movingAverage(closes, 5);
const ma10 = movingAverage(closes, 10);
const ma30 = movingAverage(closes, 30);

const layout: SeriesLayout = { left: 30, right: 500, count: closes.length };
const AXIS_X = 508;

// Legend entries, klinecharts-style "MAn" labels in each line's color.
const legend = [
  { label: "MA5", tone: "line1" as const, color: "var(--chart-line-1)" },
  { label: "MA10", tone: "line2" as const, color: "var(--chart-line-2)" },
  { label: "MA30", tone: "line3" as const, color: "var(--chart-line-3)" },
];

export function MovingAverageDiagram() {
  const priceToY = makeScale(
    [...bars.map((b) => b.high), ...bars.map((b) => b.low)],
    52,
    226,
  );

  return (
    <Diagram height={272} label="MA5、MA10、MA30 三条均线与价格蜡烛">
      <DiagramLabel anchor="start" size="xs" tone="muted" weight={400} x={30} y={20}>
        MA(5,10,30)
      </DiagramLabel>
      {legend.map((entry, i) => (
        <g key={entry.label}>
          <line
            stroke={entry.color}
            strokeWidth={2.5}
            x1={112 + i * 74}
            x2={128 + i * 74}
            y1={16}
            y2={16}
          />
          <DiagramLabel anchor="start" size="xs" tone={entry.tone} x={132 + i * 74} y={20}>
            {entry.label}
          </DiagramLabel>
        </g>
      ))}

      <PriceGrid
        labelX={AXIS_X}
        layout={layout}
        priceToY={priceToY}
        ticks={[52, 58, 64]}
      />
      <CandleSeries bars={bars} layout={layout} priceToY={priceToY} />
      <MALine color="var(--chart-line-3)" layout={layout} priceToY={priceToY} values={ma30} />
      <MALine color="var(--chart-line-2)" layout={layout} priceToY={priceToY} values={ma10} />
      <MALine color="var(--chart-line-1)" layout={layout} priceToY={priceToY} values={ma5} />
      <LastPriceMark
        labelX={AXIS_X - 2}
        layout={layout}
        price={closes[closes.length - 1]}
        priceToY={priceToY}
      />

      <DiagramLabel size="xs" tone="muted" weight={400} x={300} y={252}>
        天数越短越贴近价格、反应越快；越长越平滑、越滞后
      </DiagramLabel>
    </Diagram>
  );
}
