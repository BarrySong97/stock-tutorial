/**
 * @purpose 交易心态图:情绪周期叠加价格波动,标出散户"贪婪追高、恐慌割肉"。
 * @role    diagrams 模块单图,交易心态节使用。
 * @deps    ./primitives
 * @gotcha  顶部买点红、底部卖点绿(呈现高买低卖);配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { Diagram, DiagramLabel } from "./primitives";

export function TradingPsychologyDiagram() {
  return (
    <Diagram height={262} label="情绪周期:散户常在贪婪时追高、在恐慌时割肉">
      {/* 价格情绪波 */}
      <path
        d="M30 182 C90 168 160 92 230 64 C290 90 350 150 400 198 C440 188 490 160 530 150"
        fill="none"
        stroke="var(--foreground)"
        strokeLinecap="round"
        strokeWidth={3}
      />

      {/* 情绪标注 */}
      <DiagramLabel size="xs" tone="muted" weight={400} x={110} y={140}>
        乐观
      </DiagramLabel>
      <DiagramLabel size="sm" tone="up" weight={700} x={230} y={44}>
        贪婪
      </DiagramLabel>
      <DiagramLabel size="xs" tone="muted" weight={400} x={306} y={100}>
        焦虑
      </DiagramLabel>
      <DiagramLabel size="xs" tone="muted" weight={400} x={356} y={150}>
        恐慌
      </DiagramLabel>
      <DiagramLabel size="sm" tone="down" weight={700} x={400} y={228}>
        绝望
      </DiagramLabel>
      <DiagramLabel size="xs" tone="muted" weight={400} x={484} y={140}>
        希望
      </DiagramLabel>

      {/* 散户买点(顶部,红) */}
      <circle cx={230} cy={64} fill="var(--stock-up)" r={6} />
      <DiagramLabel size="xs" tone="up" weight={400} x={230} y={30}>
        ← 追涨买入
      </DiagramLabel>

      {/* 散户卖点(底部,绿) */}
      <circle cx={400} cy={198} fill="var(--stock-down)" r={6} />
      <DiagramLabel size="xs" tone="down" weight={400} x={400} y={246}>
        割肉卖出 →
      </DiagramLabel>

      <DiagramLabel
        anchor="middle"
        size="xs"
        tone="muted"
        weight={400}
        x={280}
        y={16}
      >
        高买低卖,常常输给的不是市场,而是自己的情绪
      </DiagramLabel>
    </Diagram>
  );
}
