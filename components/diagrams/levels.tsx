/**
 * @purpose 交易级别嵌套:月/周/日/小时线。
 * @role    diagrams 模块单图,交易级别节使用。
 * @deps    ./primitives
 * @gotcha  配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { Diagram, DiagramLabel } from "./primitives";

const levels = [
  { width: 440, y: 32, title: "月线：大周期", emphasized: true },
  { width: 360, y: 94, title: "周线：中期趋势", emphasized: false },
  { width: 280, y: 156, title: "日线：波段计划", emphasized: false },
  { width: 200, y: 218, title: "小时线：进出节奏", emphasized: false },
];

export function LevelsDiagram() {
  return (
    <Diagram height={296} label="从月线到小时线的周期级别">
      {levels.map((level) => (
        <g key={level.title}>
          <rect
            fill={level.emphasized ? "var(--surface-secondary)" : "var(--surface)"}
            height={48}
            rx={10}
            stroke="var(--border)"
            width={level.width}
            x={280 - level.width / 2}
            y={level.y}
          />
          <DiagramLabel size="md" x={280} y={level.y + 29}>
            {level.title}
          </DiagramLabel>
        </g>
      ))}
    </Diagram>
  );
}
