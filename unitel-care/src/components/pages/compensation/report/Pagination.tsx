import { cn, getPageNumbers } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
type TablePaginationProps = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  pageSizeOptions?: number[];
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
};

export function TablePagination({
  currentPage,
  pageSize,
  totalPages,
  setPageIndex,
  setPageSize,
  pageSizeOptions = [5, 10, 20, 30, 40, 50],
}: TablePaginationProps) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'flex items-center justify-between px-2 gap-2',
        'max-2xl:flex-col-reverse max-2xl:gap-4'
      )}
      style={{ overflowClipMargin: 1 }}
    >
      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          className='size-8 p-0 max-md:hidden'
          onClick={() => setPageIndex(0)}
          disabled={currentPage === 1}
        >
          <IconChevronsLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='size-8 p-0'
          onClick={() => setPageIndex(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <IconChevronLeft className='h-4 w-4' />
        </Button>

        {/* Page number buttons */}
        {pageNumbers.map((pageNumber, index) => (
          <div key={`${pageNumber}-${index}`} className='flex items-center'>
            {pageNumber === '...' ? (
              <span className='text-muted-foreground px-1 text-sm'>...</span>
            ) : (
              <Button
                variant={currentPage === pageNumber ? 'default' : 'outline'}
                className='h-8 min-w-8 px-2'
                onClick={() => setPageIndex((pageNumber as number) - 1)}
              >
                <span className='sr-only'>Go to page {pageNumber}</span>
                {pageNumber}
              </Button>
            )}
          </div>
        ))}

        <Button
          variant='outline'
          className='size-8 p-0'
          onClick={() => setPageIndex(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <IconChevronRight className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='size-8 p-0 max-md:hidden'
          onClick={() => setPageIndex(totalPages - 1)}
          disabled={currentPage === totalPages}
        >
          <IconChevronsRight className='h-4 w-4' />
        </Button>
      </div>
      <Select
        value={`${pageSize}`}
        onValueChange={(value) => {
          setPageSize(Number(value));
        }}
      >
        <SelectTrigger className='h-8 w-fit'>
          <SelectValue placeholder={pageSize} />
        </SelectTrigger>
        <SelectContent side='top'>
          {pageSizeOptions.map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize} / {t('common.page')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
