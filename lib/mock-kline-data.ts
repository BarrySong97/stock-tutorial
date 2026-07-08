/**
 * @purpose 生成确定性的模拟 K 线 OHLCV 数据(mulberry32 种子)。
 * @role    工具;仅供备用的 kline-chart 组件使用。
 * @deps    klinecharts(类型 KLineData)
 * @gotcha  种子伪随机保证每次渲染一致(避免 hydration 不一致)。
 */
import type { KLineData } from "klinecharts";

// Deterministic pseudo-random generator (mulberry32) so the demo chart looks
// the same on every render instead of reshuffling on each build/reload.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateMockKLineData(count = 90, seed = 42): KLineData[] {
  const random = mulberry32(seed);
  const data: KLineData[] = [];
  const dayMs = 24 * 60 * 60 * 1000;
  const startTimestamp = 1735689600000; // 2025-01-01 UTC, fixed so output is stable

  let price = 10;

  for (let i = 0; i < count; i++) {
    const drift = (random() - 0.47) * 0.6;
    const open = price;
    const close = Math.max(1, open + drift);
    const high = Math.max(open, close) + random() * 0.35;
    const low = Math.min(open, close) - random() * 0.35;
    const volume = Math.round(400 + random() * 900 * (1 + Math.abs(drift)));

    data.push({
      timestamp: startTimestamp + i * dayMs,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(Math.max(0.5, low).toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    price = close;
  }

  return data;
}
