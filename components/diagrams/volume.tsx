/**
 * @purpose 成交量三段图:放量上涨/缩量回调/放量下跌 + 量价对齐。
 * @role    diagrams 模块单图,成交量节使用。
 * @deps    ./primitives、./series
 * @gotcha  颜色=涨跌、高矮=放缩;配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { Diagram, DiagramLabel } from "./primitives";
import {
  buildBars,
  CandleSeries,
  centerX,
  makeScale,
  MALine,
  movingAverage,
  PriceGrid,
  type SeriesLayout,
  VolumeBars,
} from "./series";

// Three phases: rise on expanding volume, shallow pullback on shrinking
// volume, then a heavy-volume breakdown — the three list concepts in order.
const closes = [
  40, 42, 43.5, 45, 47, 48.5, 50, 52, 53.5, 52.8, 52, 51.2, 50.6, 50, 48.5,
  46.5, 44, 41.5, 39,
];
const volumes = [
  30, 38, 44, 52, 60, 68, 75, 82, 88, 40, 32, 26, 22, 20, 70, 85, 96, 110, 122,
];

const bars = buildBars(closes);
const volumeMa = movingAverage(volumes, 4);

const layout: SeriesLayout = { left: 30, right: 500, count: closes.length };
const AXIS_X = 508;
const VOLUME_BASE = 288;
const VOLUME_MAX_HEIGHT = 66;

// Phase boundaries in bar indices: [0..8] rise, [9..13] pullback, [14..18] drop.
const phases = [
  { from: 0, to: 8, label: "① 放量上涨", tone: "up" as const, fill: "var(--stock-up-soft)" },
  { from: 9, to: 13, label: "② 缩量回调", tone: "muted" as const, fill: "var(--surface-secondary)" },
  { from: 14, to: 18, label: "③ 放量下跌", tone: "down" as const, fill: "var(--stock-down-soft)" },
];

function phaseEdges(from: number, to: number) {
  const step = (layout.right - layout.left) / layout.count;
  const x1 = layout.left + step * from;
  const x2 = layout.left + step * (to + 1);

  return { x1, x2 };
}

export function VolumeDiagram() {
  const priceToY = makeScale(
    [...bars.map((b) => b.high), ...bars.map((b) => b.low)],
    44,
    176,
  );
  const peakVolume = Math.max(...volumes);
  const volumeToY = (value: number) =>
    VOLUME_BASE - (value / peakVolume) * VOLUME_MAX_HEIGHT;

  return (
    <Diagram height={314} label="放量上涨、缩量回调、放量下跌三个阶段">
      {phases.map((phase) => {
        const { x1, x2 } = phaseEdges(phase.from, phase.to);

        return (
          <g key={phase.label}>
            <rect
              fill={phase.fill}
              fillOpacity={0.5}
              height={VOLUME_BASE - 36}
              width={x2 - x1}
              x={x1}
              y={36}
            />
            <DiagramLabel tone={phase.tone} x={(x1 + x2) / 2} y={26}>
              {phase.label}
            </DiagramLabel>
          </g>
        );
      })}

      <PriceGrid
        labelX={AXIS_X}
        layout={layout}
        priceToY={priceToY}
        ticks={[41, 46, 51]}
      />
      <CandleSeries bars={bars} layout={layout} priceToY={priceToY} />

      <line
        stroke="var(--border)"
        strokeWidth={1}
        x1={layout.left}
        x2={layout.right}
        y1={202}
        y2={202}
      />
      <DiagramLabel anchor="start" size="xs" tone="muted" weight={600} x={layout.left} y={218}>
        成交量
      </DiagramLabel>
      <DiagramLabel anchor="start" size="xs" tone="muted" weight={400} x={layout.left + 42} y={218}>
        柱高 = 放量 / 缩量，颜色 = 红涨绿跌
      </DiagramLabel>

      <VolumeBars
        bars={bars}
        baseY={VOLUME_BASE}
        layout={layout}
        maxHeight={VOLUME_MAX_HEIGHT}
        volumes={volumes}
      />
      <MALine
        color="var(--chart-line-1)"
        layout={layout}
        priceToY={volumeToY}
        strokeWidth={2}
        values={volumeMa}
      />
      <line
        stroke="var(--muted)"
        strokeWidth={1}
        x1={layout.left}
        x2={layout.right}
        y1={VOLUME_BASE}
        y2={VOLUME_BASE}
      />
      <DiagramLabel size="xs" tone="up" weight={400} x={centerX(layout, 4)} y={306}>
        量柱逐根变高
      </DiagramLabel>
      <DiagramLabel size="xs" tone="muted" weight={400} x={centerX(layout, 11)} y={306}>
        量柱明显缩小
      </DiagramLabel>
      <DiagramLabel size="xs" tone="down" weight={400} x={centerX(layout, 16)} y={306}>
        下跌反而放量
      </DiagramLabel>
    </Diagram>
  );
}
