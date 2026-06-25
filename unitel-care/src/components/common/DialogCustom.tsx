import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface props {
  open: boolean;
  onclose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const DialogCustom = ({ open, onclose, children, title, className }: props) => {
  return (
    <Dialog open={open} onOpenChange={onclose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn('!max-w-5xl h-[80vh] flex flex-col px-0 pt-0', className)}
      >
        {title && (
          <DialogHeader>
            <DialogTitle
              className='text-center bg-[#F6F8FF] w-full py-4 rounded-t-lg font-medium'
              style={{ color: '#44494D' }}
            >
              {title}
            </DialogTitle>
          </DialogHeader>
        )}

        <div className='px-6 overflow-auto'>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
