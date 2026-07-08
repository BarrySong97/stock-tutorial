/**
 * @purpose 股票科普文档站的唯一页面:定义全部章节数据(sections)并渲染 TOC + 图文正文。
 * @role    路由入口(App Router 服务端组件);组合 Toc、DiagramFigure 与 components/diagrams/* 的图。
 * @deps    @/components/toc、@/components/diagram-figure、@/components/diagrams
 * @gotcha  章节顺序即页面与 TOC 顺序;加章节在 sections 里加一项并配一张图。见 docs/topics/page-structure.md
 */
import type { ReactNode } from "react";

import { Toc, type TocItem } from "@/components/toc";
import { DiagramFigure, type DiagramLegendItem } from "@/components/diagram-figure";
import {
  GapDiagram,
  KLineAnatomyDiagram,
  LevelsDiagram,
  MoneyFlowDiagram,
  MovingAverageDiagram,
  OrderBookDiagram,
  QuotePanelDiagram,
  SupportResistanceDiagram,
  TimeshareDiagram,
  TradingClockDiagram,
  TrendDiagram,
  TurnoverGaugeDiagram,
  VolumeDiagram,
  YinYangDiagram,
} from "@/components/diagrams";

interface Section {
  id: string;
  title: string;
  paragraphs: string[];
  list?: DiagramLegendItem[];
  note?: string;
  rule?: string;
  figure: {
    svg: ReactNode;
    caption?: string;
    legend?: DiagramLegendItem[];
  };
}

