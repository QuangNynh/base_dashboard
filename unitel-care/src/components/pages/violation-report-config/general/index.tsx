import { Card } from '@/components/ui/card';
import { Create } from './Create';
import { GeneralTable } from './Table';
import { ModalDeleteConfig } from './ModalDeleteConfig';
import { useEffect, useState } from 'react';
import type { ViolationReportGeneralRow, ViolationUserBranchData } from '@/types/violation-report';
import type { PaginationState } from '@tanstack/react-table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { violationReportService } from '@/services/violationReport';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const GeneralComponent = () => {
  const { t } = useTranslation();

  const [deleteItem, setDeleteItem] = useState<ViolationReportGeneralRow | null>(null);
  const [editItem, setEditItem] = useState<ViolationReportGeneralRow | null>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['violation-user-branch', pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      violationReportService.getUserBranch({
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
      }),
  });

  const { mutateAsync: createUserBranch, isPending: isCreating } = useMutation({
    mutationFn: (payload: ViolationUserBranchData) =>
      violationReportService.createUserBranch(payload),
    onSuccess: async () => {
      toast.success(t('common.createSuccess'));
      await refetch();
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { detail?: string } }; detail?: string };
      toast.error(e?.response?.data?.detail || e?.detail || t('common.errorDefault'));
    },
  });

  const { mutateAsync: deleteUserBranch, isPending: isDeleting } = useMutation({
    mutationFn: (inspectorAssignmentId: number) =>
      violationReportService.deleteUserBranch(inspectorAssignmentId),
    onSuccess: async () => {
      toast.success(t('common.deleteSuccess'));
      setDeleteItem(null);
      await refetch();
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { detail?: string } }; detail?: string };
      toast.error(e?.response?.data?.detail || e?.detail || t('common.errorDefault'));
    },
  });

  const { mutateAsync: editUserBranch, isPending: isEditing } = useMutation({
    mutationFn: (payload: { inspector_assignment_id: number; data: ViolationUserBranchData }) =>
      violationReportService.editUserBranch(payload.inspector_assignment_id, payload.data),
    onSuccess: async () => {
      toast.success(t('common.updateSuccess'));
      setEditItem(null);
      await refetch();
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { detail?: string } }; detail?: string };
      toast.error(e?.response?.data?.detail || e?.detail || t('common.errorDefault'));
    },
  });

  // map API -> table row
  const rows: ViolationReportGeneralRow[] = data?.data?.page_data ?? [];

  const pageCount = data?.data?.pagination?.totalPages ?? 0;

  const handleSubmitUserBranch = async (data: ViolationUserBranchData) => {
    if (editItem) {
      await editUserBranch({
        inspector_assignment_id: editItem.id,
        data,
      });
      return;
    }
    await createUserBranch(data);
  };

  useEffect(() => {
    if (!!data?.data?.page_data && !data?.data?.page_data?.length && pagination.pageIndex > 0) {
      setPagination({
        ...pagination,
        pageIndex: pagination.pageIndex - 1,
      });
    }
  }, [data, pagination]);

  return (
    <Card className='p-4'>
      <Create
        onSubmit={handleSubmitUserBranch}
        isLoading={isCreating || isEditing}
        isEdit={!!editItem}
        defaultValues={
          editItem
            ? {
                employee: String(editItem.employee_id), // nếu API list có employee_id thì dùng employee_id
                branch: editItem.assigned_branches,
                employeeName: editItem.employee_name,
                employeeCode: editItem.employee_code,
              }
            : undefined
        }
        onClear={() => setEditItem(null)}
      />
      <GeneralTable
        data={rows}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoading}
        pageCount={pageCount}
        onEdit={(item) => setEditItem(item)}
        onDelete={(item) => setDeleteItem(item)}
      />

      <ModalDeleteConfig
        open={!!deleteItem}
        onOpenChange={() => setDeleteItem(null)}
        onConfirm={async () => {
          if (!deleteItem) return;
          await deleteUserBranch(deleteItem.id);
        }}
        isLoading={isDeleting}
      />
    </Card>
  );
};

export default GeneralComponent;
