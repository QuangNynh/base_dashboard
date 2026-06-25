import CheckboxCheckedIcon from '@/assets/icons/CheckboxCheckedIcon';
import { Check, ChevronsUpDown, X } from 'lucide-react';
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
import { useTranslation } from 'react-i18next';

type OptionType = {
  value: string;
  label: string;
};

interface ComboBoxMultiProps {
  placeholder: string;
  placeholderEmpty?: string;
  options: OptionType[];
  onChange?: (data: string[]) => void;
  value: string[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  onFilter?: (query: string) => void;
  readOnly?: boolean;
  disable?: boolean;
  i18n?: boolean;
  checkbox?: boolean;
  selectAll?: boolean;
  hasError?: boolean;
  onOpenFn?: () => void;
}

const GAP = 4; // gap-1 = 4px
const MAX_ROWS = 2;

export function ComboBoxMulti({
  placeholder,
  options,
  onChange,
  placeholderEmpty = 'No data',
  value,
  isLoading = false,
  onLoadMore,
  onFilter,
  readOnly = false,
  disable = false,
  i18n = false,
  checkbox = false,
  selectAll = false,
  hasError,
  onOpenFn,
}: ComboBoxMultiProps) {
  const [open, setOpen] = React.useState(false);
  const listboxId = React.useId();
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [triggerWidth, setTriggerWidth] = React.useState<number>();
  const [query, setQuery] = React.useState('');
  const listRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);
  const tagsContainerRef = React.useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = React.useState(0);
  const { t } = useTranslation();

  const selectedLabels = React.useMemo(
    () =>
      value.map((val) => {
        const label = options.find((o) => o.value === val)?.label ?? '';
        return i18n ? t(label) : label;
      }),
    [value, options, i18n, t]
  );

