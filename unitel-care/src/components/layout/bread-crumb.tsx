import { Button } from '@/components/ui/button';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { IconChevronRight, IconHome } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function PageHeaderBreadcrumb() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useBreadcrumbs();
  return (
    <div className=' flex flex-row items-center gap-2 text-sm bg-card p-2 rounded-md'>
      <Button
        variant='ghost'
        className='flex !items-center !justify-center text-muted-foreground hover:text-primary  '
        onClick={() => navigate('/')}
      >
        <IconHome />
      </Button>

      {breadcrumbs?.map((key) => (
        <div key={key} className='flex items-center gap-2'>
          <IconChevronRight size={16} className='text-primary' />
          <span className={'text-primary'}> {t(`common.${key}`)}</span>
        </div>
      ))}
    </div>
  );
}
