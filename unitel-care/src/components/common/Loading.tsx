import { cn } from '@/lib/utils';

interface LoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function Loading({ isLoading = false, children, className }: LoadingProps) {
  return (
    <div className={cn('relative', className)}>
      {isLoading && (
        <div className='sticky top-0 z-10 h-0'>
          <div className='flex h-screen w-full items-center justify-center bg-white/60 backdrop-blur-[2px]'>
            <div className='flex flex-col items-center gap-3'>
              {/* Spinner vòng tròn */}
              <div className='relative size-10'>
                <div className='absolute inset-0 rounded-full border-4 border-primary/20' />
                <div className='absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary' />
              </div>

              {/* Dots nhảy */}
              <div className='flex gap-1.5'>
                <span className='size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]' />
                <span className='size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]' />
                <span className='size-1.5 animate-bounce rounded-full bg-primary' />
              </div>
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
