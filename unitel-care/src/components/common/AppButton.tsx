import { type FC, useCallback, useState } from 'react';
import type { ReactNode, MouseEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/button';

type Props = {
  disabled?: boolean;
  outline?: boolean;
  secondary?: boolean;
  isGreen?: boolean;
  isWarning?: boolean;
  error?: boolean;
  link?: boolean;
  dashed?: boolean;
  className?: string;
  children?: ReactNode;
  icon?: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  [key: string]: unknown;
};

const AppButton: FC<Props> = ({
  disabled,
  onClick,
  outline,
  secondary,
  isGreen,
  isWarning,
  error,
  link,
  dashed,
  className,
  children,
  icon,
  ...props
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const result = onClick?.(e) as unknown;
      if (!(result instanceof Promise)) return;
      setLoading(true);
      result.finally(() => setLoading(false));
    },
    [onClick, disabled]
  );

  return (
    <Button
      {...props}
      disabled={disabled}
      onClick={handleClick}
      className={clsx(
        'rounded-sm! font-medium! cursor-pointer',
        {
          'bg-primary! border-primary! text-white! **:text-white! hover:opacity-90!':
            !outline && !secondary && !isGreen && !error && !link && !dashed && !disabled,
          'bg-destructive! border-destructive! text-white! **:text-white! hover:opacity-80!':
            error && !disabled,
          'bg-[#02723a]! border-[#02723a]! text-white! **:text-white! hover:opacity-80!':
            secondary && !disabled,
          'bg-[#02a14e]! border-[#02a14e]! text-white! **:text-white! hover:opacity-80!':
            isGreen && !secondary && !disabled,
          'bg-[#FFF6E6]! border-[#FFF6E6]! text-[#FF5100]! **:text-[#FF5100]! hover:opacity-80!':
            isWarning && !disabled,
          'bg-white! border! border-primary! text-primary! **:text-primary! hover:bg-primary/10!':
            (outline || dashed) && !disabled,
          'border-dashed!': dashed && !disabled,
          'bg-transparent! border-none! text-primary! **:text-primary! h-auto! shadow-none! p-0! underline underline-offset-2 hover:opacity-70!':
            link && !disabled,
          'bg-disable! text-muted-foreground! border-disable! cursor-not-allowed! **:text-muted-foreground! [&_span]:text-muted-foreground! opacity-100!':
            disabled && !outline && !link,
          'bg-white! border! border-border! text-muted-foreground! cursor-not-allowed! *:text-muted-foreground! [&_span]:text-muted-foreground! opacity-100!':
            disabled && (outline || dashed),
          'bg-transparent! border-none! text-muted-foreground! shadow-none! cursor-not-allowed! **:text-muted-foreground! [&_span]:text-muted-foreground! opacity-100!':
            disabled && link,
        },
        className
      )}
    >
      {loading ? <Loader2 className='animate-spin' /> : icon}
      {children}
    </Button>
  );
};

export default AppButton;
