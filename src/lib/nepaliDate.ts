// Bikram Sambat (Nepali) calendar utilities.
//
// Dates are STORED in AD (Gregorian) ISO "YYYY-MM-DD" strings everywhere in the
// app and backend. This module is purely a display/input conversion layer: it
// converts those AD strings to/from Bikram Sambat for rendering in Devanagari.
//
// Anchor: BS 2000/01/01 == AD 1943-04-14. Data covers BS 2000..2090.

export const MIN_BS_YEAR = 2000;
export const MAX_BS_YEAR = 2090;

// Days in each of the 12 months, one row per BS year starting at MIN_BS_YEAR.
const BS_MONTH_DAYS: number[][] = [
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2000
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2001
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2002
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2003
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2004
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2005
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2006
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2007
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31], // 2008
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2009
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2010
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2011
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2012
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2013
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2014
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2015
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2016
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2017
  [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2018
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2019
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2020
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2021
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2022
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2023
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2024
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2025
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2026
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2027
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2028
  [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30], // 2029
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2030
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2031
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2032
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2033
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2034
  [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31], // 2035
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2036
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2037
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2038
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2039
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2040
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2041
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2042
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2043
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2044
  [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2045
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2046
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2047
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2048
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2049
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2050
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2051
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2052
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2053
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2054
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2055
  [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30], // 2056
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2057
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2058
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2059
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2060
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2061
  [30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31], // 2062
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2063
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2064
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2065
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31], // 2066
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2067
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2068
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2069
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2070
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2071
  [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2072
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2073
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2074
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2075
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2076
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2077
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2078
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2079
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2080
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2081
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2082
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2083
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2084
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2085
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2086
  [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30], // 2087
  [30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30], // 2088
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30], // 2089
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30], // 2090
];

// AD date that corresponds to BS 2000/01/01.
const ANCHOR_AD_UTC = Date.UTC(1943, 3, 14); // 1943-04-14
const MS_PER_DAY = 86_400_000;

export const NEPALI_MONTHS = [
  "बैशाख",
  "जेठ",
  "असार",
  "साउन",
  "भदौ",
  "असोज",
  "कात्तिक",
  "मंसिर",
  "पुस",
  "माघ",
  "फागुन",
  "चैत",
];

// Sunday-first, matching JS getUTCDay() / Nepali week.
export const NEPALI_WEEKDAYS_SHORT = [
  "आइत",
  "सोम",
  "मंगल",
  "बुध",
  "बिहि",
  "शुक्र",
  "शनि",
];

export const NEPALI_WEEKDAYS_MIN = ["आ", "सो", "मं", "बु", "बि", "शु", "श"];

const NEPALI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

export interface BsDate {
  year: number;
  /** 1-12 */
  month: number;
  /** 1-32 */
  day: number;
}

export function toNepaliDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => NEPALI_DIGITS[Number(d)]);
}

/** Number of days in a given BS month (month is 1-12). */
export function bsMonthLength(year: number, month: number): number {
  const row = BS_MONTH_DAYS[year - MIN_BS_YEAR];
  if (!row) return 30;
  return row[month - 1];
}

function isBsYearInRange(year: number): boolean {
  return year >= MIN_BS_YEAR && year <= MAX_BS_YEAR;
}

/** Total BS days strictly before the given BS date, counted from BS 2000/01/01. */
function bsDaysSinceAnchor(year: number, month: number, day: number): number {
  let days = 0;
  for (let y = MIN_BS_YEAR; y < year; y++) {
    const row = BS_MONTH_DAYS[y - MIN_BS_YEAR];
    for (let m = 0; m < 12; m++) days += row[m];
  }
  const row = BS_MONTH_DAYS[year - MIN_BS_YEAR];
  for (let m = 0; m < month - 1; m++) days += row[m];
  return days + (day - 1);
}

/** Convert a BS date to an AD Date (UTC midnight). */
export function bsToAdDate(year: number, month: number, day: number): Date {
  const offset = bsDaysSinceAnchor(year, month, day);
  return new Date(ANCHOR_AD_UTC + offset * MS_PER_DAY);
}

