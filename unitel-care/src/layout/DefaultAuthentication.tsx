import EnIcon from '@/assets/icons/EnIcon';
import KmIcon from '@/assets/icons/KmIcon';
import VnIcon from '@/assets/icons/VnIcon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LANG_STORAGE_KEY } from '@/i18n';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface props {
  children: ReactNode;
}

const DefaultAuthentication = ({ children }: props) => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  };

  return (
    <div className='min-h-screen bg-[#f5f5f5] flex flex-col'>
      {/* Header */}
      <header className='bg-white border-b'>
        <div className='container mx-auto px-4 py-2 flex items-center justify-between'>
          <Link to='/' className='flex items-center'>
            <img src='/vite.svg' alt='logo' className='h-16 w-auto' />
          </Link>
          <Select value={i18n.language} onValueChange={changeLanguage}>
            <SelectTrigger size='sm' className='w-fit'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='vi'>
                <div className='flex items-center gap-2'>
                  <VnIcon />
                  <span>{t('language.vi')}</span>
                </div>
              </SelectItem>
              <SelectItem value='en'>
                <div className='flex items-center gap-2'>
                  <EnIcon />
                  <span>{t('language.en')}</span>
                </div>
              </SelectItem>
              {/* <SelectItem value='lo'>
                <div className='flex items-center gap-2'>
                  <LoIcon />
                  <span>{t('language.lo')}</span>
                </div>
              </SelectItem> */}
              <SelectItem value='km'>
                <div className='flex items-center gap-2'>
                  <KmIcon />
                  <span>{t('language.km')}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 flex items-center justify-center p-4'>{children}</main>
    </div>
  );
};

export default DefaultAuthentication;
