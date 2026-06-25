import { EmptyData } from '@/components/common/EmptyData';
import SkeletonTable from '@/components/common/SkeletonTable';
import { TooltipCustom } from '@/components/common/TooltipCustom';
import { orDash } from '@/components/pages/violation-report-conclude/useMinutesColumns';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ViolationRateReportItem } from '@/types/violation-report-management';
import { cn } from '@/lib/utils';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  data: ViolationRateReportItem[];
  isLoading?: boolean;
}

type ColDef = {
  key: string;
  header: string;
  headerClass: string;
  cellClass: string;
  minWidth: number;
  cell: (row: ViolationRateReportItem, index: number) => React.ReactNode;
};

type GroupDef = {
  id: string;
  label?: string;
  groupClass: string;
  cols: ColDef[];
};

const COL_DIVIDER = 'border-l border-border';
const GROUP_DIVIDER = 'border-l-2 border-l-border';
const MAX_TEXT_LENGTH = 60;

const renderCount = (value: number | undefined) => orDash(value?.toString());
const renderRate = (value: number | undefined) => (value != null ? `${value} %` : '--');

const renderTruncated = (value: string | undefined) => {
  const text = orDash(value);
  const isLong = text !== '--' && text.length > MAX_TEXT_LENGTH;

  if (!isLong) {
    return <div className='whitespace-normal break-words'>{text}</div>;
  }

  return (
    <TooltipCustom content={text}>
      <div className='whitespace-normal break-words cursor-default'>
        {`${text.slice(0, MAX_TEXT_LENGTH)}...`}
      </div>
    </TooltipCustom>
  );
};

