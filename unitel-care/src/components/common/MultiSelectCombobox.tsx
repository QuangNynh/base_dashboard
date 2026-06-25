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
import { Input } from '../ui/input';

type OptionType = {
  value: string;
  label: string;
};

interface MultiSelectComboboxProps {
  placeholder?: string;
  placeholderEmpty?: string;
  options: OptionType[];
  value: string[];
  onChange: (values: string[]) => void;
  disable?: boolean;
  hasError?: boolean;
}

export function MultiSelectCombobox({
  placeholder = 'Chọn...',
  placeholderEmpty = 'No data',
  options,
  value,
  onChange,
  disable = false,
  hasError,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const listboxId = React.useId();
  const [query, setQuery] = React.useState('');
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [triggerWidth, setTriggerWidth] = React.useState<number>();

  React.useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
    if (!open) setQuery('');
  }, [open]);

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  const selectedOptions = React.useMemo(
    () => options.filter((o) => value.includes(o.value)),
    [options, value]
  );

  const toggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeTag = (e: React.MouseEvent, optionValue: string) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  return (
    <Popover modal open={open} onOpenChange={disable ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <div
          ref={triggerRef}
          role='combobox'
          aria-expanded={open}
          aria-controls={listboxId}
          className={cn(
            'w-full min-h-9 px-3 py-1.5 flex items-start gap-2 border rounded-md text-sm',
            disable ? 'bg-[#E6E6E6] cursor-not-allowed' : 'cursor-pointer',
            hasError ? 'border-destructive' : ''
          )}
          onClick={() => !disable && setOpen(!open)}
        >
          <div className='flex flex-wrap gap-1 flex-1 min-w-0'>
            {selectedOptions.length === 0 ? (
              <span className='text-muted-foreground self-center'>{placeholder}</span>
            ) : (
              selectedOptions.map((opt) => (
                <span
                  key={opt.value}
                  className='inline-flex items-center gap-1 bg-[#F5F5F5] text-[#44494D] text-xs px-2 py-1 rounded-[4px]'
                >
                  {opt.label}
                  {!disable && (
                    <X
                      className='w-3 h-3 cursor-pointer hover:text-destructive'
                      onClick={(e) => removeTag(e, opt.value)}
                    />
                  )}
                </span>
              ))
            )}
          </div>
          <ChevronsUpDown className='opacity-50 w-4 h-4 shrink-0 mt-0.5' />
        </div>
      </PopoverTrigger>

      {!disable && (
        <PopoverContent id={listboxId} className='p-0' style={{ width: triggerWidth }}>
          <Command>
            <div className='p-2'>
              <Input
                name='search'
                value={query}
                placeholder={placeholder}
                className='!outline-none !border-none !focus-visible:ring-0 !rounded-md'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              />
            </div>
            <CommandList>
              <CommandEmpty>{placeholderEmpty}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => toggle(option.value)}
                  >
                    {option.label}
                    <div
                      className={cn(
                        'p-0.5 bg-[#44AB4A] rounded-full ml-auto',
                        value.includes(option.value) ? 'opacity-100' : 'opacity-0'
                      )}
                    >
                      <CheckIcon className='size-2 text-white' />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
}
