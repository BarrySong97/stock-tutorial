/**
 * @purpose 单根阳线解剖图:最高/最低/开/收/实体/影线标注。
 * @role    diagrams 模块单图,K 线节使用。
 * @deps    ./primitives
 * @gotcha  配色走 CSS 变量。见 docs/modules/diagrams/README.md
 */
import {
  Candle,
  ChartGrid,
  Diagram,
  DiagramLabel,
  GuideLine,
} from "./primitives";

export function KLineAnatomyDiagram() {
  return (
    <Diagram height={300} label="单根阳线的结构：最高价、最低价、开盘价、收盘价、实体与影线">
      <ChartGrid x1={40} x2={520} ys={[60, 120, 180, 240]} />

      <Candle
        bodyBottom={205}
        bodyTop={105}
        direction="up"
        width={104}
        wickBottom={260}
        wickTop={40}
        x={280}
      />

      <DiagramLabel size="md" x={280} y={26}>
        最高价
      </DiagramLabel>
      <DiagramLabel size="md" x={280} y={288}>
        最低价
      </DiagramLabel>

      <GuideLine tone="up" x1={220} x2={150} y1={105} y2={105} />
      <DiagramLabel anchor="end" size="md" tone="up" x={142} y={110}>
        收盘价
      </DiagramLabel>
      <GuideLine tone="up" x1={340} x2={410} y1={205} y2={205} />
      <DiagramLabel anchor="start" size="md" tone="up" x={418} y={210}>
        开盘价
      </DiagramLabel>

      {/* wick and body callouts */}
      <GuideLine x1={288} x2={336} y1={72} y2={72} />
      <DiagramLabel anchor="start" x={344} y={76}>
        上影线
      </DiagramLabel>
      <GuideLine x1={288} x2={336} y1={232} y2={232} />
      <DiagramLabel anchor="start" x={344} y={236}>
        下影线
      </DiagramLabel>
      <GuideLine x1={220} x2={186} y1={155} y2={155} />
      <DiagramLabel anchor="end" x={178} y={159}>
        实体
      </DiagramLabel>

      <DiagramLabel size="md" tone="up" weight={700} x={280} y={148}>
        阳线
      </DiagramLabel>
      <DiagramLabel tone="muted" weight={400} x={280} y={172}>
        收盘高于开盘
      </DiagramLabel>
    </Diagram>
  );
}
