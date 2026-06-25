import { ModalConfirmDeleteAssignmentSetup } from '@/components/common/ModalConfirmDeleteAssignmentSetup';
import { ModalUpdateAssignmentSetup } from '@/components/common/ModalUpdateAssignmentSetup';
import { AssignmentTable } from '@/components/pages/assignment-setup/AssignmentTable';
import { FilterAssignmentSetup } from '@/components/pages/assignment-setup/FilterAssignmentSetup';
import { Card } from '@/components/ui/card';
import { complaintService } from '@/services/complaintService';
import type {
  AssignmentSetup as AssignmentSetupItem,
  AssignmentSetupParam,
} from '@/types/complaint-management';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PaginationState } from '@tanstack/react-table';
import { t } from 'i18next';
import { useState } from 'react';
import { toast } from 'sonner';

export const AssignmentSetup = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [editItem, setEditItem] = useState<AssignmentSetupItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<AssignmentSetupItem | null>(null);
  const [dataFilter, setDataFilter] = useState<Pick<AssignmentSetupParam, 'keyword'>>({
    keyword: '',
  });

  const handleFilterSubmit = (data: Pick<AssignmentSetupParam, 'keyword'>) => {
    setDataFilter(data);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const queryClient = useQueryClient();

  const { mutate: deleteAssignment, isPending: isDeleting } = useMutation({
    mutationFn: (employeeCode: string) => complaintService.deleteAssignmentSetUp(employeeCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment-setup'] });
      setDeleteItem(null);
      toast.success(t('settingComplaint.assignmentSetup.deleteConfigSuccess'));
    },
    onError: () => {
      toast.error(t('settingComplaint.assignmentSetup.deleteConfigError'));
    },
  });

  const { mutate: updateAssignment, isPending: isUpdating } = useMutation({
    mutationFn: ({
      employeeCode,
      departmentIds,
    }: {
      employeeCode: string;
      departmentIds: string[];
    }) => complaintService.updateAssignmentSetUp(employeeCode, departmentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment-setup'] });
      setEditItem(null);
      toast.success(t('settingComplaint.assignmentSetup.editConfigSuccess'));
    },
    onError: () => {
      toast.error(t('settingComplaint.assignmentSetup.updateError'));
    },
  });

  const handleDelete = () => {
    if (deleteItem) deleteAssignment(deleteItem.employeeCode);
  };

  const handleUpdate = (data: { employeeCode: string; departmentIds: string[] }) => {
    updateAssignment({ employeeCode: data.employeeCode, departmentIds: data.departmentIds });
  };

  const { data: errorCausesData, isLoading: isLoadingErrorCauses } = useQuery({
    queryKey: ['assignment-setup', dataFilter, pagination],
    queryFn: () =>
      complaintService.getAssignmentSetUp({
        ...dataFilter,
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
      }),
  });

  return (
    <Card className='p-4'>
      <FilterAssignmentSetup onSubmit={handleFilterSubmit} onCreate={() => setEditItem(null)} />

      <AssignmentTable
        data={errorCausesData?.data?.page_data || []}
        setPagination={setPagination}
        pagination={pagination}
        onEdit={(item) => setEditItem(item)}
        onDelete={(item) => setDeleteItem(item)}
        isLoading={isLoadingErrorCauses}
      />

      <ModalUpdateAssignmentSetup
        open={!!editItem}
        onOpenChange={(open) => !open && setEditItem(null)}
        onConfirm={handleUpdate}
        isLoading={isUpdating}
        data={editItem}
      />

      <ModalConfirmDeleteAssignmentSetup
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </Card>
  );
};
