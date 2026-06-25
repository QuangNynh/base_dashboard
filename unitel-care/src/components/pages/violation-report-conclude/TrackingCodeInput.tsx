import { violationReportService } from '@/services/violationReport';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export interface OrderSearchViolation {
  code: string;
  type: string;
  origin_postcode: string;
  current_package_code: string;
  origin_post_code_id: string;
  origin_post_code_name: string;
  complaint_count: number;
}

export type TrackingType = 'ORDER' | 'PACKAGE';

interface Props {
  value: OrderSearchViolation[];
  onChange: (items: OrderSearchViolation[]) => void;
  placeholder?: string;
}

const TrackingCodeInput = ({ value, onChange, placeholder }: Props) => {
  const { t } = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState('');
  const [trackingType, setTrackingType] = useState<TrackingType>('ORDER');
  const [isLoading, setIsLoading] = useState(false);

  const TRACKING_TYPE_LABEL = useMemo<Record<TrackingType, string>>(
    () => ({
      ORDER: t('violationReportConclude.trackingTypeVanDon'),
      PACKAGE: t('violationReportConclude.trackingTypeTaiKien'),
    }),
    [t]
  );

  const handleSearch = async () => {
    const keyword = inputValue.trim();
    if (!keyword) return;

    setIsLoading(true);

    try {
      const res = await violationReportService.getListOriginLookUp({
        code: keyword,
        type: trackingType,
      });
      const item: OrderSearchViolation | null = res?.data ?? null;

      if (!item?.code) {
        toast.warning(t('violationReportConclude.trackingNoMatch'), { position: 'top-center' });
        return;
      }

      if (value.length > 0 && value[0].type !== item.type) {
        toast.warning(t('violationReportConclude.trackingMixedType'), { position: 'top-center' });
        return;
      }

      if (value.some((v) => v.code === item.code)) {
        toast.warning(t('violationReportConclude.trackingAlreadyAdded'), {
          position: 'top-center',
        });
        return;
      }

      onChange([...value, item]);
      setInputValue('');
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: string; detail?: string } };
        message?: string;
      };
      toast.error(
        e?.response?.data?.message ||
          e?.response?.data?.detail ||
          e?.message ||
          t('common.errorDefault')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleTypeChange = (type: TrackingType) => {
    if (value.length > 0) {
      toast.warning(t('violationReportConclude.trackingMixedType'), { position: 'top-center' });
      return;
    }
    setTrackingType(type);
  };

  return (
    <div className='flex items-start gap-3'>
      <div className='flex flex-col gap-1.5' ref={wrapperRef}>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? t('violationReportConclude.trackingInputPlaceholder')}
          className='min-w-[480px]'
          disabled={isLoading}
        />

        <div className='flex items-center gap-6'>
          {(Object.keys(TRACKING_TYPE_LABEL) as TrackingType[]).map((type) => (
            <label key={type} className='flex items-center gap-2 cursor-pointer text-sm'>
              <input
                type='radio'
                name='trackingType'
                value={type}
                checked={trackingType === type}
                onChange={() => handleTypeChange(type)}
                className='accent-primary w-4 h-4'
              />
              {TRACKING_TYPE_LABEL[type]}
            </label>
          ))}
        </div>
      </div>

      <Button type='button' onClick={handleSearch} disabled={isLoading || !inputValue.trim()}>
        {isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : t('common.confirm')}
      </Button>
    </div>
  );
};

export default TrackingCodeInput;
