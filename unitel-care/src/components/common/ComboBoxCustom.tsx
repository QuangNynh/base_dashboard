import { CheckIcon, ChevronsUpDown, X } from 'lucide-react';
import * as React from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Input } from '../ui/input';

type OptionType = {
  value?: string;
  label?: string;
};

interface ComboBoxProps {
  placeholder: string;
  placeholderEmpty?: string;
  options: OptionType[];
  onChange?: (data: string) => void;
  onChangeOption?: (data: OptionType) => void;
  value: string | null;
  isLoading?: boolean;
  onLoadMore?: () => void;
  onFilter?: (query: string) => void;
  disable?: boolean;
  readOnly?: boolean;
  i18n?: boolean;
  lengthTruncate?: number;
  error?: string;
  hasError?: boolean;
  clearValue?: boolean;
}

export function Combobox({
  placeholder,
  options,
  onChange,
  placeholderEmpty = 'No data',
  value,
  isLoading = false,
  onLoadMore,
  onFilter,
  disable = false,
  readOnly = false,
  i18n = false,
  error,
  hasError,
  clearValue = true,
  onChangeOption,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const listboxId = React.useId();
  const [query, setQuery] = React.useState('');
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [triggerWidth, setTriggerWidth] = React.useState<number>();
  const { t } = useTranslation();

  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setTriggerWidth(el.getBoundingClientRect().width);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      setQuery('');
      onFilter?.('');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
    onChangeOption?.({ value: '', label: '' });
  };

  const handleLoadMore = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50 && !isLoading) {
      onLoadMore?.();
    }
  };

  const selectedOption = React.useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  const label = selectedOption
    ? i18n
      ? t(selectedOption?.label ?? '')
      : selectedOption.label
    : '';

  const filteredOptions = onFilter
    ? options
    : options.filter((option) => option.label?.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className='flex flex-col gap-1 min-w-0 w-full overflow-hidden'>
      <Popover
        modal
        open={open}
        onOpenChange={(open) => {
          if (disable || readOnly) return;
          setOpen(open);
        }}
      >
        <PopoverTrigger asChild>
          <div
            ref={triggerRef}
            role='combobox'
            aria-expanded={open}
            aria-controls={listboxId}
            className={`w-full min-w-0 px-3 py-1.75 flex items-center gap-2 border rounded-md text-sm ${
              !disable
                ? readOnly
                  ? 'cursor-text'
                  : 'cursor-pointer'
                : 'bg-[#E6E6E6] cursor-not-allowed'
            } ${error || hasError ? 'border-destructive' : ''}`}
            onClick={() => {
              if (disable || readOnly) return;
              setOpen(!open);
            }}
          >
            <div className='flex-1 min-w-0 overflow-hidden'>
              <span className='block truncate' title={label}>
                {value ? label : <span className='text-muted-foreground'>{placeholder}</span>}
              </span>
            </div>

            <div className='flex items-center gap-1 shrink-0'>
              {clearValue && value && !readOnly && !disable && (
                <X
                  onClick={handleClear}
                  className='w-4 h-4 text-muted-foreground hover:text-destructive cursor-pointer'
                />
              )}
              <ChevronsUpDown className='opacity-50 w-4 h-4' />
            </div>
          </div>
        </PopoverTrigger>

        {!disable && !readOnly && (
          <PopoverContent
            id={listboxId}
            className='p-0 overflow-hidden'
            style={{ width: triggerWidth }}
            sideOffset={5}
            align='start'
          >
            <Command className='w-full'>
              <div className='p-2 border-b'>
                <Input
                  name='search'
                  value={query}
                  placeholder={placeholder}
                  className='w-full outline-none! border-none!'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value;
                    setQuery(val);
                    onFilter?.(val.trim());
                  }}
                />
              </div>

              <CommandList
                ref={listRef}
                onScroll={handleLoadMore}
                className='max-h-75 overflow-y-auto'
              >
                {!isLoading && <CommandEmpty>{placeholderEmpty}</CommandEmpty>}

                <CommandGroup>
                  {filteredOptions.map((option) => {
                    const fullText = i18n ? t(option?.label || '') : option?.label || '';

                    return (
                      <CommandItem
                        key={option?.value}
                        value={option?.label}
                        onSelect={() => {
                          const newValue =
                            option?.value === value
                              ? clearValue
                                ? ''
                                : option?.value
                              : option?.value;
                          onChange?.(newValue as string);
                          onChangeOption?.(option);
                          setOpen(false);
                        }}
                        className='w-full px-3 py-2 cursor-pointer hover:bg-accent'
                      >
                        <div className='flex items-center justify-between w-full min-w-0 gap-2'>
                          <span className='text-sm truncate min-w-0 flex-1' title={fullText}>
                            {fullText}
                          </span>

                          <div className='shrink-0'>
                            <div
                              className={cn(
                                'p-0.5 bg-[#44AB4A] rounded-full transition-opacity',
                                value === option?.value ? 'opacity-100' : 'opacity-0'
                              )}
                            >
                              <CheckIcon className='!w-2 !h-2 text-white' />
                            </div>
                          </div>
                        </div>
                      </CommandItem>
                    );
                  })}

                  {isLoading && (
                    <div className='p-2 text-sm text-center text-muted-foreground'>Loading...</div>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>
      {error && <p className='text-xs text-destructive'>{error}</p>}
    </div>
  );
}
