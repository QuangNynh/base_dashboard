import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
  onlyNumber?: boolean;
  onlyInteger?: boolean;
}

function Input({
  className,
  type,
  onlyNumber = false,
  onlyInteger = false,
  min,
  max,
  onKeyDown,
  ...props
}: InputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!onlyNumber && !onlyInteger) {
      onKeyDown?.(e);
      return;
    }

    const allowNegative = min === undefined || Number(min) < 0;

    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];

    // ✅ cho phép Ctrl/Cmd + A C V X
    if (e.ctrlKey || e.metaKey) {
      onKeyDown?.(e);
      return;
    }

    // ✅ cho phép phím điều hướng
    if (allowedKeys.includes(e.key)) {
      onKeyDown?.(e);
      return;
    }

    // ✅ cho phép số
    if (/^[0-9]$/.test(e.key)) {
      onKeyDown?.(e);
      return;
    }

    // ✅ dấu . (chỉ cho phép khi onlyNumber, không có onlyInteger)
    if (e.key === '.') {
      if (onlyInteger) {
        e.preventDefault();
        return;
      }
      const value = (e.currentTarget as HTMLInputElement).value;
      if (value.includes('.')) {
        e.preventDefault();
      }
      onKeyDown?.(e);
      return;
    }

    // ✅ dấu - (chỉ ở đầu)
    if (e.key === '-' && allowNegative) {
      const input = e.currentTarget as HTMLInputElement;
      if (input.selectionStart !== 0 || input.value.includes('-')) {
        e.preventDefault();
      }
      onKeyDown?.(e);
      return;
    }

    // ❌ chặn tất cả còn lại
    e.preventDefault();
  };

  return (
    <input
      type={type}
      min={min}
      max={max}
      onKeyDown={handleKeyDown}
      data-slot='input'
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
}

export { Input };
