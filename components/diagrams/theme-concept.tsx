/**
 * @purpose 题材与概念图:题材股(炒作快涨快跌)对照业绩股(稳步上行)。
 * @role    diagrams 模块单图,题材与概念节使用。
 * @deps    ./primitives
 * @gotcha  题材线用琥珀、业绩线用中性;配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { Diagram, DiagramLabel } from "./primitives";

export function ThemeConceptDiagram() {
  return (
    <Diagram height={250} label="题材股靠炒作快涨快跌,业绩股靠盈利稳步上行">
      {/* legend */}
      <line
        stroke="var(--chart-line-1)"
        strokeWidth={3}
        x1={30}
        x2={48}
        y1={18}
        y2={18}
      />
      <DiagramLabel anchor="start" size="xs" tone="line1" x={54} y={22}>
        题材股(靠情绪 / 消息)
      </DiagramLabel>
      <line
        stroke="var(--foreground)"
        strokeWidth={3}
        x1={230}
        x2={248}
        y1={18}
        y2={18}
      />
      <DiagramLabel anchor="start" size="xs" x={254} y={22}>
        业绩股(靠真实盈利)
      </DiagramLabel>

      {/* 业绩股:稳步上行 */}
      <path
        d="M40 202 C160 190 320 160 530 118"
        fill="none"
        stroke="var(--foreground)"
        strokeLinecap="round"
        strokeWidth={3}
      />
      <DiagramLabel
        anchor="start"
        size="xs"
        tone="muted"
        weight={400}
        x={396}
        y={150}
      >
        稳步上行
      </DiagramLabel>

      {/* 题材股:快涨快跌 */}
      <path
        d="M40 190 C120 182 180 120 230 66 C270 108 320 168 360 192 C420 196 480 192 530 194"
        fill="none"
        stroke="var(--chart-line-1)"
        strokeLinecap="round"
        strokeWidth={3.5}
      />
      <circle cx={230} cy={66} fill="var(--stock-up)" r={5} />
      <DiagramLabel size="xs" tone="up" weight={700} x={230} y={50}>
        炒作高潮
      </DiagramLabel>
      <DiagramLabel size="xs" tone="down" weight={400} x={318} y={150}>
        退潮
      </DiagramLabel>
      <DiagramLabel
        anchor="start"
        size="xs"
        tone="muted"
        weight={400}
        x={44}
        y={210}
      >
        消息 / 风口
      </DiagramLabel>

      <DiagramLabel
        anchor="middle"
        size="xs"
        tone="muted"
        weight={400}
        x={280}
        y={238}
      >
        题材来得快去得也快,追高易套;业绩股慢但扎实,能拿得住
      </DiagramLabel>
    </Diagram>
  );
}
