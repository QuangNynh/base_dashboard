import * as React from 'react';
import { CalendarIcon, XIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import type { DayPicker } from 'react-day-picker';
import { enUS, vi } from 'date-fns/locale';
import i18n from '@/i18n';

const localeMap = {
  vi: vi,
  en: enUS,
};
type AppLang = 'vi' | 'en';

interface DatePickerProps extends Omit<
  React.ComponentProps<typeof DayPicker>,
  'mode' | 'selected' | 'onSelect'
> {
  placeholder?: string;
  formatTemplate?: string;
  value?: string;
  onChange: (date: string) => void;
  className?: string;
}

export function DatePicker({
  onChange,
  placeholder = 'Select date',
  formatTemplate = 'dd/MM/yyyy',
  value,
  className,
  ...props
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [open, setOpen] = React.useState(false);
  const currentLang = i18n.language as AppLang;

  // Sync external value -> internal state
  React.useEffect(() => {
    if (!value) {
      setDate(undefined);
      return;
    }

    setDate(parse(value, formatTemplate, new Date()));
  }, [value, formatTemplate]);

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDate(undefined);
    onChange('');
    setOpen(false);
  };

  const handleDateSelect = (selected?: Date) => {
    setDate(selected);

    onChange(selected ? format(selected, formatTemplate) : '');

    if (selected) {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className='relative w-full'>
          <Input
            readOnly
            value={date ? format(date, formatTemplate) : ''}
            placeholder={placeholder}
            className={cn(
              'w-full pr-10 font-normal cursor-pointer',
              !date && 'text-muted-foreground',
              className
            )}
          />

          {date && (
            <XIcon
              className='absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground'
              onClick={handleClearDate}
            />
          )}

          <CalendarIcon className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
        </div>
      </PopoverTrigger>

      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={handleDateSelect}
          captionLayout='dropdown'
          fromYear={1930}
          toYear={new Date().getFullYear() + 30}
          locale={localeMap[currentLang]}
          formatters={{
            formatMonthDropdown: (date) => format(date, 'LLL', { locale: localeMap[currentLang] }),
          }}
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
}
