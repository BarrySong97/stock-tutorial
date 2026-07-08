/**
 * @purpose 五蜡烛标本板:大阳/小阳/十字星/小阴/大阴对照。
 * @role    diagrams 模块单图,阳线与阴线节使用。
 * @deps    ./primitives
 * @gotcha  配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import { Candle, Diagram, DiagramLabel, type DiagramTone } from "./primitives";

interface Specimen {
  x: number;
  name: string;
  desc: string;
  tone: DiagramTone;
  direction: "up" | "down";
  wickTop: number;
  wickBottom: number;
  bodyTop: number;
  bodyBottom: number;
}

const specimens: Specimen[] = [
  {
    x: 76,
    name: "大阳线",
    desc: "买方占优",
    tone: "up",
    direction: "up",
    wickTop: 52,
    wickBottom: 188,
    bodyTop: 58,
    bodyBottom: 182,
  },
  {
    x: 178,
    name: "小阳线",
    desc: "温和上涨",
    tone: "up",
    direction: "up",
    wickTop: 78,
    wickBottom: 162,
    bodyTop: 102,
    bodyBottom: 138,
  },
  {
    x: 280,
    name: "十字星",
    desc: "多空平衡",
    tone: "default",
    direction: "up",
    wickTop: 58,
    wickBottom: 182,
    bodyTop: 117,
    bodyBottom: 123,
  },
  {
    x: 382,
    name: "小阴线",
    desc: "温和回落",
    tone: "down",
    direction: "down",
    wickTop: 78,
    wickBottom: 162,
    bodyTop: 102,
    bodyBottom: 138,
  },
  {
    x: 484,
    name: "大阴线",
    desc: "卖方占优",
    tone: "down",
    direction: "down",
    wickTop: 52,
    wickBottom: 188,
    bodyTop: 58,
    bodyBottom: 182,
  },
];

export function YinYangDiagram() {
  return (
    <Diagram height={260} label="大阳线、小阳线、十字星、小阴线、大阴线对照">
      {specimens.map((s) => (
        <g key={s.name}>
          <Candle
            bodyBottom={s.bodyBottom}
            bodyTop={s.bodyTop}
            direction={s.direction}
            strokeWidth={3}
            width={44}
            wickBottom={s.wickBottom}
            wickTop={s.wickTop}
            x={s.x}
          />
          <DiagramLabel size="md" tone={s.tone} weight={700} x={s.x} y={216}>
            {s.name}
          </DiagramLabel>
          <DiagramLabel size="xs" tone="muted" weight={400} x={s.x} y={236}>
            {s.desc}
          </DiagramLabel>
        </g>
      ))}
    </Diagram>
  );
}
