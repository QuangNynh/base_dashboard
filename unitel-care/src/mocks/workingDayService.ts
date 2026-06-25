export interface WorkingDayConfigBulkRequest {
  start_time: string;
  end_time: string;
  daily_cutoff_time?: string;
  days_of_week: number[];
  apply_from: string;
  apply_to: string;
  kpi_exclusion_threshold?: string;
}

export interface WorkingDayCalendarItem {
  date: string;           // yyyy-MM-dd
  start_time: string;     // HH:mm:ss
  end_time: string;       // HH:mm:ss
  daily_cutoff_time?: string;
  kpi_exclusion_threshold?: string;
  is_day_off: boolean;
}

export interface WorkingDayCalendarResponse {
  data: WorkingDayCalendarItem[];
}

export interface WorkingDayConfigDayRequest {
  date: string;
  start_time?: string;
  end_time?: string;
  daily_cutoff_time?: string;
  kpi_exclusion_threshold?: string;
  is_day_off?: boolean;
}

class WorkingDayService {
  private calendarItems: Map<string, WorkingDayCalendarItem> = new Map();

  async bulkCreate(data: WorkingDayConfigBulkRequest): Promise<void> {
    const start = new Date(data.apply_from);
    const end = new Date(data.apply_to);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay(); // 0 is Sunday, 1 is Monday, etc.
      // days_of_week might be [1,2,3,4,5,6] (Mon-Sat)
      const dayIndex = dayOfWeek === 0 ? 7 : dayOfWeek; // Convert 0-6 to 1-7 (or keep as is depending on standard)
      const formattedDate = d.toISOString().split('T')[0];

      const isDayOff = !data.days_of_week.includes(dayIndex);
      this.calendarItems.set(formattedDate, {
        date: formattedDate,
        start_time: data.start_time,
        end_time: data.end_time,
        daily_cutoff_time: data.daily_cutoff_time,
        kpi_exclusion_threshold: data.kpi_exclusion_threshold,
        is_day_off: isDayOff,
      });
    }
  }

  async updateDay(data: WorkingDayConfigDayRequest): Promise<void> {
    const existing = this.calendarItems.get(data.date);
    this.calendarItems.set(data.date, {
      date: data.date,
      start_time: data.start_time ?? existing?.start_time ?? '08:00:00',
      end_time: data.end_time ?? existing?.end_time ?? '17:00:00',
      daily_cutoff_time: data.daily_cutoff_time ?? existing?.daily_cutoff_time,
      kpi_exclusion_threshold: data.kpi_exclusion_threshold ?? existing?.kpi_exclusion_threshold,
      is_day_off: data.is_day_off ?? existing?.is_day_off ?? false,
    });
  }

  async getCalendar(month: number, year: number): Promise<WorkingDayCalendarResponse> {
    const res: WorkingDayCalendarItem[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const existing = this.calendarItems.get(dateStr);
      if (existing) {
        res.push(existing);
      } else {
        const d = new Date(year, month - 1, day);
        const dayOfWeek = d.getDay();
        const isDayOff = dayOfWeek === 0 || dayOfWeek === 6; // Weekend by default
        res.push({
          date: dateStr,
          start_time: '08:00:00',
          end_time: '17:00:00',
          daily_cutoff_time: '17:00:00',
          kpi_exclusion_threshold: '04:00:00',
          is_day_off: isDayOff,
        });
      }
    }

    return { data: res };
  }
}

export const workingDayService = new WorkingDayService();