/** Convert a BS date to an AD ISO "YYYY-MM-DD" string. */
export function bsToIso(year: number, month: number, day: number): string {
  return adDateToIso(bsToAdDate(year, month, day));
}

/** Convert an AD Date (read in UTC) to a BS date. */
export function adDateToBs(date: Date): BsDate {
  const targetUtc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  let offset = Math.round((targetUtc - ANCHOR_AD_UTC) / MS_PER_DAY);

  let year = MIN_BS_YEAR;
  while (year <= MAX_BS_YEAR) {
    const row = BS_MONTH_DAYS[year - MIN_BS_YEAR];
    const daysInYear = row.reduce((a, b) => a + b, 0);
    if (offset < daysInYear) break;
    offset -= daysInYear;
    year++;
  }

  let month = 1;
  const row = BS_MONTH_DAYS[year - MIN_BS_YEAR];
  for (let m = 0; m < 12; m++) {
    if (offset < row[m]) {
      month = m + 1;
      break;
    }
    offset -= row[m];
  }

  return { year, month, day: offset + 1 };
}

/** Format an AD Date as an ISO "YYYY-MM-DD" string (UTC components). */
function adDateToIso(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse an ISO "YYYY-MM-DD" string into a UTC Date, or null if invalid. */
function isoToAdDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Convert an AD ISO "YYYY-MM-DD" string to a BS date, or null if out of range. */
export function isoToBs(iso: string | null | undefined): BsDate | null {
  if (!iso) return null;
  const date = isoToAdDate(iso);
  if (!date) return null;
  const bs = adDateToBs(date);
  if (!isBsYearInRange(bs.year)) return null;
  return bs;
}

/** Today's date as a BS date. */
export function todayBs(): BsDate {
  return adDateToBs(new Date());
}

/** Weekday index (0 = Sunday) for a BS date. */
export function bsWeekday(year: number, month: number, day: number): number {
  return bsToAdDate(year, month, day).getUTCDay();
}

export interface FormatBsOptions {
  /** Include the weekday name, e.g. "बुध, २०८३ जेठ १४". */
  weekday?: boolean;
  /** Append "(BS)"-style AD hint, e.g. "(28 May 2026)". */
  adHint?: boolean;
  /** Omit the year. */
  noYear?: boolean;
}

const AD_HINT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Format an AD ISO "YYYY-MM-DD" string as a Devanagari Bikram Sambat string,
 * e.g. "२०८३ जेठ १४". Returns "" for empty/invalid input.
 */
export function formatBsDate(
  iso: string | null | undefined,
  options: FormatBsOptions = {},
): string {
  const bs = isoToBs(iso);
  if (!bs) return "";

  const dayStr = toNepaliDigits(bs.day);
  const monthStr = NEPALI_MONTHS[bs.month - 1];
  const parts: string[] = [];

  if (options.weekday) {
    const wd = bsWeekday(bs.year, bs.month, bs.day);
    parts.push(`${NEPALI_WEEKDAYS_SHORT[wd]},`);
  }
  if (!options.noYear) parts.push(toNepaliDigits(bs.year));
  parts.push(monthStr, dayStr);

  let result = parts.join(" ");

  if (options.adHint) {
    const ad = isoToAdDate(iso as string)!;
    result += ` (${ad.getUTCDate()} ${AD_HINT_MONTHS[ad.getUTCMonth()]} ${ad.getUTCFullYear()})`;
  }

  return result;
}

/** Format an AD ISO date as a Devanagari BS month + year, e.g. "जेठ २०८३". */
export function formatBsMonthYear(iso: string | null | undefined): string {
  const bs = isoToBs(iso);
  if (!bs) return "";
  return `${NEPALI_MONTHS[bs.month - 1]} ${toNepaliDigits(bs.year)}`;
}

/**
 * Format an ISO datetime string (with time) as a Devanagari BS date plus the
 * local time, e.g. "२०८३ जेठ १४, १०:३० राति". Used for audit timestamps.
 */
export function formatBsDateTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  const localIso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const datePart = formatBsDate(localIso);
  if (!datePart) return "";

  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${datePart}, ${toNepaliDigits(hour)}:${toNepaliDigits(minute)}`;
}
