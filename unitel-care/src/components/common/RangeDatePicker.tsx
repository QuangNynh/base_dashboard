import * as React from 'react';
import { CalendarIcon, XIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { endOfDay, format, isValid, parse, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import type { DayPicker, DateRange } from 'react-day-picker';
import { enUS, vi } from 'date-fns/locale';
import i18n from '@/i18n';

const localeMap = {
  vi: vi,
  en: enUS,
};
type AppLang = 'vi' | 'en';

interface RangeDatePickerProps extends Omit<
  React.ComponentProps<typeof DayPicker>,
  'mode' | 'selected' | 'onSelect'
> {
  placeholder?: string;
  formatTemplate?: string;
  value?: {
    from: string;
    to: string;
  };
  onChange: (range: { from: string; to: string }) => void;
  /** Số ngày tối đa được chọn trong khoảng. Nếu có, sau khi chọn ngày bắt đầu,
   *  chỉ cho phép chọn ngày kết thúc trong vòng maxRange ngày kể từ ngày bắt đầu. */
  maxRange?: number;
}

export function RangeDatePicker({
  onChange,
  placeholder = 'Select date range',
  value,
  formatTemplate = 'dd/MM/yyyy',
  maxRange,
  disabled,
  ...props
}: RangeDatePickerProps) {
  const [range, setRange] = React.useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [open, setOpen] = React.useState(false);
  const currentLang = i18n.language as AppLang;

  // Sync external value -> internal state
  React.useEffect(() => {
    if (!value || (!value.from && !value.to)) {
      setRange({ from: undefined, to: undefined });
      return;
    }

    const parsedFrom = value.from ? parse(value.from, formatTemplate, new Date()) : undefined;
    const parsedTo = value.to ? parse(value.to, formatTemplate, new Date()) : undefined;
    setRange({
      from: parsedFrom && isValid(parsedFrom) ? parsedFrom : undefined,
      to: parsedTo && isValid(parsedTo) ? parsedTo : undefined,
    });
  }, [value, formatTemplate]);

  const handleClearRange = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRange({ from: undefined, to: undefined });
    onChange({ from: '', to: '' });
    setOpen(false);
  };

  const handleRangeSelect = (selected?: DateRange) => {
    // react-day-picker fires { from: date, to: date } on the first click
    // → strip `to` so the user must explicitly pick an end date
    const isFirstClick =
      !range.from &&
      selected?.from &&
      selected?.to &&
      format(selected.from, 'yyyy-MM-dd') === format(selected.to, 'yyyy-MM-dd');

    let effective = isFirstClick
      ? { from: selected!.from, to: undefined }
      : (selected ?? { from: undefined, to: undefined });

    // Nếu có maxRange và user chọn to vượt quá giới hạn → cap lại
    if (maxRange && effective.from && effective.to) {
      const maxTo = new Date(effective.from);
      maxTo.setDate(maxTo.getDate() + maxRange - 1);
      if (effective.to > maxTo) {
        effective = { ...effective, to: maxTo };
      }
    }

    setRange(effective);
    onChange({
      from: effective.from ? format(startOfDay(effective.from), formatTemplate) : '',
      to: effective.to ? format(endOfDay(effective.to), formatTemplate) : '',
    });
  };

  /** Các ngày bị disable khi đang chọn khoảng có maxRange */
  const disabledDays = React.useMemo(() => {
    if (!maxRange || !range.from || range.to) return undefined;
    const maxTo = new Date(range.from);
    maxTo.setDate(maxTo.getDate() + maxRange - 1);
    // Disable tất cả ngày sau maxTo
    return { after: maxTo };
  }, [maxRange, range.from, range.to]);

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

          {(range.from || range.to) && (
            <XIcon
              className='absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground'
              onClick={handleClearRange}
            />
          )}

          <CalendarIcon className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
        </div>
      </PopoverTrigger>

      <PopoverContent className='w-auto p-0' side='bottom' align='end' avoidCollisions={false}>
        <Calendar
          mode='range'
          selected={range}
          onSelect={handleRangeSelect}
          captionLayout='dropdown'
          fromYear={1930}
          toYear={new Date().getFullYear() + 30}
          locale={localeMap[currentLang]}
          formatters={{
            formatMonthDropdown: (date) => format(date, 'LLL', { locale: localeMap[currentLang] }),
          }}
          disabled={
            // Merge disabled từ bên ngoài và disabledDays nội bộ (maxRange)
            // react-day-picker chấp nhận array → tất cả điều kiện đều ưu tiên
            disabledDays && disabled ? [disabledDays, disabled].flat() : (disabledDays ?? disabled)
          }
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
}
