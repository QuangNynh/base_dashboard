import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

interface Props {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}
export const InputSearch = ({ placeholder, className, onChange, value }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e?.target.value.trim();
    onChange?.(val || '');
  };

  return (
    <>
      <div className={cn('relative w-full', className)}>
        <Input
          onChange={handleChange}
          value={value}
          placeholder={placeholder}
          className={` pl-10`}
          onBlur={handleBlur}
        />
        <div className='absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 pointer-events-none'>
          <Search size={18} />
        </div>
      </div>
    </>
  );
};
