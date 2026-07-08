/**
 * @purpose 分时图:白线价格、黄线当日均价、昨收基准、分钟量柱。
 * @role    diagrams 模块单图,分时图节使用。
 * @deps    ./primitives、./series
 * @gotcha  价格路径用种子伪随机(hydration-safe);配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { Diagram, DiagramLabel } from "./primitives";
import { centerX, makeScale, type SeriesLayout } from "./series";

const PREV_CLOSE = 39.1;

// Deterministic intraday price path (opens 39.30, drifts up to 40.20 with
// wiggles and a dip below yesterday's close early on). Seeded so server and
// client render identically — no Math.random (hydration-safe).
function intradayPath(n: number): number[] {
  let seed = 20260708;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;

    return seed / 0x7fffffff;
  };
  const out: number[] = [];

  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const trend = 39.3 + (40.2 - 39.3) * t;
    const earlyDip = t < 0.25 ? -0.28 * (1 - t / 0.25) : 0;
    const noise = (rand() - 0.5) * 0.22;

    out.push(Number((trend + earlyDip + noise).toFixed(2)));
  }
  out[0] = 39.3;
  out[n - 1] = 40.2;

  return out;
}

// Running average of price — the diagram's yellow "均价线".
function runningAverage(prices: number[]): number[] {
  let sum = 0;

  return prices.map((p, i) => {
    sum += p;

    return sum / (i + 1);
  });
}

const N = 56;
const prices = intradayPath(N);
const avg = runningAverage(prices);
const volumes = prices.map((p, i) => 20 + Math.abs(p - (prices[i - 1] ?? p)) * 260 + ((i * 17) % 11) * 3);

const layout: SeriesLayout = { left: 30, right: 500, count: N };
const AXIS_X = 508;
const VOL_BASE = 286;
const VOL_MAX = 60;

export function TimeshareDiagram() {
  const priceToY = makeScale([...prices, PREV_CLOSE, 40.6, 38.9], 44, 196);
  const peakVol = Math.max(...volumes);

  const pricePoints = prices
    .map((p, i) => `${centerX(layout, i)},${priceToY(p)}`)
    .join(" ");
  const avgPoints = avg
    .map((p, i) => `${centerX(layout, i)},${priceToY(p)}`)
    .join(" ");

  return (
    <Diagram height={300} label="分时图：白线实时价、黄线当日均价、下方分钟量柱">
      {/* legend */}
      <line stroke="var(--foreground)" strokeWidth={2} x1={30} x2={46} y1={16} y2={16} />
      <DiagramLabel anchor="start" size="xs" x={52} y={20}>
        价格
      </DiagramLabel>
      <line stroke="var(--chart-line-1)" strokeWidth={2} x1={110} x2={126} y1={16} y2={16} />
      <DiagramLabel anchor="start" size="xs" tone="line1" x={132} y={20}>
        当日均价
      </DiagramLabel>
      <line stroke="var(--muted)" strokeDasharray="4 3" strokeWidth={1.5} x1={214} x2={230} y1={16} y2={16} />
      <DiagramLabel anchor="start" size="xs" tone="muted" weight={400} x={236} y={20}>
        昨收 {PREV_CLOSE.toFixed(2)}
      </DiagramLabel>

      {/* yesterday's close baseline */}
      <line
        stroke="var(--muted)"
        strokeDasharray="4 3"
        strokeWidth={1}
        x1={layout.left}
        x2={layout.right}
        y1={priceToY(PREV_CLOSE)}
        y2={priceToY(PREV_CLOSE)}
      />
      <text fill="var(--muted)" fontSize={10} x={AXIS_X} y={priceToY(PREV_CLOSE) + 3.5}>
        39.10
      </text>
      <text fill="var(--stock-up)" fontSize={10} x={AXIS_X} y={priceToY(40.2) + 3.5}>
        40.20
      </text>

      <polyline fill="none" points={avgPoints} stroke="var(--chart-line-1)" strokeWidth={2} />
      <polyline fill="none" points={pricePoints} stroke="var(--foreground)" strokeWidth={1.5} />

      {/* volume pane */}
      <line stroke="var(--border)" strokeWidth={1} x1={layout.left} x2={layout.right} y1={214} y2={214} />
      <DiagramLabel anchor="start" size="xs" tone="muted" weight={400} x={layout.left} y={230}>
        分钟成交量
      </DiagramLabel>
      {volumes.map((v, i) => {
        const h = (v / peakVol) * VOL_MAX;
        const up = prices[i] >= (prices[i - 1] ?? prices[i]);

        return (
          <rect
            key={i}
            fill={up ? "var(--stock-up)" : "var(--stock-down)"}
            height={h}
            width={Math.max(2, (layout.right - layout.left) / N - 2)}
            x={centerX(layout, i) - (layout.right - layout.left) / N / 2 + 1}
            y={VOL_BASE - h}
          />
        );
      })}
      <line stroke="var(--muted)" strokeWidth={1} x1={layout.left} x2={layout.right} y1={VOL_BASE} y2={VOL_BASE} />
    </Diagram>
  );
}
