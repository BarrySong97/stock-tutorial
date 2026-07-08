/**
 * @purpose 行情面板图:现价 + 12 个字段的仿 App 面板。
 * @role    diagrams 模块单图,index.ts 导出、page.tsx 行情面板节使用。
 * @deps    ./primitives
 * @gotcha  数值用同一虚拟股;配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { Diagram, DiagramLabel, type DiagramTone } from "./primitives";

interface Field {
  name: string;
  value: string;
  tone?: DiagramTone;
}

// One imaginary stock, reused across every "software field" diagram:
// last 40.20, prev close 39.10 (so it is up +1.10 / +2.81%).
const fields: Field[] = [
  { name: "今开", value: "39.30", tone: "up" },
  { name: "昨收", value: "39.10" },
  { name: "振幅", value: "3.84%" },
  { name: "最高", value: "40.55", tone: "up" },
  { name: "最低", value: "39.05", tone: "down" },
  { name: "换手率", value: "2.80%" },
  { name: "成交量", value: "12.6万手" },
  { name: "成交额", value: "5.02亿" },
  { name: "量比", value: "1.35" },
  { name: "市盈率(动)", value: "18.6" },
  { name: "总市值", value: "92亿" },
  { name: "流通市值", value: "78亿" },
];

const LEFT = 30;
const RIGHT = 530;
const COLS = 3;
const COL_W = (RIGHT - LEFT) / COLS;
const GRID_TOP = 60;
const ROW_H = 56;

export function QuotePanelDiagram() {
  return (
    <Diagram height={296} label="证券软件个股页顶部的行情字段">
      {/* hero: current price + change, the big number every quote page leads with */}
      <text fill="var(--muted)" fontSize={12} x={LEFT} y={26}>
        现价
      </text>
      <text fill="var(--stock-up)" fontSize={26} fontWeight={700} x={LEFT} y={44}>
        40.20
      </text>
      <text fill="var(--stock-up)" fontSize={14} fontWeight={600} x={LEFT + 92} y={44}>
        +1.10　+2.81%
      </text>

      {/* field grid */}
      {fields.map((field, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const x = LEFT + col * COL_W + 12;
        const rowTop = GRID_TOP + row * ROW_H;

        return (
          <g key={field.name}>
            <DiagramLabel anchor="start" size="xs" tone="muted" weight={400} x={x} y={rowTop + 20}>
              {field.name}
            </DiagramLabel>
            <DiagramLabel anchor="start" size="md" tone={field.tone ?? "default"} x={x} y={rowTop + 42}>
              {field.value}
            </DiagramLabel>
          </g>
        );
      })}

      {/* faint separators between rows */}
      {[0, 1, 2, 3].map((row) => (
        <line
          key={row}
          stroke="var(--border)"
          strokeWidth={1}
          x1={LEFT}
          x2={RIGHT}
          y1={GRID_TOP + row * ROW_H}
          y2={GRID_TOP + row * ROW_H}
        />
      ))}
    </Diagram>
  );
}
