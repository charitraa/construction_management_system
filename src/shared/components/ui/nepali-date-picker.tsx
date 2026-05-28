import * as React from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  MAX_BS_YEAR,
  MIN_BS_YEAR,
  NEPALI_MONTHS,
  NEPALI_WEEKDAYS_MIN,
  bsMonthLength,
  bsToIso,
  bsWeekday,
  formatBsDate,
  isoToBs,
  toNepaliDigits,
  todayBs,
} from "@/shared/lib/nepaliDate";

export interface NepaliDatePickerProps {
  /** Selected date as an AD ISO "YYYY-MM-DD" string (empty for none). */
  value?: string;
  /** Called with the new AD ISO "YYYY-MM-DD" string (or "" when cleared). */
  onChange: (value: string) => void;
  /** Earliest selectable date, AD ISO "YYYY-MM-DD". */
  min?: string;
  /** Latest selectable date, AD ISO "YYYY-MM-DD". */
  max?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Show a clear button when a date is selected. */
  clearable?: boolean;
  /** Classes for the trigger button. */
  className?: string;
  id?: string;
}

const YEARS = Array.from(
  { length: MAX_BS_YEAR - MIN_BS_YEAR + 1 },
  (_, i) => MIN_BS_YEAR + i,
);

export function NepaliDatePicker({
  value,
  onChange,
  min,
  max,
  placeholder = "मिति छान्नुहोस्",
  disabled,
  clearable,
  className,
  id,
}: NepaliDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const selected = React.useMemo(() => isoToBs(value), [value]);

  const [view, setView] = React.useState(() => {
    const base = selected ?? todayBs();
    return { year: base.year, month: base.month };
  });

  // Keep the visible month in sync with the selected value when it changes.
  React.useEffect(() => {
    if (selected) setView({ year: selected.year, month: selected.month });
  }, [selected?.year, selected?.month]);

  const goToMonth = (year: number, month: number) => {
    let y = year;
    let m = month;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    if (y < MIN_BS_YEAR || y > MAX_BS_YEAR) return;
    setView({ year: y, month: m });
  };

  const isDisabledIso = (iso: string) => {
    if (min && iso < min) return true;
    if (max && iso > max) return true;
    return false;
  };

  const handleSelect = (day: number) => {
    const iso = bsToIso(view.year, view.month, day);
    if (isDisabledIso(iso)) return;
    onChange(iso);
    setOpen(false);
  };

  const handleToday = () => {
    const t = todayBs();
    const iso = bsToIso(t.year, t.month, t.day);
    if (isDisabledIso(iso)) return;
    setView({ year: t.year, month: t.month });
    onChange(iso);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const monthLength = bsMonthLength(view.year, view.month);
  const firstWeekday = bsWeekday(view.year, view.month, 1);
  const today = todayBs();

  const label = value ? formatBsDate(value) : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          className={cn(
            "flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-sm transition-all focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
          <span className={cn("flex-1 truncate", !value && "text-slate-400")}>
            {label}
          </span>
          {clearable && value ? (
            <span
              role="button"
              tabIndex={-1}
              onClick={handleClear}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-3" align="start">
        <div className="mb-3 flex items-center gap-2">
          <button
            type="button"
            aria-label="अघिल्लो महिना"
            onClick={() => goToMonth(view.year, view.month - 1)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
            disabled={view.year === MIN_BS_YEAR && view.month === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <select
            value={view.month}
            onChange={(e) => goToMonth(view.year, Number(e.target.value))}
            className="flex-1 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          >
            {NEPALI_MONTHS.map((name, i) => (
              <option key={name} value={i + 1}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={view.year}
            onChange={(e) => goToMonth(Number(e.target.value), view.month)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {toNepaliDigits(y)}
              </option>
            ))}
          </select>

          <button
            type="button"
            aria-label="अर्को महिना"
            onClick={() => goToMonth(view.year, view.month + 1)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
            disabled={view.year === MAX_BS_YEAR && view.month === 12}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {NEPALI_WEEKDAYS_MIN.map((wd, i) => (
            <div
              key={wd + i}
              className={cn(
                "py-1 text-center text-xs font-semibold",
                i === 6 ? "text-rose-500" : "text-slate-400",
              )}
            >
              {wd}
            </div>
          ))}

          {Array.from({ length: firstWeekday }).map((_, i) => (
            <div key={`blank-${i}`} />
          ))}

          {Array.from({ length: monthLength }, (_, i) => i + 1).map((day) => {
            const iso = bsToIso(view.year, view.month, day);
            const isSelected =
              selected != null &&
              selected.year === view.year &&
              selected.month === view.month &&
              selected.day === day;
            const isToday =
              today.year === view.year &&
              today.month === view.month &&
              today.day === day;
            const dayDisabled = isDisabledIso(iso);
            const weekday = (firstWeekday + day - 1) % 7;

            return (
              <button
                key={day}
                type="button"
                disabled={dayDisabled}
                onClick={() => handleSelect(day)}
                className={cn(
                  "flex h-9 items-center justify-center rounded-md text-sm transition-colors",
                  isSelected
                    ? "bg-slate-900 font-semibold text-white hover:bg-slate-900"
                    : "hover:bg-slate-100",
                  !isSelected && isToday && "ring-1 ring-slate-300",
                  !isSelected && weekday === 6 && "text-rose-500",
                  dayDisabled &&
                    "cursor-not-allowed text-slate-300 hover:bg-transparent",
                )}
              >
                {toNepaliDigits(day)}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
          <span className="text-xs text-slate-400">
            {value ? formatBsDate(value, { adHint: true }) : "—"}
          </span>
          <button
            type="button"
            onClick={handleToday}
            className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
          >
            आज
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

NepaliDatePicker.displayName = "NepaliDatePicker";
