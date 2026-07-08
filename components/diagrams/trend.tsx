/**
 * @purpose 上涨趋势结构:高点/低点抬高的双结构线。
 * @role    diagrams 模块单图,趋势结构节使用。
 * @deps    ./primitives、./series
 * @gotcha  配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { diagramColor, Diagram, DiagramLabel } from "./primitives";
import {
  buildBars,
  centerX,
  CandleSeries,
  makeScale,
  PriceGrid,
  type SeriesLayout,
} from "./series";

const closes = [
  40, 43, 46, 44, 42, 45, 49, 52, 50, 48, 51, 55, 58, 56, 54, 57, 61, 64, 62,
  60, 63, 67,
];

const bars = buildBars(closes);
const layout: SeriesLayout = { left: 30, right: 500, count: closes.length };
const AXIS_X = 508;

// Swing points stepping higher through the uptrend.
const swingHighs = [2, 7, 12, 17];
const swingLows = [4, 9, 14, 19];

export function TrendDiagram() {
  const priceToY = makeScale(
    [...bars.map((b) => b.high), ...bars.map((b) => b.low)],
    62,
    230,
  );

  const highPoints = swingHighs.map((i) => ({
    x: centerX(layout, i),
    y: priceToY(bars[i].high) - 8,
  }));
  const lowPoints = swingLows.map((i) => ({
    x: centerX(layout, i),
    y: priceToY(bars[i].low) + 8,
  }));

  return (
    <Diagram height={272} label="上涨趋势：高点抬高、低点抬高">
      {/* legend row */}
      <circle cx={36} cy={17} fill={diagramColor("up")} r={4} />
      <DiagramLabel anchor="start" size="xs" tone="up" x={46} y={21}>
        高点抬高
      </DiagramLabel>
      <circle cx={130} cy={17} fill={diagramColor("line3")} r={4} />
      <DiagramLabel anchor="start" size="xs" tone="line3" x={140} y={21}>
        低点抬高
      </DiagramLabel>
      <DiagramLabel anchor="start" size="xs" tone="muted" weight={400} x={228} y={21}>
        两条结构线都在向上，趋势才算完整
      </DiagramLabel>

      <PriceGrid layout={layout} priceToY={priceToY} ticks={[45, 55, 65]} labelX={AXIS_X} />

      <polyline
        fill="none"
        points={highPoints.map((p) => `${p.x},${p.y}`).join(" ")}
        stroke={diagramColor("up")}
        strokeDasharray="7 6"
        strokeWidth={2}
      />
      <polyline
        fill="none"
        points={lowPoints.map((p) => `${p.x},${p.y}`).join(" ")}
        stroke={diagramColor("line3")}
        strokeDasharray="7 6"
        strokeWidth={2}
      />

      <CandleSeries bars={bars} layout={layout} priceToY={priceToY} />

      {highPoints.map((p, i) => (
        <g key={`h${i}`}>
          <circle cx={p.x} cy={p.y} fill={diagramColor("up")} r={4} />
          <DiagramLabel size="xs" tone="up" weight={400} x={p.x} y={p.y - 10}>
            高点{i + 1}
          </DiagramLabel>
        </g>
      ))}
      {lowPoints.map((p, i) => (
        <g key={`l${i}`}>
          <circle cx={p.x} cy={p.y} fill={diagramColor("line3")} r={4} />
          <DiagramLabel size="xs" tone="line3" weight={400} x={p.x} y={p.y + 20}>
            低点{i + 1}
          </DiagramLabel>
        </g>
      ))}
    </Diagram>
  );
}
