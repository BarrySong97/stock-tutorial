/**
 * @purpose klinecharts 真实 K 线图的 React 封装(当前保留备用,页面未使用)。
 * @role    客户端组件;init/dispose/ResizeObserver 管理图表生命周期。
 * @deps    klinecharts、@/lib/mock-kline-data
 * @gotcha  备用组件,未被 page 引用故不进 bundle;配色用 A 股红涨绿跌。见 docs/decisions/0001-ashare-red-up-green-down.md
 */
"use client";

import type { KLineData } from "klinecharts";
import { useEffect, useRef } from "react";
import { init, dispose } from "klinecharts";

export interface KLineChartProps {
  data: KLineData[];
  height?: number;
}

export function KLineChart({ data, height = 360 }: KLineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const chart = init(container, {
      locale: "zh-CN",
      styles: {
        grid: {
          horizontal: { color: "#deded8" },
          vertical: { show: false },
        },
        candle: {
          bar: {
            upColor: "#c83f3f",
            downColor: "#1f8a5b",
            noChangeColor: "#7c7c73",
            upBorderColor: "#c83f3f",
            downBorderColor: "#1f8a5b",
            noChangeBorderColor: "#7c7c73",
            upWickColor: "#c83f3f",
            downWickColor: "#1f8a5b",
            noChangeWickColor: "#7c7c73",
          },
          priceMark: {
            last: {
              upColor: "#c83f3f",
              downColor: "#1f8a5b",
            },
          },
        },
        indicator: {
          bars: [{ upColor: "#c83f3f80", downColor: "#1f8a5b80", noChangeColor: "#7c7c7380" }],
        },
        xAxis: {
          axisLine: { color: "#deded8" },
          tickText: { color: "#7c7c73" },
          tickLine: { color: "#deded8" },
        },
        yAxis: {
          axisLine: { color: "#deded8" },
          tickText: { color: "#7c7c73" },
          tickLine: { color: "#deded8" },
        },
        crosshair: {
          horizontal: { line: { color: "#7c7c73" } },
          vertical: { line: { color: "#7c7c73" } },
        },
        separator: { color: "#deded8" },
      },
    });

    chart?.applyNewData(data);
    chart?.createIndicator("MA", false, { id: "candle_pane" });
    chart?.createIndicator("VOL");

    const resizeObserver = new ResizeObserver(() => chart?.resize());

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      dispose(container);
    };
  }, [data]);

  return <div ref={containerRef} className="w-full" style={{ height }} />;
}
