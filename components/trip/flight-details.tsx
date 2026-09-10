"use client";

import { ArrowRightIcon } from "lucide-react";

import {
  AIRPORTS,
  BAGGAGE,
  BAGGAGE_SCOPE,
  BAGGAGE_VERIFIED,
  type AirportCode,
  type BaggageProfile,
  type FlightPoint,
  type Lang,
} from "@/lib/trip-data";
import {
  durationLabel,
  journeySteps,
  journeysForFlights,
  legsOf,
  routeHeadline,
  type Journey,
  type JourneyStep,
} from "@/lib/journeys";
import { UI, shortDateLabel, t } from "@/lib/trip-i18n";
import { Ltr, SourceLink } from "./ui";

/** 机场：城市在前、三字码在后，航站楼始终写出来。 */
function Place({
  iata,
  terminal,
  lang,
}: {
  iata: AirportCode;
  terminal: string;
  lang: Lang;
}) {
  return (
    <span className="text-base leading-6 text-navy">
      {t(AIRPORTS[iata].city, lang)}{" "}
      <Ltr className="text-sm font-semibold text-navy-soft">{iata}</Ltr>{" "}
      <Ltr className="font-semibold">{terminal}</Ltr>
    </span>
  );
}

/** 日期 + 当地时刻 + 时区标注。 */
function Stamp({
  date,
  time,
  iata,
  lang,
}: {
  date: string;
  time: string;
  iata: AirportCode;
  lang: Lang;
}) {
  return (
    <span className="text-sm leading-5 text-navy-soft">
      {shortDateLabel(date, lang)}
      <span className="mx-1 opacity-40">·</span>
      <Ltr className="text-base font-semibold text-navy">{time}</Ltr>
      <span className="mx-1 opacity-40">·</span>
      {t(UI.tz[AIRPORTS[iata].tz], lang)}
    </span>
  );
}

function StepShell({
  number,
  label,
  children,
  accent = false,
}: {
  number: number;
  label: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <li className="flex gap-2.5">
      <span
        aria-hidden="true"
        className={
          accent
            ? "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white"
            : "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-navy-tint text-sm font-semibold text-navy-soft"
        }
      >
        <Ltr>{String(number)}</Ltr>
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold uppercase tracking-wide text-navy-soft">
          {label}
        </p>
        {children}
      </div>
    </li>
  );
}

function Step({
  step,
  number,
  lang,
}: {
  step: JourneyStep;
  number: number;
  lang: Lang;
}) {
  if (step.kind === "report") {
    return (
      <StepShell number={number} label={t(UI.journey.report, lang)}>
        <div className="space-y-0.5">
          <Place iata={step.point.iata} terminal={step.point.terminal} lang={lang} />
          <div>
            <Stamp
              date={step.point.date}
              time={step.point.time}
              iata={step.point.iata}
              lang={lang}
            />
          </div>
        </div>
      </StepShell>
    );
  }

  if (step.kind === "transfer") {
    const changes = step.arriveTerminal !== step.departTerminal;
    return (
      <StepShell number={number} label={t(UI.journey.transfer, lang)}>
        <div className="space-y-0.5">
          <p className="text-base leading-6 text-navy">
            {t(AIRPORTS[step.iata].city, lang)}{" "}
            <Ltr className="text-sm font-semibold text-navy-soft">
              {step.iata}
            </Ltr>{" "}
            <Ltr className="font-semibold">
              {`${step.arriveTerminal} → ${step.departTerminal}`}
            </Ltr>
          </p>
          <p className="text-sm leading-5 text-navy-soft">
            {t(durationLabel(step.minutes), lang)}
            <span className="mx-1 opacity-40">·</span>
            {t(
              changes ? UI.journey.changeTerminal : UI.journey.sameTerminal,
              lang,
            )}
          </p>
          {/* 到达和起飞的日期都写出来，跨零点的那一段尤其不能只写时刻；
              两个时刻各自标上是哪一头，不然读者分不清 */}
          <p className="text-sm leading-5 text-navy-soft">
            <span className="me-1 font-medium text-navy">
              {t(UI.journey.transferIn, lang)}
            </span>
            <Stamp
              date={step.arriveDate}
              time={step.arriveTime}
              iata={step.iata}
              lang={lang}
            />
          </p>
          <p className="text-sm leading-5 text-navy-soft">
            <span className="me-1 font-medium text-navy">
              {t(UI.journey.transferOut, lang)}
            </span>
            <Stamp
              date={step.departDate}
              time={step.departTime}
              iata={step.iata}
              lang={lang}
            />
          </p>
          {step.overnight ? (
            <p className="inline-flex rounded-md bg-miniso-red-tint px-2 py-0.5 text-sm font-medium text-miniso-red-strong">
              {t(UI.journey.overnight, lang)}
            </p>
          ) : null}
        </div>
      </StepShell>
    );
  }

  if (step.kind === "arrive") {
    const point: FlightPoint = step.point;
    return (
      <StepShell number={number} label={t(UI.journey.arrive, lang)} accent>
        <div className="space-y-0.5">
          <Place iata={point.iata} terminal={point.terminal} lang={lang} />
          <div>
            <Stamp
              date={point.date}
              time={point.time}
              iata={point.iata}
              lang={lang}
            />
          </div>
        </div>
      </StepShell>
    );
  }

  const { flight, index, total } = step;
  const label =
    total > 1
      ? `${t(UI.journey.leg, lang)} ${index + 1}/${total}`
      : t(UI.journey.leg, lang);

  return (
    <StepShell number={number} label={label} accent>
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Ltr className="rounded-md bg-navy px-2 py-0.5 text-base font-semibold tracking-wide text-white">
            {flight.code}
          </Ltr>
          <span className="text-sm font-medium text-navy-soft">
            {t(flight.cabin, lang)}
          </span>
          {flight.from.date !== flight.to.date ? (
            <span className="rounded-md bg-miniso-red-tint px-2 py-0.5 text-sm font-medium text-miniso-red-strong">
              {t(UI.nextDay, lang)}
            </span>
          ) : null}
        </div>
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1 space-y-0.5">
            <Place
              iata={flight.from.iata}
              terminal={flight.from.terminal}
              lang={lang}
            />
            <div>
              <Stamp
                date={flight.from.date}
                time={flight.from.time}
                iata={flight.from.iata}
                lang={lang}
              />
            </div>
          </div>
          <ArrowRightIcon
            aria-hidden="true"
            className="mt-1 size-5 shrink-0 text-navy/35 rtl:rotate-180"
          />
          <div className="min-w-0 flex-1 space-y-0.5">
            <Place
              iata={flight.to.iata}
              terminal={flight.to.terminal}
              lang={lang}
            />
            <div>
              <Stamp
                date={flight.to.date}
                time={flight.to.time}
                iata={flight.to.iata}
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>
    </StepShell>
  );
}

