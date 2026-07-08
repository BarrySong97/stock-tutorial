/**
 * @purpose 风险管理图:买入价 + 止损位 + 目标位,直观呈现盈亏比。
 * @role    diagrams 模块单图,仓位与风险管理节使用。
 * @deps    ./primitives
 * @gotcha  盈利空间红、亏损空间绿;配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { Diagram, DiagramLabel } from "./primitives";

const LEFT = 60;
const RIGHT = 410;
const ENTRY_Y = 140;
const STOP_Y = 186;
const TARGET_Y = 50;
const BRACKET_X = 452;

export function RiskManagementDiagram() {
  return (
    <Diagram height={240} label="买入价、止损位、目标位与盈亏比">
      {/* 目标位(红) */}
      <line
        stroke="var(--stock-up)"
        strokeDasharray="7 5"
        strokeWidth={2}
        x1={LEFT}
        x2={RIGHT}
        y1={TARGET_Y}
        y2={TARGET_Y}
      />
      <DiagramLabel
        anchor="start"
        size="sm"
        tone="up"
        x={LEFT}
        y={TARGET_Y - 8}
      >
        目标位 +15%
      </DiagramLabel>

      {/* 买入价 */}
      <line
        stroke="var(--foreground)"
        strokeWidth={2.5}
        x1={LEFT}
        x2={RIGHT}
        y1={ENTRY_Y}
        y2={ENTRY_Y}
      />
      <circle cx={235} cy={ENTRY_Y} fill="var(--foreground)" r={5} />
      <DiagramLabel
        anchor="start"
        size="sm"
        weight={700}
        x={LEFT}
        y={ENTRY_Y - 8}
      >
        买入价
      </DiagramLabel>

      {/* 止损位(绿) */}
      <line
        stroke="var(--stock-down)"
        strokeDasharray="7 5"
        strokeWidth={2}
        x1={LEFT}
        x2={RIGHT}
        y1={STOP_Y}
        y2={STOP_Y}
      />
      <DiagramLabel
        anchor="start"
        size="sm"
        tone="down"
        x={LEFT}
        y={STOP_Y + 18}
      >
        止损位 −5%
      </DiagramLabel>

      {/* 盈利空间 bracket(红,大) */}
      <path
        d={`M${BRACKET_X - 6} ${TARGET_Y} h6 v${ENTRY_Y - TARGET_Y} h-6`}
        fill="none"
        stroke="var(--stock-up)"
        strokeWidth={2}
      />
      <DiagramLabel
        anchor="start"
        size="sm"
        tone="up"
        weight={700}
        x={BRACKET_X + 6}
        y={(TARGET_Y + ENTRY_Y) / 2 + 4}
      >
        赚 3
      </DiagramLabel>

      {/* 亏损空间 bracket(绿,小) */}
      <path
        d={`M${BRACKET_X - 6} ${ENTRY_Y} h6 v${STOP_Y - ENTRY_Y} h-6`}
        fill="none"
        stroke="var(--stock-down)"
        strokeWidth={2}
      />
      <DiagramLabel
        anchor="start"
        size="sm"
        tone="down"
        weight={700}
        x={BRACKET_X + 6}
        y={(ENTRY_Y + STOP_Y) / 2 + 4}
      >
        亏 1
      </DiagramLabel>

      <DiagramLabel
        anchor="middle"
        size="xs"
        tone="muted"
        weight={400}
        x={280}
        y={224}
      >
        盈亏比 = 盈利空间 ÷ 亏损空间;先定好止损,再谈赚多少
      </DiagramLabel>
    </Diagram>
  );
}
