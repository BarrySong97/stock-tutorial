/**
 * @purpose 盘口五档挂单表 + 委比/内外盘注释。
 * @role    diagrams 模块单图,盘口五档节使用。
 * @deps    ./primitives
 * @gotcha  涨时五档价相对昨收显红;配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { Diagram, DiagramLabel } from "./primitives";

interface Level {
  label: string;
  price: string;
  qty: number;
  current?: boolean;
}

// Asks on top (卖五→卖一), current price in the middle, bids below (买一→买五).
const levels: Level[] = [
  { label: "卖五", price: "40.28", qty: 320 },
  { label: "卖四", price: "40.26", qty: 180 },
  { label: "卖三", price: "40.24", qty: 450 },
  { label: "卖二", price: "40.23", qty: 210 },
  { label: "卖一", price: "40.21", qty: 160 },
  { label: "现价", price: "40.20", qty: 0, current: true },
  { label: "买一", price: "40.19", qty: 280 },
  { label: "买二", price: "40.18", qty: 190 },
  { label: "买三", price: "40.16", qty: 520 },
  { label: "买四", price: "40.14", qty: 240 },
  { label: "买五", price: "40.12", qty: 300 },
];

const ROW_TOP = 30;
const ROW_H = 23;
const BAR_LEFT = 232;
const BAR_MAX = 132;
const maxQty = Math.max(...levels.map((l) => l.qty));

export function OrderBookDiagram() {
  return (
    <Diagram height={296} label="盘口五档：卖五到买五的挂单，以及委比、内外盘">
      {levels.map((lvl, i) => {
        const cy = ROW_TOP + i * ROW_H + ROW_H / 2;

        if (lvl.current) {
          return (
            <g key={lvl.label}>
              <rect fill="var(--stock-up-soft)" height={ROW_H} width={362} x={26} y={ROW_TOP + i * ROW_H} />
              <DiagramLabel anchor="start" size="sm" tone="muted" weight={400} x={38} y={cy + 4}>
                现价
              </DiagramLabel>
              <DiagramLabel anchor="end" size="md" tone="up" weight={700} x={168} y={cy + 5}>
                {lvl.price}
              </DiagramLabel>
              <DiagramLabel anchor="start" size="xs" tone="up" x={200} y={cy + 4}>
                +2.81%
              </DiagramLabel>
            </g>
          );
        }

        return (
          <g key={lvl.label}>
            <DiagramLabel anchor="start" size="sm" tone="muted" weight={400} x={38} y={cy + 4}>
              {lvl.label}
            </DiagramLabel>
            <DiagramLabel anchor="end" size="sm" tone="up" x={168} y={cy + 4}>
              {lvl.price}
            </DiagramLabel>
            <DiagramLabel anchor="end" size="xs" tone="muted" weight={400} x={222} y={cy + 4}>
              {lvl.qty}
            </DiagramLabel>
            <rect
              fill="color-mix(in oklab, var(--muted) 32%, transparent)"
              height={9}
              width={(lvl.qty / maxQty) * BAR_MAX}
              x={BAR_LEFT}
              y={cy - 4.5}
            />
          </g>
        );
      })}

      {/* divider between table and side annotations */}
      <line stroke="var(--border)" strokeWidth={1} x1={392} x2={392} y1={30} y2={283} />

      <DiagramLabel anchor="start" size="sm" weight={700} x={406} y={70}>
        委比 +18%
      </DiagramLabel>
      <DiagramLabel anchor="start" size="xs" tone="muted" weight={400} x={406} y={88}>
        买盘挂单略强于卖盘
      </DiagramLabel>

      <DiagramLabel anchor="start" size="sm" tone="up" weight={700} x={406} y={150}>
        外盘 7.2万
      </DiagramLabel>
      <DiagramLabel anchor="start" size="xs" tone="muted" weight={400} x={406} y={168}>
        主动买入成交
      </DiagramLabel>

      <DiagramLabel anchor="start" size="sm" tone="down" weight={700} x={406} y={210}>
        内盘 5.4万
      </DiagramLabel>
      <DiagramLabel anchor="start" size="xs" tone="muted" weight={400} x={406} y={228}>
        主动卖出成交
      </DiagramLabel>
    </Diagram>
  );
}
