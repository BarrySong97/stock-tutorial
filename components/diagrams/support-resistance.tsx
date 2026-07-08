/**
 * @purpose 蜡烛在压力/支撑线间反弹 + 触碰箭头标注。
 * @role    diagrams 模块单图,支撑与压力节使用。
 * @deps    ./primitives、./series
 * @gotcha  压力红/支撑绿是功能色;配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { ArrowMarker, diagramColor, Diagram, DiagramLabel } from "./primitives";
import {
  buildBars,
  CandleSeries,
  centerX,
  makeScale,
  PriceGrid,
  type SeriesLayout,
} from "./series";

const closes = [
  44, 48, 52, 56, 59, 58, 55, 50, 46, 42, 41, 44, 48, 53, 57, 59, 58, 54, 49,
  45, 42, 46, 50, 52,
];

const bars = buildBars(closes);
const layout: SeriesLayout = { left: 30, right: 500, count: closes.length };
const AXIS_X = 508;

const RESISTANCE = 60;
const SUPPORT = 41;

// Bars where price tests each level (peaks touch resistance, troughs support).
const resistanceTouches = [4, 15];
const supportTouches = [10, 20];

export function SupportResistanceDiagram() {
  const priceToY = makeScale(
    [...bars.map((b) => b.high), ...bars.map((b) => b.low)],
    64,
    230,
  );
  const resistanceY = priceToY(RESISTANCE);
  const supportY = priceToY(SUPPORT);

  return (
    <Diagram height={278} label="价格两次冲高被压力位挡回、两次回落在支撑位获得承接">
      {/* legend row */}
      <line
        stroke={diagramColor("up")}
        strokeDasharray="6 5"
        strokeWidth={2}
        x1={30}
        x2={46}
        y1={18}
        y2={18}
      />
      <DiagramLabel anchor="start" size="xs" tone="up" x={52} y={22}>
        压力位：涨上去容易被卖出
      </DiagramLabel>
      <line
        stroke={diagramColor("down")}
        strokeDasharray="6 5"
        strokeWidth={2}
        x1={250}
        x2={266}
        y1={18}
        y2={18}
      />
      <DiagramLabel anchor="start" size="xs" tone="down" x={272} y={22}>
        支撑位：跌下来容易被买回
      </DiagramLabel>

      <PriceGrid layout={layout} priceToY={priceToY} ticks={[44, 50, 56]} labelX={AXIS_X} />
      <CandleSeries bars={bars} layout={layout} priceToY={priceToY} />

      <line
        stroke={diagramColor("up")}
        strokeDasharray="7 6"
        strokeWidth={2}
        x1={layout.left}
        x2={layout.right}
        y1={resistanceY}
        y2={resistanceY}
      />
      {resistanceTouches.map((index) => (
        <g key={index}>
          <ArrowMarker
            direction="down"
            tone="up"
            x={centerX(layout, index)}
            y={priceToY(bars[index].high) - 13}
          />
          <DiagramLabel
            size="xs"
            tone="up"
            weight={400}
            x={centerX(layout, index)}
            y={priceToY(bars[index].high) - 19}
          >
            冲高受阻
          </DiagramLabel>
        </g>
      ))}

      <line
        stroke={diagramColor("down")}
        strokeDasharray="7 6"
        strokeWidth={2}
        x1={layout.left}
        x2={layout.right}
        y1={supportY}
        y2={supportY}
      />
      {supportTouches.map((index) => (
        <g key={index}>
          <ArrowMarker
            direction="up"
            tone="down"
            x={centerX(layout, index)}
            y={priceToY(bars[index].low) + 13}
          />
          <DiagramLabel
            size="xs"
            tone="down"
            weight={400}
            x={centerX(layout, index)}
            y={priceToY(bars[index].low) + 30}
          >
            回踩获承接
          </DiagramLabel>
        </g>
      ))}
    </Diagram>
  );
}