  // Measure trigger width to set popover width
  React.useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
    return () => setQuery('');
  }, [open]);

  // Calculate how many tags fit in the container
  // Dùng getBoundingClientRect thay vì offsetWidth để hoạt động đúng
  // bên trong modal có overflow:hidden
  const recalculate = React.useCallback(() => {
    const measure = measureRef.current;
    const container = tagsContainerRef.current;

    if (!measure || !container || selectedLabels.length === 0) {
      setVisibleCount(selectedLabels.length);
      return;
    }

    const containerWidth = container.getBoundingClientRect().width;
    const children = Array.from(measure.children) as HTMLElement[];
    const badgeEl = children[children.length - 1];
    const badgeWidth = badgeEl ? badgeEl.getBoundingClientRect().width + GAP : 0;

    let rowUsed = 0;
    let row = 0;
    let count = 0;

    for (let i = 0; i < selectedLabels.length; i++) {
      const tagEl = children[i];
      if (!tagEl) break;

      const tagWidth = tagEl.getBoundingClientRect().width;
      const gapBefore = rowUsed > 0 ? GAP : 0;
      const isLast = i === selectedLabels.length - 1;
      // space needed = this tag + badge (unless it's the very last tag)
      const needed = gapBefore + tagWidth + (isLast ? 0 : badgeWidth);

      if (rowUsed + needed <= containerWidth) {
        // fits on current row
        rowUsed += gapBefore + tagWidth;
        count++;
      } else if (row < MAX_ROWS - 1) {
        // wrap to next row
        row++;
        rowUsed = tagWidth;
        count++;
      } else {
        // exceeded max rows — stop
        break;
      }
    }

    setVisibleCount(Math.max(1, count));
  }, [selectedLabels]);

  React.useLayoutEffect(() => {
    recalculate();
  }, [recalculate]);

  // ResizeObserver: re-measure khi container thay đổi kích thước
  // (vd: modal đang animate open, hay window resize)
  React.useEffect(() => {
    const container = tagsContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      recalculate();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [recalculate]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.([]);
  };

  const isSelected = (val: string) => value.includes(val);

  const toggleValue = (val: string) => {
    if (isSelected(val)) {
      onChange?.(value.filter((v) => v !== val));
    } else {
      onChange?.([...value, val]);
    }
  };

  const handleLoadMore = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50 && !isLoading) {
      onLoadMore?.();
    }
  };

  const filteredOptions = onFilter
    ? options
    : options.filter((option) => option?.label?.toLowerCase().includes(query.trim().toLowerCase()));

  const allSelected =
    filteredOptions.length > 0 && filteredOptions.every((o) => value.includes(o.value));
  const partialSelected = !allSelected && filteredOptions.some((o) => value.includes(o.value));

  const toggleSelectAll = () => {
    if (allSelected) {
      onChange?.(value.filter((v) => !filteredOptions.some((o) => o.value === v)));
    } else {
      const toAdd = filteredOptions.map((o) => o.value).filter((v) => !value.includes(v));
      onChange?.([...value, ...toAdd]);
    }
  };

  const hiddenCount = selectedLabels.length - visibleCount;

  return (
    <Popover
      modal={true}
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
          className={`relative w-full min-h-9 px-3 py-1.5 flex items-center justify-between border rounded-md text-sm font-normal gap-2 ${
            !disable
              ? readOnly
                ? 'cursor-text'
                : 'cursor-pointer'
              : 'bg-[#E6E6E6] cursor-not-allowed'
          } ${hasError ? 'border-destructive' : ''}`}
          onClick={() => {
            if (disable || readOnly) return;
            setOpen(!open);
            onOpenFn?.();
          }}
        >
          {/* Layer ẩn để đo width từng tag */}
          <div
            ref={measureRef}
            className='absolute invisible pointer-events-none flex items-center'
            aria-hidden
          >
            {selectedLabels.map((label, i) => (
              <span
                key={i}
                className='bg-muted px-2 py-0.5 rounded text-xs whitespace-nowrap'
                style={{ marginLeft: i > 0 ? GAP : 0 }}
              >
                {label}
              </span>
            ))}
            {/* Badge để đo width */}
            <span
              className='bg-muted px-2 py-0.5 rounded text-xs whitespace-nowrap'
              style={{ marginLeft: GAP }}
            >
              +{selectedLabels.length}
            </span>
          </div>

          {/* Phần hiển thị thực */}
          <div
            ref={tagsContainerRef}
            className='flex items-start gap-1 flex-wrap flex-1 min-w-0 overflow-hidden'
          >
            {value.length > 0 ? (
              <>
                {selectedLabels.slice(0, visibleCount).map((label, i) => (
                  <span
                    key={i}
                    className='bg-muted px-2 py-0.5 rounded text-xs whitespace-nowrap shrink-0'
                  >
                    {label}
                  </span>
                ))}
                {hiddenCount > 0 && (
                  <span className='bg-muted px-2 py-0.5 rounded text-xs whitespace-nowrap shrink-0 text-muted-foreground'>
                    +{hiddenCount}
                  </span>
                )}
              </>
            ) : (
              <span className='text-muted-foreground truncate'>{placeholder}</span>
            )}
          </div>

          <div className='flex items-center gap-1 shrink-0'>
            {value.length > 0 && !readOnly && !disable && (
              <X
                onClick={handleClear}
                className='w-4 h-4 text-muted-foreground hover:text-destructive cursor-pointer'
              />
            )}
            <ChevronsUpDown className='opacity-50 w-4 h-4' />
          </div>
        </div>
      </PopoverTrigger>

      {!readOnly && !disable && (
        <PopoverContent id={listboxId} className='p-0' style={{ width: triggerWidth }}>
          <Command>
            <div className='p-2'>
              <Input
                name='search'
                value={query}
                placeholder={placeholder}
                className=' !focus-visible:ring-0 !focus-visible:border-none !rounded-md'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const val = e.target.value;
                  setQuery(val);
                  onFilter?.(val.trim());
                }}
              />
            </div>
            <CommandList ref={listRef} onScroll={handleLoadMore}>
              <CommandEmpty>{placeholderEmpty}</CommandEmpty>
              <CommandGroup>
                {selectAll && filteredOptions.length > 0 && (
                  <CommandItem
                    onSelect={toggleSelectAll}
                    className='cursor-pointer flex items-center gap-2 font-medium'
                  >
                    {checkbox ? (
                      <>
                        {allSelected ? (
                          <CheckboxCheckedIcon className='mr-2 shrink-0' />
                        ) : partialSelected ? (
                          <div className='mr-2 w-4 h-4 shrink-0 rounded-[3px] border-2 border-primary bg-white' />
                        ) : (
                          <div className='mr-2 w-4 h-4 shrink-0 rounded-[3px] border border-gray-300 bg-white' />
                        )}
                        {t('common.selectAll')}
                      </>
                    ) : (
                      <>
                        {t('common.selectAll')}
                        <Check
                          className={cn(
                            'ml-auto',
                            allSelected
                              ? 'opacity-100'
                              : partialSelected
                                ? 'opacity-50'
                                : 'opacity-0'
                          )}
                        />
                      </>
                    )}
                  </CommandItem>
                )}
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => toggleValue(option.value)}
                  >
                    {checkbox ? (
                      <>
                        {isSelected(option.value) ? (
                          <CheckboxCheckedIcon className='mr-2 shrink-0' />
                        ) : (
                          <div className='mr-2 w-4 h-4 shrink-0 rounded-[3px] border border-gray-300 bg-white' />
                        )}
                        {option.label}
                      </>
                    ) : (
                      <>
                        {option.label}
                        <Check
                          className={cn(
                            'ml-auto',
                            isSelected(option.value) ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </>
                    )}
                  </CommandItem>
                ))}
                {isLoading && (
                  <div className='p-2 text-center text-sm text-muted-foreground'>Đang tải...</div>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
}
