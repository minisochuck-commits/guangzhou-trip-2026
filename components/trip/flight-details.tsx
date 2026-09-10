"use client";

import {
  AIRPORTS,
  BAGGAGE,
  BAGGAGE_SCOPE,
  BAGGAGE_SHORT_CAVEAT,
  BAGGAGE_VERIFIED,
  type AirportCode,
  type BaggageProfile,
  type FlightPoint,
  type FlightSegment,
  type Lang,
} from "@/lib/trip-data";
import {
  journeysForFlights,
  legsOf,
  routeHeadline,
  shortDuration,
  transferCityLabel,
  transferMinutes,
  type Journey,
} from "@/lib/journeys";
import { UI, shortDateLabel, t } from "@/lib/trip-i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Ltr, SourceLink } from "./ui";

/** 日期 · 时刻 · 城市 三字码 航站楼。时区靠整块底部一条脚注说明，不逐行重复。 */
function PointLine({
  label,
  point,
  lang,
}: {
  label: string;
  point: FlightPoint | { iata: AirportCode; terminal: string; date: string; time: string };
  lang: Lang;
}) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-1.5 text-base leading-6 text-navy">
      <span className="shrink-0 text-sm font-medium text-navy-soft">{label}</span>
      <span className="text-sm text-navy-soft">{shortDateLabel(point.date, lang)}</span>
      <Ltr className="font-semibold">{point.time}</Ltr>
      <span>{t(AIRPORTS[point.iata].city, lang)}</span>
      <Ltr className="text-sm text-navy-soft">{point.iata}</Ltr>
      <Ltr className="font-semibold">{point.terminal}</Ltr>
    </p>
  );
}

function LegBlock({ flight, lang }: { flight: FlightSegment; lang: Lang }) {
  return (
    <div className="rounded-lg bg-white px-3 py-2.5">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <Ltr className="rounded-md bg-navy px-2 py-0.5 text-base font-semibold tracking-wide text-white">
          {flight.code}
        </Ltr>
        <span className="text-sm text-navy-soft">{t(flight.cabin, lang)}</span>
        {flight.from.date !== flight.to.date ? (
          <span className="rounded-md bg-miniso-red-tint px-2 py-0.5 text-sm font-medium text-miniso-red-strong">
            {t(UI.nextDay, lang)}
          </span>
        ) : null}
      </div>
      <PointLine label={t(UI.journey.depart, lang)} point={flight.from} lang={lang} />
      <PointLine label={t(UI.journey.arrive, lang)} point={flight.to} lang={lang} />
    </div>
  );
}

/** 两段之间一条：成都天府中转 · 2 小时 50 分 · T1 → T2 */
function TransferStrip({
  from,
  to,
  lang,
}: {
  from: FlightSegment;
  to: FlightSegment;
  lang: Lang;
}) {
  const minutes = transferMinutes(from.to, to.from);
  const overnight = from.to.date !== to.from.date;
  return (
    <p className="flex flex-wrap items-center gap-x-1.5 px-3 text-sm leading-6 text-navy-soft">
      <span className="font-medium text-navy">
        {transferCityLabel(from.to.iata, lang)}
      </span>
      <span className="opacity-40">·</span>
      <span>{t(shortDuration(minutes), lang)}</span>
      <span className="opacity-40">·</span>
      <Ltr className="font-semibold text-navy">
        {`${from.to.terminal} → ${to.from.terminal}`}
      </Ltr>
      {overnight ? (
        <span className="rounded-md bg-miniso-red-tint px-1.5 text-sm font-medium text-miniso-red-strong">
          {t(UI.journey.overnight, lang)}
        </span>
      ) : null}
    </p>
  );
}

/**
 * 一条旅程：抬头一次 → 到机场一行 → 各航段（中间夹中转条）→ 时区脚注一次。
 * 不编号、不重复到达时刻、不再单列「抵达」步骤 —— 最后一段的抵达行就是终点。
 */
