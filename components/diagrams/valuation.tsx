/**
 * @purpose 估值图:市盈率(PE)高低分档标尺 + 市净率(PB)说明。
 * @role    diagrams 模块单图,估值节使用。
 * @deps    ./primitives
 * @gotcha  估值色用蓝(偏低)/红(偏高),不用涨跌色;走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import {
  ArrowMarker,
  Diagram,
  DiagramLabel,
  type DiagramTone,
} from "./primitives";

const LEFT = 40;
const RIGHT = 520;
const MAX = 60;
const gx = (v: number) => LEFT + (v / MAX) * (RIGHT - LEFT);

const zones: Array<{
  from: number;
  to: number;
  word: string;
  range: string;
  tone: DiagramTone;
  fill: string;
}> = [
  {
    from: 0,
    to: 15,
    word: "偏低",
    range: "PE < 15",
    tone: "line2",
    fill: "color-mix(in oklab, var(--chart-line-2) 22%, transparent)",
  },
  {
    from: 15,
    to: 30,
    word: "合理",
    range: "15–30",
    tone: "muted",
    fill: "var(--surface-tertiary)",
  },
  {
    from: 30,
    to: 60,
    word: "偏高",
    range: "PE > 30",
    tone: "up",
    fill: "color-mix(in oklab, var(--stock-up) 22%, transparent)",
  },
];

const EXAMPLE = 22;
const GY = 66;
const GH = 16;

export function ValuationDiagram() {
  return (
    <Diagram height={230} label="市盈率高低分档与市净率说明">
      <DiagramLabel anchor="start" size="md" weight={700} x={30} y={26}>
        市盈率(PE)
      </DiagramLabel>
      <DiagramLabel
        anchor="start"
        size="xs"
        tone="muted"
        weight={400}
        x={140}
        y={26}
      >
        = 股价 ÷ 每股收益(为每一元利润付多少钱)
      </DiagramLabel>

      {zones.map((z) => (
        <g key={z.word}>
          <rect
            fill={z.fill}
            height={GH}
            width={gx(z.to) - gx(z.from)}
            x={gx(z.from)}
            y={GY}
          />
          <DiagramLabel
            size="sm"
            tone={z.tone}
            weight={600}
            x={(gx(z.from) + gx(z.to)) / 2}
            y={GY + 40}
          >
            {z.word}
          </DiagramLabel>
          <DiagramLabel
            size="xs"
            tone="muted"
            weight={400}
            x={(gx(z.from) + gx(z.to)) / 2}
            y={GY + 56}
          >
            {z.range}
          </DiagramLabel>
        </g>
      ))}

      <ArrowMarker direction="down" tone="default" x={gx(EXAMPLE)} y={GY - 8} />
      <DiagramLabel size="xs" x={gx(EXAMPLE)} y={GY - 14}>
        本例 PE 22
      </DiagramLabel>

      <line
        stroke="var(--border)"
        strokeWidth={1}
        x1={30}
        x2={530}
        y1={148}
        y2={148}
      />
      <DiagramLabel anchor="start" size="md" weight={700} x={30} y={174}>
        市净率(PB)
      </DiagramLabel>
      <DiagramLabel
        anchor="start"
        size="xs"
        tone="muted"
        weight={400}
        x={140}
        y={174}
      >
        = 股价 ÷ 每股净资产,银行、地产等重资产行业更看它
      </DiagramLabel>

      <DiagramLabel
        anchor="middle"
        size="xs"
        tone="muted"
        weight={400}
        x={280}
        y={210}
      >
        估值高低要和同行业比;高估不必然跌、低估不必然涨,但给你安全边际
      </DiagramLabel>
    </Diagram>
  );
}
