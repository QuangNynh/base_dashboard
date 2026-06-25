import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { TooltipCustom } from './TooltipCustom';
import { useTranslation } from 'react-i18next';

type ClassNamesType = {
  wrapper?: string;
  trigger?: string;
  buttonTrigger?: string;
};

interface SelectItemType {
  value: string | number;
  label: string;
}

interface MultiSelectProps {
  options: SelectItemType[];
  onChange: (selectedValues: string[]) => void;
  placeholder?: string;
  value?: string[];
  classNames?: ClassNamesType;
  in18n?: boolean;
}

export default function MultiSelect({
  options,
  onChange,
  placeholder,
  value = [],
  in18n = false,
  classNames: { wrapper = '', trigger = '', buttonTrigger = '' } = {},
}: MultiSelectProps) {
  const { t } = useTranslation();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  const selectedValues = value;
  const selected = options.filter((item) => selectedValues.includes(String(item.value)));
  const allSelected = selectedValues.length === options.length && options.length > 0;
  const isPartiallySelected = selectedValues.length > 0 && selectedValues.length < options.length;

  const toggleSelect = (option: SelectItemType) => {
    const optionValue = String(option.value);
    const isSelected = selectedValues.includes(optionValue);
    const newSelected = isSelected
      ? selectedValues.filter((item) => item !== optionValue)
      : [...selectedValues, optionValue];

    onChange(newSelected);
  };

  const toggleSelectAll = () => {
    const newSelected = allSelected ? [] : options.map((item) => String(item.value));
    onChange(newSelected);
  };

  const handleTextRef = (element: HTMLDivElement | null) => {
    if (element) {
      setIsTruncated(element.scrollWidth > element.clientWidth);
    }
  };

  return (
    <TooltipCustom
      content={
        !isPopoverOpen && selected.length > 1 && isTruncated ? (
          <div className='flex flex-wrap gap-2'>
            {selected.map((item) => (
              <Badge
                variant='outline'
                key={item.value}
                className='flex items-center gap-2 px-3 py-1'
              >
                {in18n ? t(item.label) : item.label}
              </Badge>
            ))}
          </div>
        ) : (
          ''
        )
      }
    >
      <div className={cn('w-full', wrapper)}>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild className={trigger}>
            <Button
              variant='outline'
              className={cn(
                `w-full flex justify-between font-normal ${selected.length === 0 ? 'text-gray-600' : ''}`,
                buttonTrigger
              )}
            >
              <div ref={handleTextRef} className='truncate'>
                {selected.length > 0
                  ? selected.map((item) => (in18n ? t(item.label) : item.label)).join(', ')
                  : placeholder}
              </div>
              <ChevronDown className='h-4 w-4 ' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='p-2'>
            <Command>
              <CommandGroup className='max-h-[300px] overflow-y-auto z-10'>
                {/* Thêm option chọn tất cả */}
                {options.length > 0 ? (
                  <>
                    <CommandItem
                      onSelect={toggleSelectAll}
                      className='cursor-pointer flex items-center justify-between w-full font-medium'
                    >
                      {in18n ? t('common.selectAll') : 'Select all'}
                      {allSelected ? (
                        <Check className='h-4 w-4 text-primary' />
                      ) : isPartiallySelected ? (
                        <span className='h-4 w-4 border-2 border-primary rounded-sm' />
                      ) : null}
                    </CommandItem>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        onSelect={() => toggleSelect(option)}
                        className='cursor-pointer flex items-center justify-between w-full'
                      >
                        {in18n ? t(option.label) : option.label}
                        {selectedValues.includes(String(option.value)) && (
                          <Check className='h-4 w-4 text-primary' />
                        )}
                      </CommandItem>
                    ))}
                  </>
                ) : (
                  <>
                    <CommandItem className='cursor-pointer flex items-center justify-between w-full text-gray-500'>
                      {in18n ? t('common.noData') : 'No data'}
                    </CommandItem>
                  </>
                )}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </TooltipCustom>
  );
}
