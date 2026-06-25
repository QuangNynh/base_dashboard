import ButtonLoading from '@/components/common/ButtonLoading';
import { Combobox } from '@/components/common/ComboBoxCustom';
import { ComboBoxMulti } from '@/components/common/ComboBoxMuilti';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { violationReportService } from '@/services/violationReport';
import type { ViolationUserBranchData } from '@/types/violation-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const buildSchema = (t: (key: string, options?: Record<string, unknown>) => string) =>
  z.object({
    employee: z.string().trim().min(1, t('violationReport.generalFilter.employeeRequired')),
    branch: z.array(z.string()).min(1, t('violationReport.generalFilter.branchRequired')),
  });

type FormValues = {
  employee: string;
  branch: string[];
};

interface Props {
  onSubmit: (data: ViolationUserBranchData) => void | Promise<void>;
  isLoading?: boolean;
  isEdit?: boolean;
  defaultValues?: {
    employee: string;
    employeeName: string;
    employeeCode: string;
    branch: Array<{
      branch_code: string;
      branch_name: string;
      branch_id: number;
    }>;
  };
  onClear: () => void;
}

export const Create = ({
  onSubmit,
  isLoading = false,
  defaultValues,
  isEdit = false,
  onClear,
}: Props) => {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState('');
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string }>();

  const form = useForm<FormValues>({
    resolver: zodResolver(buildSchema(t)),
    defaultValues: {
      employee: '',
      branch: [],
    },
    values: {
      employee: defaultValues?.employee || '',
      branch: defaultValues?.branch?.map((i) => i?.branch_id + '') || [],
    },
  });

  const { control, handleSubmit, reset, setValue } = form;

  const employeeValue = useWatch({ control, name: 'employee' });

  const {
    data: departmentsData,
    isLoading: isLoadingDepartments,
    refetch: refetchDepartment,
  } = useQuery({
    queryKey: ['departmentsModalUpdateAssignmentSetup'],
    queryFn: () => violationReportService.getUserBranchUnConfig(),
  });

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['violation-report-users-by-role', keyword],
    queryFn: () =>
      violationReportService.getUserByRole({
        roleCode: 'ODOWTC',
        limit: 20,
        keyword,
      }),
    select: (res) => {
      const _data = res.data;

      if (!defaultValues) {
        return res;
      }

      if (
        !!defaultValues?.employee &&
        _data?.some((i) => String(i?.userId) != defaultValues?.employee)
      ) {
        return {
          data: [
            {
              userId: defaultValues?.employee || '',
              userName: defaultValues?.employeeName,
              staffCode: defaultValues?.employeeCode,
              fullName: defaultValues?.employeeName || '',
              phoneNumber: '',
            },
            ..._data,
          ],
          success: res.success,
        };
      } else {
        return {
          data: _data,
          success: res.success,
        };
      }
    },
  });

  const departmentOptions = useMemo(() => {
    const options =
      departmentsData?.data?.map((d: { departmentId: string; name: string }) => ({
        value: String(d.departmentId),
        label: d.name,
      })) ?? [];

    if (!isEdit) {
      return options;
    }

    const defaults =
      defaultValues?.branch?.map((i) => ({
        value: i?.branch_id + '',
        label: i?.branch_name,
      })) ?? [];

    return [...defaults, ...options];
  }, [isEdit, departmentsData, defaultValues]);

  const employeeOptions = useMemo(() => {
    const options =
      usersData?.data?.map(
        (user: { userId: number | string; fullName: string; staffCode: string }) => ({
          value: String(user.userId),
          label: user?.staffCode + ' - ' + user.fullName,
        })
      ) ?? [];

    if (
      !!selectedOption?.value &&
      !options.some((u: { value: string }) => u?.value === selectedOption?.value)
    ) {
      return [selectedOption, ...options];
    }

    return options;
  }, [usersData, selectedOption]);

  const handleApply = async (values: FormValues) => {
    const selectedUser = employeeOptions?.find(
      (u: { value: string }) => u?.value === values.employee
    );

    const allDataDepartments = [
      ...(defaultValues?.branch?.map((i) => ({
        departmentId: i?.branch_id + '',
        code: i?.branch_code,
        name: i?.branch_name,
      })) ?? []),
      ...(departmentsData?.data ?? []),
    ];

    const selectedBranches = allDataDepartments.filter((d: { departmentId: string }) =>
      values.branch.includes(String(d.departmentId))
    );

    if (!selectedUser || selectedBranches.length === 0) return;

    await onSubmit({
      employee_id: Number(selectedUser?.value),
      employee_code: selectedUser?.label?.split(' - ')[0] || '',
      employee_name: selectedUser?.label?.split(' - ')[1] || '',
      assigned_branches: selectedBranches.map(
        (b: { departmentId: string; code?: string; name: string }) => ({
          branch_id: Number(b.departmentId),
          branch_code: String(b.code ?? ''),
          branch_name: b.name,
        })
      ),
    });

    reset({
      employee: '',
      branch: [],
    });
    setSelectedOption(undefined);
  };

  const handleClear = () => {
    reset({
      employee: '',
      branch: [],
    });
    onClear();
  };

  useEffect(() => {
    if (!isEdit) {
      setValue('branch', []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeValue, isEdit]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleApply)}>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-baseline gap-4'>
          <FormField
            control={form.control}
            name='employee'
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className='font-medium'>
                  {t('violationReport.generalFilter.employee')}{' '}
                  <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <Combobox
                    options={employeeOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t('violationReport.generalFilter.employeePlaceholder')}
                    isLoading={isLoadingUsers}
                    onFilter={setKeyword}
                    disable={isEdit}
                    hasError={!!fieldState?.error}
                    onChangeOption={(option) =>
                      setSelectedOption({ label: option?.label || '', value: option?.value || '' })
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='branch'
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className='font-medium'>
                  {t('violationReport.generalFilter.branch')}{' '}
                  <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <ComboBoxMulti
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t('violationReport.generalFilter.branchPlaceholder')}
                    options={departmentOptions}
                    isLoading={isLoadingDepartments}
                    checkbox
                    disable={!employeeValue}
                    hasError={!!fieldState?.error}
                    onOpenFn={refetchDepartment}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='relative lg:top-[34px] flex items-center gap-2'>
            <ButtonLoading
              loading={isLoading}
              type='submit'
              className='bg-primary hover:bg-primary/90 text-white'
            >
              {t('violationReport.generalFilter.confirm')}
            </ButtonLoading>
            {isEdit && (
              <Button
                type='button'
                variant='outline'
                onClick={handleClear}
                className='border-primary text-primary hover:text-primary'
              >
                {t('violationReport.errorGroup.clearData')}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};
