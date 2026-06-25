import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { ReactNode } from 'react';

interface TooltipCustomProps {
  content: ReactNode | string;
  children: ReactNode;
}

export function TooltipCustom({ content, children }: TooltipCustomProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        {content && (
          <TooltipContent className='max-w-[400px] '>
            <p>{content}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
