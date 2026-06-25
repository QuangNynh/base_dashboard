import Loading from '@/components/common/Loading';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { workingDayService, type WorkingDayCalendarItem } from '@/services/workingDayService';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useState } from 'react';
import type { CalendarDay, Modifiers } from 'react-day-picker';
import { useTranslation } from 'react-i18next';
import WorkDaySettingModal from './WorkDaySettingModal';

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  month: i + 1,
}));

const YEAR_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const y = new Date().getFullYear() - 1 + i;
  return { value: String(y), label: String(y) };
});

function makeCustomDay(
  displayMonth: Date,
  calendarMap: Record<string, WorkingDayCalendarItem>,
  onDayClick: (date: Date) => void,
  t: (key: string, options?: Record<string, unknown>) => string
) {
  return function CustomDay({
    day,
  }: {
    day: CalendarDay;
    modifiers: Modifiers;
  } & React.HTMLAttributes<HTMLDivElement>) {
    const date = day.date;
    const key = format(date, 'yyyy-MM-dd');
    const item = calendarMap[key];
    const isOutside = date.getMonth() !== displayMonth.getMonth();
    const isSunday = date.getDay() === 0;
    const isDayOff = item?.is_day_off ?? isSunday;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = date < today;

    const timeLabel =
      item && !item.is_day_off
        ? `${item?.start_time?.slice(0, 5)} → ${item?.end_time?.slice(0, 5)}`
        : null;

    const milestoneLabel = item?.daily_cutoff_time ? item?.daily_cutoff_time.slice(0, 5) : null;

    return (
      <td className='p-0 align-top'>
        <div
          onClick={() => !isOutside && !isPast && onDayClick(date)}
          className={[
            'h-32 p-2 border border-gray-200 text-xs flex flex-col',
            !isOutside && !isPast ? 'cursor-pointer hover:bg-orange-50 transition-colors' : '',
            isDayOff && !isOutside ? 'bg-red-50 hover:bg-red-100' : '',
            isOutside || isPast ? 'bg-gray-50 cursor-default' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div
            className={[
              'font-medium text-sm',
              isOutside ? 'text-gray-300' : isDayOff ? 'text-red-400' : 'text-gray-800',
            ].join(' ')}
          >
            {date.getDate()}
          </div>

          {!isOutside && (
            <>
              {isDayOff ? (
                <div className='text-red-400 mt-auto'>{t('workingTimeSetup.dayOff')}</div>
              ) : (
                <>
                  {timeLabel && (
                    <div
                      className='text-blue-500 mt-auto  w-fit p-1 rounded'
                      style={{ backgroundColor: '#0085FF1A' }}
                    >
                      {timeLabel}
                    </div>
                  )}
                  {milestoneLabel && (
                    <div
                      className='rounded px-1 w-fit'
                      style={{ color: '#FF9F2D', backgroundColor: '#FF961B1A' }}
                    >
                      {t('workingTimeSetup.milestoneTime', { time: milestoneLabel })}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </td>
    );
  };
}

const WEEKDAY_KEYS = [
  'workingTimeSetup.monday',
  'workingTimeSetup.tuesday',
  'workingTimeSetup.wednesday',
  'workingTimeSetup.thursday',
  'workingTimeSetup.friday',
  'workingTimeSetup.saturday',
  'workingTimeSetup.sunday',
];

function makeCustomWeekdays(t: (key: string) => string) {
  return function CustomWeekdays() {
    return (
      <tr>
        {WEEKDAY_KEYS.map((key) => (
          <th
            key={key}
            className='bg-amber-50 text-sm font-medium py-3 px-2 text-left border border-gray-200'
          >
            {t(key)}
          </th>
        ))}
      </tr>
    );
  };
}

export default function WorkCalendar() {
  const { t } = useTranslation();

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedItem, setSelectedItem] = useState<WorkingDayCalendarItem | undefined>();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: calendarData, isLoading } = useQuery({
    queryKey: ['working-day-calendar', month, year],
    queryFn: () => workingDayService.getCalendar(month, year),
    select: (res) =>
      Object.fromEntries(res.data.map((item) => [item.date, item])) as Record<
        string,
        WorkingDayCalendarItem
      >,
  });

  const calendarMap = calendarData ?? {};
  const displayMonth = new Date(year, month - 1, 1);

  const handleDayClick = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;
    const key = format(date, 'yyyy-MM-dd');
    setSelectedDate(date);
    setSelectedItem(calendarMap[key]);
    setModalOpen(true);
  };

  const CustomDay = makeCustomDay(displayMonth, calendarMap, handleDayClick, t);
  const CustomWeekdays = makeCustomWeekdays(t);

  return (
    <>
      <WorkDaySettingModal
        open={modalOpen}
        date={selectedDate}
        initialData={selectedItem}
        onClose={() => setModalOpen(false)}
        onSaved={() => setModalOpen(false)}
      />
      <div className='mt-6'>
        <Card className='p-4 sm:p-6'>
          <h3 className='text-primary font-semibold text-base'>
            {t('workingTimeSetup.calendarTitle')}
          </h3>
          <div className='flex gap-6'>
            <div className='flex flex-col gap-1'>
              <label className='text-sm text-gray-600'>{t('workingTimeSetup.month')}</label>
              <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
                <SelectTrigger className='w-40'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_OPTIONS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {t('workingTimeSetup.monthLabel', { month: m.month })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-sm text-gray-600'>{t('workingTimeSetup.year')}</label>
              <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
                <SelectTrigger className='w-28'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEAR_OPTIONS.map((y) => (
                    <SelectItem key={y.value} value={y.value}>
                      {y.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Loading isLoading={isLoading}>
            <Calendar
              mode='single'
              month={displayMonth}
              onMonthChange={() => {}}
              showOutsideDays
              weekStartsOn={1}
              className='w-full p-0'
              classNames={{
                months: 'w-full',
                month: 'w-full',
                month_caption: 'hidden',
                nav: 'hidden',
                month_grid: 'w-full border-collapse table',
                weekdays: '',
                week: '',
                day: 'p-0',
                day_button: 'hidden',
                outside: '',
              }}
              components={{
                Weekdays: CustomWeekdays,
                Day: CustomDay,
              }}
            />
          </Loading>
        </Card>
      </div>
    </>
  );
}