function JourneyBlock({ journey, lang }: { journey: Journey; lang: Lang }) {
  const legs = legsOf(journey);
  if (legs.length === 0) return null;

  return (
    <section className="space-y-2 rounded-lg bg-navy-tint px-3 py-3">
      <p className="text-base font-semibold leading-6 text-navy">
        {routeHeadline(journey, lang)}
      </p>

      <PointLine
        label={t(UI.journey.report, lang)}
        point={journey.report}
        lang={lang}
      />

      <div className="space-y-2">
        {legs.map((leg, index) => (
          <div key={leg.id} className="space-y-2">
            <LegBlock flight={leg} lang={lang} />
            {legs[index + 1] ? (
              <TransferStrip from={leg} to={legs[index + 1]} lang={lang} />
            ) : null}
          </div>
        ))}
      </div>

      <p className="text-sm leading-5 text-navy-soft/80">
        {t(UI.journey.localTimeNote, lang)}
      </p>
    </section>
  );
}

/**
 * 行李额：主区只留「票面件数 + 官网重量 + 一句待核实」，
 * 尺寸、来源链接、查阅日期全部收进一个折叠。标题就是承运人 + 舱位，不再另加通用抬头。
 */
export function BaggageLines({
  profile,
  lang,
  fromCairo = false,
}: {
  profile: BaggageProfile;
  lang: Lang;
  /** 只有从开罗出发的那一段才用「开罗出发」抬头；回程和指南页用通用说法。 */
  fromCairo?: boolean;
}) {
  const info = BAGGAGE[profile];
  const opening =
    fromCairo && info.openingFromCairo ? info.openingFromCairo : info.opening;
  const [primary, ...folded] = info.lines;

  return (
    <div className="space-y-1">
      <p className="text-base font-semibold leading-6 text-navy">
        {t(info.title, lang)}
      </p>
      <p className="text-base leading-relaxed text-navy">{t(opening, lang)}</p>
      {primary ? (
        <p className="text-base leading-relaxed text-navy-soft">
          {t(primary, lang)}
        </p>
      ) : null}
      {info.caveat ? (
        <p className="text-sm leading-5 text-miniso-red-strong">
          {t(BAGGAGE_SHORT_CAVEAT, lang)}
        </p>
      ) : null}

      <Accordion type="single" collapsible>
        <AccordionItem value="rules" className="border-b-0">
          <AccordionTrigger className="min-h-11 py-2 text-sm font-medium text-navy-soft hover:no-underline">
            {t(UI.baggageRules, lang)}
          </AccordionTrigger>
          <AccordionContent className="space-y-1 pb-2">
            {folded.map((line, index) => (
              <p key={index} className="text-base leading-relaxed text-navy-soft">
                {t(line, lang)}
              </p>
            ))}
            <p className="text-sm leading-5 text-navy-soft">
              {t(info.caveat ?? BAGGAGE_VERIFIED, lang)}
            </p>
            {info.caveat ? (
              <p className="text-sm leading-5 text-navy-soft/80">
                {t(BAGGAGE_SCOPE, lang)}
              </p>
            ) : null}
            <ul className="space-y-1 pt-1">
              {info.sources.map((source) => (
                <li key={source.url}>
                  <SourceLink label={source.label} url={source.url} lang={lang} />
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

/**
 * 完整旅程 + 一段行李额。
 *
 * `ids` 是 Row 上挂的航段 id，这里先解析成整条旅程 ——
 * 从去程任意一天进来看到的都是同一条完整路线，不只是挂着的那一段。
 */
export function FlightDetails({ ids, lang }: { ids: string[]; lang: Lang }) {
  const journeys = journeysForFlights(ids);
  if (journeys.length === 0) return null;

  const legs = journeys.flatMap(legsOf);
  const profiles = [...new Set(legs.map((leg) => leg.baggage))];

  return (
    <div className="space-y-3">
      {journeys.map((journey) => (
        <JourneyBlock key={journey.id} journey={journey} lang={lang} />
      ))}

      <div className="space-y-3 rounded-lg border border-line px-3 py-3">
        {profiles.map((profile) => (
          <BaggageLines
            key={profile}
            profile={profile}
            lang={lang}
            // 这条旅程里有没有真的从开罗起飞的一段？只有去程才有。
            fromCairo={legs.some(
              (leg) => leg.baggage === profile && leg.from.iata === "CAI",
            )}
          />
        ))}
      </div>
    </div>
  );
}