function JourneyTimeline({ journey, lang }: { journey: Journey; lang: Lang }) {
  const steps = journeySteps(journey);
  if (steps.length === 0) return null;

  return (
    <section className="rounded-lg bg-navy-tint px-3 py-3">
      <p className="mb-2.5 text-base font-semibold leading-6 text-navy">
        {routeHeadline(journey, lang)}
      </p>
      <ol className="space-y-3">
        {steps.map((step, index) => (
          <Step
            key={`${journey.id}-${index}`}
            step={step}
            number={index + 1}
            lang={lang}
          />
        ))}
      </ol>
    </section>
  );
}

export function BaggageLines({
  profile,
  lang,
  withSources = false,
  fromCairo = false,
}: {
  profile: BaggageProfile;
  lang: Lang;
  withSources?: boolean;
  /** 只有从开罗出发的那一段才用「开罗出发」抬头；回程和指南页用通用说法。 */
  fromCairo?: boolean;
}) {
  const info = BAGGAGE[profile];
  const opening =
    fromCairo && info.openingFromCairo ? info.openingFromCairo : info.opening;
  return (
    <div className="space-y-1">
      <p className="text-base font-medium leading-6 text-navy">
        {t(info.title, lang)}
      </p>
      {/* 主行：票面确认的件数 */}
      <p className="text-base font-medium leading-relaxed text-navy">
        {t(opening, lang)}
      </p>
      {/* 次要行：官网标准的重量与尺寸 */}
      {info.lines.map((line, index) => (
        <p key={index} className="text-base leading-relaxed text-navy-soft">
          {t(line, lang)}
        </p>
      ))}
      {/* caveat 已经讲了票面 / 官网 / 没核实，就不再重复 BAGGAGE_VERIFIED 那句 */}
      {info.caveat ? (
        <>
          <p className="text-sm leading-5 text-navy-soft">
            {t(info.caveat, lang)}
          </p>
          <p className="text-sm leading-5 text-navy-soft/80">
            {t(BAGGAGE_SCOPE, lang)}
          </p>
        </>
      ) : (
        <p className="text-sm leading-5 text-navy-soft/80">
          {t(BAGGAGE_VERIFIED, lang)}
        </p>
      )}
      {withSources ? (
        <ul className="space-y-1 pt-1">
          {info.sources.map((source) => (
            <li key={source.url}>
              <SourceLink label={source.label} url={source.url} lang={lang} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * 完整旅程 + 一段紧凑的行李额。
 *
 * `ids` 仍然是 Row 上挂的航段 id，但这里先解析成整条旅程 ——
 * 所以从去程任意一天进来看到的都是「到机场 → 3U3864 → 成都中转 → 3U6701 → 抵达」，
 * 不再只有挂着的那一段。行李额放在整条路线之后，一条旅程一段。
 */
export function FlightDetails({ ids, lang }: { ids: string[]; lang: Lang }) {
  const journeys = journeysForFlights(ids);
  if (journeys.length === 0) return null;

  const legs = journeys.flatMap(legsOf);
  const profiles = [...new Set(legs.map((leg) => leg.baggage))];

  return (
    <div className="space-y-3">
      {journeys.map((journey) => (
        <JourneyTimeline key={journey.id} journey={journey} lang={lang} />
      ))}

      <div className="rounded-lg border border-line px-3 py-3">
        <p className="mb-1.5 text-sm font-semibold uppercase tracking-wide text-navy-soft">
          {t(UI.baggage, lang)}
        </p>
        <div className="space-y-3">
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
    </div>
  );
}
