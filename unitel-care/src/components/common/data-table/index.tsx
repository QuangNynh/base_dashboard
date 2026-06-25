import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type Updater,
} from '@tanstack/react-table';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { EmptyData } from '../EmptyData';
import SkeletonTable from '../SkeletonTable';
import { DataTablePagination } from './pagination';
import { TooltipCustom } from '../TooltipCustom';

export interface ColumnMeta {
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  align?: 'left' | 'center' | 'right';
  ellipsis?: boolean;
}

const alignClass: Record<NonNullable<ColumnMeta['align']>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSizeOptions?: number[];
  manualPagination?: boolean;
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  selectedRowIds?: string[] | number[];
  onSelectedRowIdsChange?: (selectedRowIds: string[]) => void;
  isLoading?: boolean;
  children?: React.ReactNode;
  errorMessage?: string;
  emptyHeight?: string;
}

function EllipsisCell({
  children,
  staticTooltip,
}: {
  children: React.ReactNode;
  staticTooltip?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [tooltipContent, setTooltipContent] = useState<string | undefined>(undefined);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    const el = divRef.current;
    if (!el) return;

    // Chỉ hiện tooltip khi nội dung thực sự bị cắt (truncate)
    const isTruncated = el.scrollWidth > el.clientWidth;

    if (!isTruncated) {
      setTooltipContent(undefined);
      return;
    }

    // Lấy text: ưu tiên staticTooltip (string/number), fallback textContent (JSX)
    const text = staticTooltip ?? el.textContent?.trim() ?? undefined;
    setTooltipContent(text || undefined);
  });

  return (
    <TooltipCustom content={tooltipContent}>
      <div ref={divRef} className='truncate'>
        {children}
      </div>
    </TooltipCustom>
  );
}

export function DataTable<TData, TValue>({
  isLoading = false,
  columns,
  data,
  pageSizeOptions = [5, 10, 20, 30, 40, 50],
  manualPagination = false,
  pageCount,
  pagination,
  onPaginationChange,
  rowSelection: externalRowSelection,
  onRowSelectionChange: externalOnRowSelectionChange,
  getRowId,
  selectedRowIds,
  onSelectedRowIdsChange,
  errorMessage,
  emptyHeight = 'h-72',
  children,
}: DataTableProps<TData, TValue>) {
  const paginationRef = useRef(pagination);

  const rowSelection = useMemo(() => {
    if (selectedRowIds) {
      return selectedRowIds.reduce((acc, id) => ({ ...acc, [id]: true }), {} as RowSelectionState);
    }
    return externalRowSelection;
  }, [selectedRowIds, externalRowSelection]);

  const { t } = useTranslation();

  const onRowSelectionChange = useCallback(
    (updaterOrValue: Updater<RowSelectionState>) => {
      const nextSelection =
        typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection || {}) : updaterOrValue;

      if (externalOnRowSelectionChange) {
        externalOnRowSelectionChange(nextSelection);
      }

      if (onSelectedRowIdsChange) {
        const ids = Object.keys(nextSelection).filter((key) => nextSelection[key]);
        onSelectedRowIdsChange(ids);
      }
    },
    [rowSelection, externalOnRowSelectionChange, onSelectedRowIdsChange]
  );

  const handlePaginationChange = useCallback(
    (updater: Updater<PaginationState>) => {
      if (!onPaginationChange) return;

      const old = paginationRef.current;

      const next = typeof updater === 'function' ? updater(old!) : updater;

      // 🚫 chặn loop: chỉ gọi khi value thực sự đổi
      if (!old || next.pageIndex !== old.pageIndex || next.pageSize !== old.pageSize) {
        onPaginationChange(next); // ✅ luôn gửi VALUE, không gửi updater
      }
    },
    [onPaginationChange]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      ...(pagination && { pagination }),
      ...(rowSelection && { rowSelection }),
    },
    onPaginationChange: handlePaginationChange,
    onRowSelectionChange,
    manualPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId,
  });

  const headerRef = useRef<HTMLTableSectionElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  useLayoutEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  const isEmpty = !isLoading && !table.getRowModel().rows?.length;

  return (
    <div className='flex flex-col gap-4'>
      {/* Wrapper: position:relative, NO overflow — lets EmptyData be absolute without scrolling */}
      <div className='relative'>
        <div className='overflow-auto scrollbar-custom'>
          <Table className='border-b min-w-max'>
            <TableHeader ref={headerRef} className='bg-sidebar-primary'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta as ColumnMeta | undefined;
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={cn(
                          'text-primary',
                          meta?.align && alignClass[meta.align],
                          meta?.className,
                          meta?.headerClassName
                        )}
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <SkeletonTable
                  rows={pagination?.pageSize || 5}
                  columns={table.getAllLeafColumns().length}
                />
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta as ColumnMeta | undefined;
                      const isEllipsis = meta?.ellipsis;
                      const rawValue = cell.getValue();
                      const staticTooltip =
                        isEllipsis && (typeof rawValue === 'string' || typeof rawValue === 'number')
                          ? String(rawValue)
                          : undefined;

                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            'max-w-0',
                            meta?.align && alignClass[meta.align],
                            meta?.className,
                            meta?.cellClassName
                          )}
                          style={{ width: cell.column.getSize() }}
                        >
                          {isEllipsis ? (
                            <EllipsisCell staticTooltip={staticTooltip}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </EllipsisCell>
                          ) : (
                            <div>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                /* Empty placeholder row — keeps the table body area visible */
                <TableRow>
                  <TableCell colSpan={table.getAllLeafColumns().length} className={emptyHeight} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {isEmpty && (
          <div
            className='absolute left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none'
            style={{ top: headerHeight }}
          >
            <EmptyData title={errorMessage || t('common.noResults')} />
          </div>
        )}
      </div>

      <div className='flex xl:flex-row flex-col items-center justify-between px-2'>
        {children}
        <div className='flex-1 text-sm text-muted-foreground'>
          {!manualPagination &&
            table.getFilteredSelectedRowModel().rows.length > 0 &&
            `${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} row(s) selected.`}
        </div>

        <div className='flex items-center gap-6 lg:gap-8'>
          <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
        </div>
      </div>
    </div>
  );
}