export const ViolationRateReportTable = ({ data, isLoading }: Props) => {
  const { t } = useTranslation();

  const headerRef = useRef<HTMLTableSectionElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  const groups = useMemo<GroupDef[]>(
    () => [
      {
        id: 'info',
        groupClass: 'text-primary',
        cols: [
          {
            key: 'stt',
            header: t('common.stt'),
            headerClass: 'text-primary text-center px-3',
            cellClass: 'text-center px-3',
            minWidth: 55,
            cell: (_, i) => <div>{i + 1}</div>,
          },
          {
            key: 'branchName',
            header: t('violationReportConclude.colBranch'),
            headerClass: `text-primary px-3 ${COL_DIVIDER}`,
            cellClass: `px-3 ${COL_DIVIDER}`,
            minWidth: 130,
            cell: (row) => renderTruncated(row.branchName),
          },
          {
            key: 'postOfficeName',
            header: t('complaintManagement.postOffice'),
            headerClass: `text-primary px-3 ${COL_DIVIDER}`,
            cellClass: `px-3 ${COL_DIVIDER}`,
            minWidth: 200,
            cell: (row) => renderTruncated(row.postOfficeName),
          },
        ],
      },
      {
        id: 'incoming',
        label: t('violationReportConclude.tabIncoming'),
        groupClass: `text-primary text-center ${GROUP_DIVIDER}`,
        cols: [
          {
            key: 'newIncoming',
            header: t('violationReportConclude.status.not_explained'),
            headerClass: `text-primary text-center px-2 ${GROUP_DIVIDER}`,
            cellClass: `text-center px-2 ${GROUP_DIVIDER}`,
            minWidth: 110,
            cell: (row) => <div>{renderCount(row.newIncoming)}</div>,
          },
          {
            key: 'doneIncoming',
            header: t('violationReportConclude.status.completed'),
            headerClass: `text-primary text-center px-2 ${COL_DIVIDER}`,
            cellClass: `text-center px-2 ${COL_DIVIDER}`,
            minWidth: 110,
            cell: (row) => <div>{renderCount(row.doneIncoming)}</div>,
          },
          {
            key: 'wrongIncoming',
            header: t('violationReportConclude.status.incorrect'),
            headerClass: `text-primary text-center px-2 ${COL_DIVIDER}`,
            cellClass: `text-center px-2 ${COL_DIVIDER}`,
            minWidth: 90,
            cell: (row) => <div>{renderCount(row.wrongIncoming)}</div>,
          },
          {
            key: 'opinionIncoming',
            header: t('violationReportConclude.status.opinion'),
            headerClass: `text-primary text-center px-2 ${COL_DIVIDER}`,
            cellClass: `text-center px-2 ${COL_DIVIDER}`,
            minWidth: 90,
            cell: (row) => <div>{renderCount(row.opinionIncoming)}</div>,
          },
          {
            key: 'closedIncoming',
            header: t('violationReportConclude.status.closed'),
            headerClass: `text-primary text-center px-2 ${COL_DIVIDER}`,
            cellClass: `text-center px-2 ${COL_DIVIDER}`,
            minWidth: 110,
            cell: (row) => <div>{renderCount(row.closedIncoming)}</div>,
          },
          {
            key: 'cancelledIncoming',
            header: t('violationRateReport.colCancelled'),
            headerClass: `text-primary text-center px-2 ${COL_DIVIDER}`,
            cellClass: `text-center px-2 ${COL_DIVIDER}`,
            minWidth: 110,
            cell: (row) => <div>{renderCount(row.cancelledIncoming)}</div>,
          },
        ],
      },
      {
        id: 'outgoing',
        label: t('violationReportConclude.tabOutgoing'),
        groupClass: `text-primary text-center ${GROUP_DIVIDER}`,
        cols: [
          {
            key: 'newOutgoing',
            header: t('violationReportConclude.status.not_explained'),
            headerClass: `text-primary text-center px-2 ${GROUP_DIVIDER}`,
            cellClass: `text-center px-2 ${GROUP_DIVIDER}`,
            minWidth: 110,
            cell: (row) => <div>{renderCount(row.newOutgoing)}</div>,
          },
          {
            key: 'doneOutgoing',
            header: t('violationReportConclude.status.completed'),
            headerClass: `text-primary text-center px-2 ${COL_DIVIDER}`,
            cellClass: `text-center px-2 ${COL_DIVIDER}`,
            minWidth: 110,
            cell: (row) => <div>{renderCount(row.doneOutgoing)}</div>,
          },
          {
            key: 'wrongOutgoing',
            header: t('violationReportConclude.status.incorrect'),
            headerClass: `text-primary text-center px-2 ${COL_DIVIDER}`,
            cellClass: `text-center px-2 ${COL_DIVIDER}`,
            minWidth: 90,
            cell: (row) => <div>{renderCount(row.wrongOutgoing)}</div>,
          },
          {
            key: 'opinionOutgoing',
            header: t('violationReportConclude.status.opinion'),
            headerClass: `text-primary text-center px-2 ${COL_DIVIDER}`,
            cellClass: `text-center px-2 ${COL_DIVIDER}`,
            minWidth: 90,
            cell: (row) => <div>{renderCount(row.opinionOutgoing)}</div>,
          },
          {
            key: 'cancelledOutgoing',
            header: t('violationReportConclude.status.cancelled'),
            headerClass: `text-primary text-center px-2 ${COL_DIVIDER}`,
            cellClass: `text-center px-2 ${COL_DIVIDER}`,
            minWidth: 80,
            cell: (row) => <div>{renderCount(row.cancelledOutgoing)}</div>,
          },
          {
            key: 'closedOutgoing',
            header: t('violationReportConclude.status.closed'),
            headerClass: `text-primary text-center px-2 ${COL_DIVIDER}`,
            cellClass: `text-center px-2 ${COL_DIVIDER}`,
            minWidth: 110,
            cell: (row) => <div>{renderCount(row.closedOutgoing)}</div>,
          },
        ],
      },
      {
        id: 'rate',
        groupClass: `text-primary ${GROUP_DIVIDER}`,
        cols: [
          {
            key: 'explainOnTimeRate',
            header: t('violationRateReport.colConcludedOnTimeRate'),
            headerClass: `text-primary text-center px-3 ${GROUP_DIVIDER}`,
            cellClass: `text-center px-3 ${GROUP_DIVIDER}`,
            minWidth: 150,
            cell: (row) => <div>{renderRate(row.explainOnTimeRate)}</div>,
          },
          {
            key: 'explainOverdueRate',
            header: t('violationRateReport.colOverdueExplainRate'),
            headerClass: `text-primary text-center px-3 ${COL_DIVIDER}`,
            cellClass: `text-center px-3 ${COL_DIVIDER}`,
            minWidth: 150,
            cell: (row) => <div>{renderRate(row.explainOverdueRate)}</div>,
          },
          {
            key: 'concludeOnTimeRate',
            header: t('violationRateReport.colTttvhConcludedOnTimeRate'),
            headerClass: `text-primary text-center px-3 ${COL_DIVIDER}`,
            cellClass: `text-center px-3 ${COL_DIVIDER}`,
            minWidth: 160,
            cell: (row) => <div>{renderRate(row.concludeOnTimeRate)}</div>,
          },
          {
            key: 'concludeOverdueRate',
            header: t('violationRateReport.colTttvhConcludedOverdueRate'),
            headerClass: `text-primary text-center px-3 ${COL_DIVIDER}`,
            cellClass: `text-center px-3 ${COL_DIVIDER}`,
            minWidth: 160,
            cell: (row) => <div>{renderRate(row.concludeOverdueRate)}</div>,
          },
          {
            key: 'totalBonusScore',
            header: t('violationRateReport.colUnitRewardPoints'),
            headerClass: `text-primary text-center px-3 ${COL_DIVIDER}`,
            cellClass: `text-center px-3 ${COL_DIVIDER}`,
            minWidth: 130,
            cell: (row) => <div>{renderCount(row.totalBonusScore)}</div>,
          },
          {
            key: 'totalPenaltyScore',
            header: t('violationRateReport.colUnitDeductionPoints'),
            headerClass: `text-primary text-center px-3 ${COL_DIVIDER}`,
            cellClass: `text-center px-3 ${COL_DIVIDER}`,
            minWidth: 120,
            cell: (row) => <div>{renderCount(row.totalPenaltyScore)}</div>,
          },
        ],
      },
    ],
    [t]
  );

  const allCols = useMemo(() => groups.flatMap((g) => g.cols), [groups]);
  const totalWidth = useMemo(() => allCols.reduce((sum, col) => sum + col.minWidth, 0), [allCols]);
  const isEmpty = !isLoading && data.length === 0;

  return (
    <Card className='px-6'>
      <div className='flex flex-col gap-4'>
        <div className='relative'>
          <div className='overflow-auto scrollbar-custom'>
            <Table className='border-b' style={{ tableLayout: 'fixed', width: totalWidth }}>
              <colgroup>
                {allCols.map((col) => (
                  <col key={col.key} style={{ width: col.minWidth, minWidth: col.minWidth }} />
                ))}
              </colgroup>

              <TableHeader ref={headerRef} className='bg-sidebar-primary'>
                <TableRow>
                  {groups.map((group) => (
                    <TableHead
                      key={group.id}
                      colSpan={group.cols.length}
                      className={cn(group.groupClass, 'whitespace-nowrap')}
                    >
                      {group.label}
                    </TableHead>
                  ))}
                </TableRow>

                <TableRow>
                  {allCols.map((col) => (
                    <TableHead
                      key={col.key}
                      className={cn(
                        col.headerClass,
                        'overflow-hidden whitespace-normal break-words py-2'
                      )}
                    >
                      {col.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <SkeletonTable rows={10} columns={allCols.length} />
                ) : data.length > 0 ? (
                  data.map((row, index) => (
                    <TableRow key={index}>
                      {allCols.map((col) => (
                        <TableCell key={col.key} className={col.cellClass}>
                          {col.cell(row, index)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={allCols.length} className='h-72' />
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
              <EmptyData title={t('violationReportConclude.noData')} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
