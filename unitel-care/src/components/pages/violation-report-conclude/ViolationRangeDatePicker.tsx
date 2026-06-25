import * as React from 'react';
import { CalendarIcon, XIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { addDays, endOfDay, format, parse, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import type { DayPicker, DateRange } from 'react-day-picker';
import { enUS, vi } from 'date-fns/locale';
import i18n from '@/i18n';

const localeMap = { vi, en: enUS };
type AppLang = 'vi' | 'en';

interface ViolationRangeDatePickerProps extends Omit<
  React.ComponentProps<typeof DayPicker>,
  'mode' | 'selected' | 'onSelect' | 'disabled'
> {
  placeholder?: string;
  formatTemplate?: string;
  value?: { from: string; to: string };
  onChange: (range: { from: string; to: string }) => void;
  maxRangeDays?: number;
  /** Max days into the future selectable from today. Omit to allow any future date. */
  maxFutureDays?: number;
  enableClear?: boolean;
}

export function ViolationRangeDatePicker({
  onChange,
  placeholder = 'Select date range',
  value,
  formatTemplate = 'dd/MM/yyyy',
  maxRangeDays,
  maxFutureDays = 0,
  enableClear = true,
  ...restProps
}: ViolationRangeDatePickerProps) {
  const [range, setRange] = React.useState<DateRange>({ from: undefined, to: undefined });
  const [open, setOpen] = React.useState(false);
  const currentLang = i18n.language as AppLang;

  // CRITICAL: depend on primitive strings, NOT the value object reference.
  // Using `value` (object) as dep causes infinite loop:
  //   onChange → parent re-renders → new object ref → effect fires → setRange → onChange → ...
  const valueFrom = value?.from ?? '';
  const valueTo = value?.to ?? '';

  React.useEffect(() => {
    if (!valueFrom && !valueTo) {
      setRange({ from: undefined, to: undefined });
      return;
    }
    setRange({
      from: valueFrom ? parse(valueFrom, formatTemplate, new Date()) : undefined,
      to: valueTo ? parse(valueTo, formatTemplate, new Date()) : undefined,
    });
  }, [valueFrom, valueTo, formatTemplate]);

  // Disabled logic:
  //   - Enforces maxFutureDays from today (both phases).
  //   - When picking `to` (from set, to not yet chosen): only blocks dates BEYOND maxRangeDays
  //     forward from `from`. Past dates are intentionally NOT blocked — handleRangeSelect
  //     auto-swaps them so from ≤ to is always maintained.
  const isDateDisabled = React.useCallback(
    (date: Date): boolean => {
      const d = startOfDay(date);

      if (maxFutureDays !== undefined && d > addDays(startOfDay(new Date()), maxFutureDays)) {
        return true;
      }

      if (range.from && !range.to && maxRangeDays !== undefined) {
        if (d > addDays(startOfDay(range.from), maxRangeDays)) {
          return true;
        }
      }

      return false;
    },
    [range.from, range.to, maxRangeDays, maxFutureDays]
  );

  const handleClearRange = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setRange({ from: undefined, to: undefined });
      onChange({ from: '', to: '' });
      setOpen(false);
    },
    [onChange]
  );

  const handleRangeSelect = React.useCallback(
    (selected?: DateRange) => {
      const hadCompleteRange = !!(range.from && range.to);
      const isSingleDateClick =
        selected?.from &&
        selected?.to &&
        format(selected.from, 'yyyy-MM-dd') === format(selected.to, 'yyyy-MM-dd');

      // Strip `to` when starting fresh or restarting after a complete range.
      const shouldResetToFrom = isSingleDateClick && (!range.from || hadCompleteRange);

      let effective: { from: Date | undefined; to?: Date } = shouldResetToFrom
        ? { from: selected!.from, to: undefined }
        : (selected ?? { from: undefined, to: undefined });

      // Auto-swap: if to < from, swap so from is always the earlier date.
      if (effective.from && effective.to && effective.to < effective.from) {
        effective = { from: effective.to, to: effective.from };
      }

      // Enforce maxRangeDays after potential swap.
      if (effective.from && effective.to && maxRangeDays !== undefined) {
        const fromDay = startOfDay(effective.from);
        const toDay = startOfDay(effective.to);
        if (toDay > addDays(fromDay, maxRangeDays)) {
          // Range too wide — keep from, let user re-pick to.
          effective = { from: effective.from, to: undefined };
        }
      }

      // Defensive guard: reject `to` exceeding future limit.
      // Inlined here — avoids depending on `isDateDisabled` (stale closure risk).
      if (effective.to && maxFutureDays !== undefined) {
        if (startOfDay(effective.to) > addDays(startOfDay(new Date()), maxFutureDays)) {
          effective = { from: effective.from, to: undefined };
        }
      }

      setRange(effective);
      onChange({
        from: effective.from ? format(startOfDay(effective.from), formatTemplate) : '',
        to: effective.to ? format(endOfDay(effective.to), formatTemplate) : '',
      });
    },
    [range.from, range.to, maxRangeDays, maxFutureDays, onChange, formatTemplate]
  );

  const toYear = React.useMemo(
    () =>
      maxFutureDays !== undefined
        ? addDays(new Date(), maxFutureDays).getFullYear()
        : new Date().getFullYear() + 30,
    [maxFutureDays]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className='relative w-full'>
          <Input
            readOnly
            value={
              range.from && range.to
                ? `${format(range.from, formatTemplate)} - ${format(range.to, formatTemplate)}`
                : range.from
                  ? `${format(range.from, formatTemplate)} - `
                  : ''
            }
            placeholder={placeholder}
            className={cn(
              'w-full pr-10 font-normal cursor-pointer',
              !range.from && 'text-muted-foreground'
            )}
          />

          {(range.from || range.to) && enableClear && (
            <XIcon
              className='absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground'
              onClick={handleClearRange}
            />
          )}

          <CalendarIcon className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
        </div>
      </PopoverTrigger>

      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='range'
          selected={range}
          onSelect={handleRangeSelect}
          captionLayout='dropdown'
          fromYear={1930}
          toYear={toYear}
          locale={localeMap[currentLang]}
          disabled={isDateDisabled}
          formatters={{
            formatMonthDropdown: (date) => format(date, 'LLL', { locale: localeMap[currentLang] }),
          }}
          {...restProps}
        />
      </PopoverContent>
    </Popover>
  );
}
