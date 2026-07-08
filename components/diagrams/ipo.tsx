/**
 * @purpose 打新股图:申购 → 中签(低概率) → 上市首日 的流程示意。
 * @role    diagrams 模块单图,打新股节使用。
 * @deps    ./primitives
 * @gotcha  纯机制流程图;配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { Diagram, DiagramLabel } from "./primitives";

const steps = [
  { cx: 130, title: "① 申购", note: "按市值顶格申购" },
  { cx: 300, title: "② 中签", note: "概率低(约千分之几)" },
  { cx: 470, title: "③ 上市首日", note: "通常溢价开盘" },
];
const BOX_W = 120;
const BOX_Y = 66;
const BOX_H = 48;

export function IpoDiagram() {
  return (
    <Diagram height={200} label="打新股流程:申购、中签、上市首日">
      <DiagramLabel
        anchor="middle"
        size="xs"
        tone="muted"
        weight={400}
        x={280}
        y={26}
      >
        打新 = 以发行价申购尚未上市的新股
      </DiagramLabel>

      {/* 连接箭头 */}
      <line
        stroke="var(--muted)"
        strokeWidth={2}
        x1={190}
        x2={234}
        y1={BOX_Y + BOX_H / 2}
        y2={BOX_Y + BOX_H / 2}
      />
      <path d="M234 84 l-9 -4 l0 8 z" fill="var(--muted)" />
      <line
        stroke="var(--muted)"
        strokeWidth={2}
        x1={360}
        x2={404}
        y1={BOX_Y + BOX_H / 2}
        y2={BOX_Y + BOX_H / 2}
      />
      <path d="M404 84 l-9 -4 l0 8 z" fill="var(--muted)" />

      {steps.map((s, i) => (
        <g key={s.title}>
          <rect
            fill={i === 1 ? "var(--surface-secondary)" : "var(--surface)"}
            height={BOX_H}
            rx={10}
            stroke="var(--border)"
            width={BOX_W}
            x={s.cx - BOX_W / 2}
            y={BOX_Y}
          />
          <DiagramLabel size="md" x={s.cx} y={BOX_Y + 30}>
            {s.title}
          </DiagramLabel>
          <DiagramLabel
            size="xs"
            tone="muted"
            weight={400}
            x={s.cx}
            y={BOX_Y + BOX_H + 18}
          >
            {s.note}
          </DiagramLabel>
        </g>
      ))}

      <DiagramLabel size="xs" tone="up" weight={700} x={470} y={BOX_Y - 8}>
        首日常溢价
      </DiagramLabel>

      <DiagramLabel
        anchor="middle"
        size="xs"
        tone="muted"
        weight={400}
        x={280}
        y={182}
      >
        中签率低;新股上市初期常有溢价,但并非稳赚不赔
      </DiagramLabel>
    </Diagram>
  );
}
