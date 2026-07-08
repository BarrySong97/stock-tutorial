/**
 * @purpose 市场周期图:磨底→主升→见顶→回落 的循环曲线,配阶段标注。
 * @role    diagrams 模块单图,市场周期节使用。
 * @deps    ./primitives
 * @gotcha  上涨段红、下跌段绿(A股功能色);配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { Diagram, DiagramLabel } from "./primitives";

export function MarketCycleDiagram() {
  return (
    <Diagram
      height={260}
      label="市场的四个阶段:磨底、主升、见顶、回落,循环往复"
    >
      {/* 磨底(低位横盘) */}
      <path
        d="M30 186 C70 189 110 186 150 180"
        fill="none"
        stroke="var(--muted)"
        strokeLinecap="round"
        strokeWidth={4}
      />
      {/* 主升(上涨,红) */}
      <path
        d="M150 180 C205 152 255 96 300 74 C325 61 348 62 366 80"
        fill="none"
        stroke="var(--stock-up)"
        strokeLinecap="round"
        strokeWidth={5}
      />
      {/* 回落(下跌,绿) */}
      <path
        d="M366 80 C402 122 452 180 500 188 C512 190 522 189 530 188"
        fill="none"
        stroke="var(--stock-down)"
        strokeLinecap="round"
        strokeWidth={5}
      />

      <circle cx={150} cy={180} fill="var(--muted)" r={4} />
      <circle cx={340} cy={62} fill="var(--foreground)" r={4} />
      <circle cx={512} cy={190} fill="var(--muted)" r={4} />

      <DiagramLabel size="sm" tone="muted" x={90} y={210}>
        磨底
      </DiagramLabel>
      <DiagramLabel size="md" tone="up" weight={700} x={196} y={116}>
        主升
      </DiagramLabel>
      <DiagramLabel size="sm" x={340} y={44}>
        见顶
      </DiagramLabel>
      <DiagramLabel size="md" tone="down" weight={700} x={452} y={150}>
        回落
      </DiagramLabel>
      <DiagramLabel size="sm" tone="muted" x={516} y={210}>
        再磨底
      </DiagramLabel>

      <DiagramLabel
        anchor="middle"
        size="xs"
        tone="muted"
        weight={400}
        x={280}
        y={244}
      >
        涨与跌交替出现——没有只涨不跌的股票,也没有跌到底的深渊
      </DiagramLabel>
    </Diagram>
  );
}
