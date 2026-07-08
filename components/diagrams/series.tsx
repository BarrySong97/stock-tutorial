/**
 * @purpose 蜡烛序列原子:OHLC 构造、均线、价格标尺、蜡烛/量柱/网格/最新价渲染。
 * @role    diagrams 模块中真实图表类图的公共渲染层。
 * @deps    react;CSS 变量
 * @gotcha  buildBars 里 open=上一根 close 保证连续;A 股红涨绿跌。见 docs/modules/diagrams/README.md
 */
/*
 * Candlestick-series building blocks shared by the "real chart" diagrams
 * (moving average, volume, support/resistance, trend). Modeled on how
 * klinecharts renders: solid candles (A-share red = up, green = down),
 * moving-average lines that flow through the candles (short MA hugs price,
 * long MA is smoother and lags), and a volume pane aligned under each candle.
 * All colors come from the theme tokens in styles/globals.css.
 */

export interface Ohlc {
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * Turns a series of closing prices into continuous OHLC bars (each bar opens
 * at the previous close, as an intraday chart does) with natural-looking
 * wicks. Deterministic so the diagrams render identically every time.
 */
export function buildBars(closes: number[]): Ohlc[] {
  return closes.map((close, i) => {
    const open = i === 0 ? close - 0.6 : closes[i - 1];
    const body = Math.abs(close - open);
    const wick = 0.35 + body * 0.5 + ((i * 13) % 7) * 0.14;

    return {
      open,
      close,
      high: Math.max(open, close) + wick,
      low: Math.min(open, close) - wick,
    };
  });
}

export function movingAverage(
  closes: number[],
  period: number,
): Array<number | null> {
  return closes.map((_, i) => {
    if (i < period - 1) return null;
    let sum = 0;

    for (let j = i - period + 1; j <= i; j++) sum += closes[j];

    return sum / period;
  });
}

export type Scale = (value: number) => number;

/**
 * Maps a value domain onto a pixel range (yBottom is the larger pixel value
 * since SVG y grows downward), with a little padding so marks never touch the
 * plot edges.
 */
export function makeScale(
  values: number[],
  yTop: number,
  yBottom: number,
  pad = 0.12,
): Scale {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const lo = min - span * pad;
  const hi = max + span * pad;

  return (value) => yBottom - ((value - lo) / (hi - lo)) * (yBottom - yTop);
}

export interface SeriesLayout {
  left: number;
  right: number;
  count: number;
}

export function centerX(layout: SeriesLayout, index: number): number {
  const step = (layout.right - layout.left) / layout.count;

  return layout.left + step * (index + 0.5);
}

export function stepWidth(layout: SeriesLayout): number {
  return (layout.right - layout.left) / layout.count;
}

export interface CandleSeriesProps {
  bars: Ohlc[];
  layout: SeriesLayout;
  priceToY: Scale;
}

export function CandleSeries({ bars, layout, priceToY }: CandleSeriesProps) {
  const body = Math.max(3, stepWidth(layout) * 0.62);

  return (
    <g>
      {bars.map((bar, i) => {
        const cx = centerX(layout, i);
        const up = bar.close >= bar.open;
        const color = up ? "var(--stock-up)" : "var(--stock-down)";
        const top = priceToY(Math.max(bar.open, bar.close));
        const bottom = priceToY(Math.min(bar.open, bar.close));
        const height = Math.max(1.5, bottom - top);

        return (
          <g key={i}>
            <line
              stroke={color}
              strokeWidth={1.2}
              x1={cx}
              x2={cx}
              y1={priceToY(bar.high)}
              y2={priceToY(bar.low)}
            />
            <rect
              fill={color}
              height={height}
              width={body}
              x={cx - body / 2}
              y={top}
            />
          </g>
        );
      })}
    </g>
  );
}

export interface PriceGridProps {
  layout: SeriesLayout;
  priceToY: Scale;
  ticks: number[];
  labelX?: number;
}

/**
 * Dashed grid lines at the given price levels with right-hand axis labels,
 * mirroring a real chart's y axis.
 */
export function PriceGrid({ layout, priceToY, ticks, labelX }: PriceGridProps) {
  return (
    <g>
      {ticks.map((tick) => {
        const y = priceToY(tick);

        return (
          <g key={tick}>
            <line
              stroke="var(--border)"
              strokeDasharray="4 4"
              strokeWidth={1}
              x1={layout.left}
              x2={layout.right}
              y1={y}
              y2={y}
            />
            {labelX !== undefined && (
              <text fill="var(--muted)" fontSize={10} x={labelX} y={y + 3.5}>
                {tick.toFixed(2)}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

export interface LastPriceMarkProps {
  layout: SeriesLayout;
  priceToY: Scale;
  price: number;
  labelX: number;
}

/** Dashed line + price tag at the latest close, like a chart's last-price mark. */
export function LastPriceMark({
  layout,
  priceToY,
  price,
  labelX,
}: LastPriceMarkProps) {
  const y = priceToY(price);

  return (
    <g>
      <line
        stroke="var(--muted)"
        strokeDasharray="3 3"
        strokeWidth={1}
        x1={layout.left}
        x2={labelX - 4}
        y1={y}
        y2={y}
      />
      <rect fill="var(--foreground)" height={16} rx={3} width={42} x={labelX - 2} y={y - 8} />
      <text
        fill="var(--background)"
        fontSize={10}
        fontWeight={600}
        textAnchor="middle"
        x={labelX + 19}
        y={y + 3.5}
      >
        {price.toFixed(2)}
      </text>
    </g>
  );
}

export interface MALineProps {
  values: Array<number | null>;
  layout: SeriesLayout;
  priceToY: Scale;
  color: string;
  strokeWidth?: number;
}

export function MALine({
  values,
  layout,
  priceToY,
  color,
  strokeWidth = 2.5,
}: MALineProps) {
  const points = values
    .map((value, i) =>
      value === null ? null : `${centerX(layout, i)},${priceToY(value)}`,
    )
    .filter((p): p is string => p !== null);

  if (points.length < 2) return null;

  return (
    <polyline
      fill="none"
      points={points.join(" ")}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  );
}

export interface VolumeBarsProps {
  bars: Ohlc[];
  volumes: number[];
  layout: SeriesLayout;
  baseY: number;
  maxHeight: number;
}

export function VolumeBars({
  bars,
  volumes,
  layout,
  baseY,
  maxHeight,
}: VolumeBarsProps) {
  const body = Math.max(3, stepWidth(layout) * 0.62);
  const peak = Math.max(...volumes) || 1;

  return (
    <g>
      {volumes.map((volume, i) => {
        const height = (volume / peak) * maxHeight;
        const up = bars[i].close >= bars[i].open;

        return (
          <rect
            key={i}
            fill={up ? "var(--stock-up)" : "var(--stock-down)"}
            height={height}
            width={body}
            x={centerX(layout, i) - body / 2}
            y={baseY - height}
          />
        );
      })}
    </g>
  );
}
