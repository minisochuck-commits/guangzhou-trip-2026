"use client";

import { ArrowRightIcon } from "lucide-react";

import {
  AIRPORTS,
  BAGGAGE,
  BAGGAGE_VERIFIED,
  FLIGHT_MAP,
  type BaggageProfile,
  type FlightPoint,
  type Lang,
} from "@/lib/trip-data";
import { UI, shortDateLabel, t } from "@/lib/trip-i18n";
import { Ltr, SourceLink } from "./ui";

function Endpoint({ point, lang }: { point: FlightPoint; lang: Lang }) {
  const airport = AIRPORTS[point.iata];
  return (
    <div className="min-w-0 flex-1">
      <Ltr className="text-lg font-semibold leading-6 text-navy">
        {point.time}
      </Ltr>
      <div className="truncate text-base leading-6 text-navy">
        <Ltr className="font-semibold">{`${point.iata} ${point.terminal}`}</Ltr>
        <span className="mx-1 opacity-40">·</span>
        {t(airport.city, lang)}
      </div>
      <div className="text-sm leading-5 text-navy-soft">
        {shortDateLabel(point.date, lang)}
        <span className="mx-1 opacity-40">·</span>
        {t(UI.tz[airport.tz], lang)}
      </div>
    </div>
  );
}

export function BaggageLines({
  profile,
  lang,
  withSources = false,
}: {
  profile: BaggageProfile;
  lang: Lang;
  withSources?: boolean;
}) {
  const info = BAGGAGE[profile];
  return (
    <div className="space-y-1">
      <p className="text-base font-medium leading-6 text-navy">
        {t(info.title, lang)}
      </p>
      <p className="text-base leading-relaxed text-navy-soft">
        {t(info.checked, lang)}
      </p>
      <p className="text-base leading-relaxed text-navy-soft">
        {t(info.cabin, lang)}
      </p>
      <p className="text-base leading-relaxed text-navy-soft">
        {t(info.note, lang)}
      </p>
      <p className="text-sm leading-5 text-navy-soft/80">
        {t(BAGGAGE_VERIFIED, lang)}
      </p>
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

/** 某几段航班的详情：时刻、航站楼、时区，以及这几段适用的免费行李额。 */
export function FlightDetails({ ids, lang }: { ids: string[]; lang: Lang }) {
  const flights = ids.map((id) => FLIGHT_MAP[id]).filter(Boolean);
  if (flights.length === 0) return null;

  const profiles = [...new Set(flights.map((flight) => flight.baggage))];

  return (
    <div className="space-y-3">
      {flights.map((flight) => (
        <div key={flight.id} className="rounded-lg bg-navy-tint px-3 py-3">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Ltr className="rounded-md bg-navy px-2 py-0.5 text-base font-semibold tracking-wide text-white">
              {flight.code}
            </Ltr>
            <span className="text-sm font-medium text-navy-soft">
              {t(flight.cabin, lang)}
            </span>
            {flight.from.date !== flight.to.date ? (
              <span className="rounded-md bg-white px-2 py-0.5 text-sm font-medium text-miniso-red-strong">
                {t(UI.nextDay, lang)}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Endpoint point={flight.from} lang={lang} />
            <ArrowRightIcon
              aria-hidden="true"
              className="size-5 shrink-0 text-navy/35 rtl:rotate-180"
            />
            <Endpoint point={flight.to} lang={lang} />
          </div>
        </div>
      ))}

      <div className="rounded-lg border border-line px-3 py-3">
        <p className="mb-1.5 text-sm font-semibold uppercase tracking-wide text-navy-soft">
          {t(UI.baggage, lang)}
        </p>
        <div className="space-y-3">
          {profiles.map((profile) => (
            <BaggageLines key={profile} profile={profile} lang={lang} />
          ))}
        </div>
      </div>
    </div>
  );
}