const sections: Section[] = [
  {
    id: "quote-panel",
    title: "行情面板",
    paragraphs: [
      "打开一只股票，最上面这一屏密密麻麻的数字，其实大多是由四个价格（今开、昨收、最高、最低）和两个量（成交量、成交额）算出来的。先认识它们，后面的概念就都有了落点。",
    ],
    list: [
      { term: "昨收 / 今开", desc: "昨天的收盘价、今天的开盘价——涨跌都是相对昨收算的。" },
      { term: "振幅", desc: "(最高 − 最低) ÷ 昨收，衡量今天价格摆动的幅度。" },
      { term: "总市值 / 流通市值", desc: "股价 × 总股本 / 流通股本，公司值多少钱。" },
      { term: "市盈率(动)", desc: "股价 ÷ 每股盈利，愿意为每一元利润付多少钱。" },
    ],
    note: "红色数字表示高于昨收、绿色表示低于昨收——这是 A 股整套配色的起点。",
    figure: {
      svg: <QuotePanelDiagram />,
      caption: "图例：一只虚拟股票的行情面板，现价 40.20、昨收 39.10，全天上涨。",
    },
  },
  {
    id: "kline",
    title: "K线",
    paragraphs: [
      "K线不是预测工具，它只是把一个周期内的价格路径压缩成一根图形。日K线代表一天，周K线代表一周，月K线代表一个月。",
    ],
    list: [
      { term: "开盘价", desc: "这个周期开始交易的位置。" },
      { term: "收盘价", desc: "这个周期结束的位置，通常最值得关注。" },
      { term: "最高价/最低价", desc: "盘中多空争夺到过的边界。" },
      { term: "实体", desc: "开盘与收盘之间的部分，表示周期结果。" },
      { term: "影线", desc: "盘中冲高或下探后，又被拉回来的痕迹。" },
    ],
    note: "先看 K 线讲了什么，再问它出现在什么位置。单根 K 线本身不给确定答案。",
    figure: {
      svg: <KLineAnatomyDiagram />,
      caption: "图例：阳线只说明这个周期收盘价高于开盘价，不等于下一根一定继续涨。",
    },
  },
  {
    id: "yin-yang",
    title: "阳线与阴线",
    paragraphs: [
      "阳线和阴线不是“好坏”的标签，而是收盘位置的结果。A股里红色容易让人兴奋，绿色容易让人害怕，但交易不能只靠颜色。",
    ],
    list: [
      { term: "大阳线", desc: "买方强，但高位巨量大阳也可能是分歧兑现。" },
      { term: "大阴线", desc: "卖方强，但低位放量大阴也可能是恐慌释放。" },
      { term: "小实体", desc: "多空分歧，方向不清楚，要结合位置看。" },
    ],
    note: "同一根 K 线，放在底部、突破处、高位，含义完全不同。",
    figure: {
      svg: <YinYangDiagram />,
      legend: [
        { term: "红色阳线", desc: "收盘高于开盘，说明本周期买方占上风。" },
        { term: "绿色阴线", desc: "收盘低于开盘，说明本周期卖方占上风。" },
        { term: "关键不是颜色", desc: "看位置、量能、趋势结构，颜色只是结果。" },
      ],
    },
  },
  {
    id: "timeshare",
    title: "分时图",
    paragraphs: [
      "K 线看的是每天一根，分时图看的是“今天这一天”里价格怎么走的。它是行情页里默认打开的那张图。",
      "记住两条线：白线是实时价格，黄线是当日均价（当天成交额 ÷ 成交量），可以理解成“当日版的均线”。价格在黄线上方，说明现在比今天买入的平均成本要强。",
    ],
    list: [
      { term: "白线", desc: "实时成交价，一分钟一动。" },
      { term: "黄线", desc: "当日累计均价，比白线平滑；白线常绕着它上下。" },
      { term: "昨收虚线", desc: "横的基准线，价格在它上方就是红盘、下方就是绿盘。" },
    ],
    figure: {
      svg: <TimeshareDiagram />,
      caption: "图例：白线绕着黄线走，站上黄线并逐步抬升，是当日走强的形态。",
    },
  },
  {
    id: "volume",
    title: "成交量",
    paragraphs: [
      "成交量，就是一段时间里实际成交了多少股（A股论“手”，1 手 = 100 股）。每笔成交都是买卖双方配对，量的是真正换手的筹码。",
      "看下图记住一点：量柱的颜色只跟涨跌走（红涨绿跌），高矮才代表量的大小——变高是放量、变矮是缩量。所以放量既能是红柱也能是绿柱，它只说“量多量少”，不管涨跌。",
    ],
    list: [
      { term: "放量上涨", desc: "红柱变高，买盘积极；高位巨量也可能是出货。" },
      { term: "缩量回调", desc: "量柱变矮，回调时抛压不重，强势中常见。" },
      { term: "放量下跌", desc: "绿柱变高，卖盘凶狠，警惕趋势走坏。" },
    ],
    note: "放量、缩量本身没有好坏，要结合涨跌方向和所处位置一起看。",
    figure: {
      svg: <VolumeDiagram />,
      caption: "颜色看涨跌、高矮看放缩——同样是放量，上涨红柱、下跌绿柱。",
    },
  },
  {
    id: "turnover",
    title: "换手率与量比",
    paragraphs: [
      "成交量是绝对数，不同股票没法直接比。换手率和量比就是把它变成能横向比较的“相对活跃度”。",
      "换手率 = 成交量 ÷ 流通股本，看今天有百分之几的流通筹码换了手；量比 = 今日每分钟均量 ÷ 近 5 日每分钟均量，看今天比最近放没放量。",
    ],
    list: [
      { term: "换手率", desc: "越高越活跃：1% 以下冷清、3%–7% 活跃、7% 以上过热。" },
      { term: "量比 > 1", desc: "今天比最近 5 天更放量，人气在上升。" },
      { term: "量比 < 1", desc: "比最近缩量，参与在减少。" },
    ],
    note: "档位只是经验参考，不是教条；开盘后看量比最容易抓住异动。",
    figure: {
      svg: <TurnoverGaugeDiagram />,
      caption: "图例：换手率看“活跃度分档”，量比看“今天比最近放大还是缩小”。",
    },
  },
  {
    id: "order-book",
    title: "盘口五档",
    paragraphs: [
      "盘口是还没成交的挂单排队表：上面五行是等着卖的（卖五到卖一），下面五行是等着买的（买一到买五），中间夹着现价。它反映的是“意愿”，不是已经成交的事实。",
    ],
    list: [
      { term: "五档挂单", desc: "每档一个价格 + 排队手数，越靠近现价越可能先成交。" },
      { term: "委比", desc: "(买挂单 − 卖挂单) ÷ 总挂单，正值说明买盘排队更多。" },
      { term: "外盘 / 内盘", desc: "主动买入成交算外盘、主动卖出成交算内盘。" },
      { term: "挂单 ≠ 成交", desc: "挂单随时可撤，大单挂出来也可能只是吓唬。" },
    ],
    figure: {
      svg: <OrderBookDiagram />,
      caption: "图例：涨的时候五档价格都相对昨收显红；量条越长，那一档排队越多。",
    },
  },
  {
    id: "money-flow",
    title: "大单与主力资金",
    paragraphs: [
      "软件把每一笔成交按“成交金额”分成特大单、大单、中单、小单，再统计各类的净流入。习惯上把特大单 + 大单看作“主力”，中小单看作散户。",
    ],
    list: [
      { term: "主力净流入", desc: "特大单 + 大单的买卖净额，常被当作大资金动向。" },
      { term: "会被拆单", desc: "大资金故意拆成小单下，会让这个数字失真。" },
      { term: "口径不统一", desc: "各家分档标准不同，只看相对变化、别当精确真相。" },
    ],
    note: "资金流是参考指标，不是圣旨——它能被伪造，也常和股价背离。",
    figure: {
      svg: <MoneyFlowDiagram />,
      caption: "图例：红色为净流入、绿色为净流出；这天主力净流入，散户净流出。",
    },
  },
  {
    id: "ma",
    title: "均线",
    paragraphs: [
      "均线就是过去 N 天收盘价的平均，按天数命名：MA5 是 5 天均线、MA10 是 10 天、MA30 是 30 天。天数越短越贴近价格、反应越快，越长越平滑、越滞后。",
    ],
    list: [
      { term: "价格在均线上", desc: "当前价强于平均成本，顺风更多。" },
      { term: "价格在均线下", desc: "当前价弱于平均成本，逆风更多。" },
      { term: "多头排列", desc: "价格 > MA5 > MA10 > MA30，从上到下排开，趋势最顺。" },
    ],
    note: "均线最适合回答：现在更像顺风，还是逆风？",
    figure: {
      svg: <MovingAverageDiagram />,
      legend: [
        { term: "MA5（短）", desc: "贴近价格、反应快，也更容易被噪音干扰。" },
        { term: "MA30（长）", desc: "更平滑稳定，适合看中期或大周期方向。" },
        { term: "不要迷信", desc: "均线天生滞后，必须结合成交量和结构。" },
      ],
    },
  },
  {
    id: "support",
    title: "支撑与压力",
    paragraphs: [
      "支撑位是跌下来容易被买回的位置，压力位是涨上去容易被卖出的位置。它们不是墙，而是市场记忆。",
    ],
    list: [
      { term: "支撑有效", desc: "回踩不破，说明可能有承接。" },
      { term: "压力有效", desc: "冲高不过，说明卖压仍在。" },
      { term: "突破压力", desc: "压力可能变支撑，但最好看回踩确认。" },
    ],
    note: "不要精确到分。支撑和压力更像区域，不是单一数字。",
    figure: {
      svg: <SupportResistanceDiagram />,
      caption: "图例：压力用红色表示上方卖压，支撑用绿色表示下方承接；这里是功能色，不是涨跌色。",
    },
  },
  {
    id: "trend",
    title: "趋势结构",
    paragraphs: [
      "上涨趋势不是每天都涨，而是回调后的低点越来越高，反弹后的高点也越来越高。下跌趋势则相反。所谓“看大周期”，就是先判断大级别结构有没有坏。",
    ],
    list: [
      { term: "上涨趋势", desc: "高点抬高，低点抬高。" },
      { term: "下跌趋势", desc: "高点降低，低点降低。" },
      { term: "震荡结构", desc: "高低点在一个区间里反复。" },
    ],
    note: "新手最大的坑，是用 5 分钟波动去否定周线、月线趋势。",
    figure: {
      svg: <TrendDiagram />,
      caption: "图例：趋势看的是结构，不是某一天涨跌。上涨趋势中也会有回调。",
    },
  },
  {
    id: "gap",
    title: "缺口",
    paragraphs: [
      "缺口是今天的价格直接跳过昨天的价格区间，中间没有成交。它代表市场情绪突然变强或变弱。",
    ],
    list: [
      { term: "突破缺口", desc: "长期横盘后向上跳空，可能是启动信号。" },
      { term: "持续缺口", desc: "上涨中再次跳空，可能说明趋势加速。" },
      { term: "衰竭缺口", desc: "连续大涨后再跳空，可能是行情后段。" },
    ],
    note: "别一看到缺口就追，先看它在底部、途中，还是高位。",
    figure: {
      svg: <GapDiagram />,
      caption: "图例：向上跳空在 A 股图里用红色表达，但是否能追，要看位置和量能。",
    },
  },
  {
    id: "levels",
    title: "交易级别",
    paragraphs: [
      "市场走势有级别，交易也必须有级别。日线买入就按日线管理，周线买入就按周线管理。不要今天短线，亏了以后就改口长期价值投资。",
    ],
    rule:
      "以什么级别进场，就以什么级别管理交易；不要用小级别波动否定大级别趋势，也不要用大级别故事掩盖小级别错误。",
    note: "不要依赖代码，要建立交易方法。",
    figure: {
      svg: <LevelsDiagram />,
      legend: [
        { term: "日线买", desc: "按日线结构止损，不被分钟线吓跑。" },
        { term: "周线买", desc: "容忍日线波动，但尊重周线破坏。" },
        { term: "月线买", desc: "买点要靠近低位，仓位和耐心都要匹配。" },
      ],
    },
  },
  {
    id: "trading-rules",
    title: "交易规则速查",
    paragraphs: [
      "最后是几条写死的规则——不是技巧，是 A 股的“游戏规则”，记住能少踩坑。",
    ],
    list: [
      { term: "T+1", desc: "今天买入的股票，最快明天才能卖。" },
      { term: "1 手 = 100 股", desc: "买入至少 1 手，也就是 100 股起。" },
      { term: "涨跌停", desc: "主板 ±10%、创业板/科创板 ±20%、ST 股 ±5%。" },
      { term: "集合竞价", desc: "9:15–9:25 集中撮合出开盘价，9:20 后不能撤单。" },
      { term: "XD / XR / DR", desc: "名字前缀 = 除息 / 除权 / 除权除息，当天已分红送股。" },
      { term: "ST / *ST", desc: "风险警示股，波动受限、风险更高。" },
    ],
    note: "规则会调整，实际以交易所与券商公告为准。",
    figure: {
      svg: <TradingClockDiagram />,
      caption: "图例：一个交易日的时段划分——只有连续竞价时段才是买卖实时撮合。",
    },
  },
];

