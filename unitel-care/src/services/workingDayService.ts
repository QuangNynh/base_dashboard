import api from '@/config/axios';

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
  async bulkCreate(data: WorkingDayConfigBulkRequest): Promise<void> {
    await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/working-day-configs/bulk`,
      data
    );
  }

  async updateDay(data: WorkingDayConfigDayRequest): Promise<void> {
    await api.put(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/working-day-configs/day`,
      data
    );
  }

  async getCalendar(month: number, year: number): Promise<WorkingDayCalendarResponse> {
    const response = await api.get<WorkingDayCalendarResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/working-day-configs/calendar`,
      { params: { month, year } }
    );
    return response.data;
  }
}

export const workingDayService = new WorkingDayService();