const tocItems: TocItem[] = sections.map((section) => ({
  id: section.id,
  title: section.title,
  level: 2 as const,
}));

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Toc items={tocItems} />
      <main className="px-8 py-12">
        <div className="mx-auto max-w-[43.25rem]">
          <header className="mb-16">
            <p className="text-sm font-semibold text-foreground leading-tight">A股基础图解</p>
            <p className="text-sm text-muted leading-tight mt-0.5">Beginner Trading Notes</p>
          </header>

          <article className="typography-prose">
            {sections.map((section) => (
              <section key={section.id} className="mb-16">
                <h2 id={section.id}>{section.title}</h2>
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
                {section.list && (
                  <ul className="grid gap-2 list-none pl-0 my-6">
                    {section.list.map((item) => (
                      <li key={item.term}>
                        <strong className="text-foreground font-semibold">{item.term}</strong>
                        {"："}
                        {item.desc}
                      </li>
                    ))}
                  </ul>
                )}
                {section.rule && (
                  <div className="border-l-[3px] border-foreground pl-4 text-[15px] text-muted my-6">
                    {section.rule}
                  </div>
                )}
                {section.note && (
                  <aside className="border-l border-border pl-4 text-sm text-muted mb-6">
                    {section.note}
                  </aside>
                )}

                <DiagramFigure
                  caption={section.figure.caption}
                  legend={section.figure.legend}
                  svg={section.figure.svg}
                />
              </section>
            ))}
          </article>

          <p className="text-xs text-muted mt-20">
            本教程基于已整理的股票相关内容做理念归纳，只用于学习交易框架，不构成任何投资建议。
          </p>
        </div>
      </main>
    </div>
  );
}
