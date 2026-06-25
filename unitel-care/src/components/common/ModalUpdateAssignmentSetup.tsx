import { ComboBoxMulti } from '@/components/common/ComboBoxMuilti';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AssignmentSetup } from '@/types/complaint-management';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { postOfficeService } from '@/services/postOfficeService';
import type { PostOffice, PostOfficeResponse } from '@/types/post-office';

const schema = z.object({
  employeeCode: z.string().min(1),
  fullName: z.string().min(1),
  departmentIds: z.array(z.string()).min(1),
});

type FormData = z.infer<typeof schema>;

interface ModalUpdateAssignmentSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: FormData) => void;
  isLoading?: boolean;
  data?: AssignmentSetup | null;
}

export function ModalUpdateAssignmentSetup({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  data,
}: ModalUpdateAssignmentSetupProps) {
  const { t } = useTranslation();

  const { data: postOfficeAllData, isLoading: isLoadingPostOfficeAllData } = useQuery<
    PostOfficeResponse,
    Error,
    PostOffice[]
  >({
    queryKey: ['post-office-all-list'],
    queryFn: () => postOfficeService.getAllListPostOffice(),
    select: (res) => res.data,
  });

  const postOfficeOptions = useMemo(
    () =>
      postOfficeAllData?.map((item) => ({
        value: item.departmentId,
        label: item.name,
      })) ?? [],
    [postOfficeAllData]
  );

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeCode: '',
      fullName: '',
      departmentIds: [],
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        employeeCode: data.employeeCode,
        fullName: data.fullName,
        departmentIds: data.departments?.map((d) => d.departmentId.toString()) ?? [],
      });
    }
  }, [data, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[586px] p-0 overflow-hidden'>
        <DialogHeader className='bg-[#F6F8FF] px-6 py-4'>
          <DialogTitle className='text-center text-base font-semibold '>
            {t('settingComplaint.assignmentSetup.editConfig')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onConfirm)}>
          <div className='flex flex-col gap-4 px-8 pt-2 pb-8'>
            <div className='flex flex-col gap-2'>
              <Label>{t('settingComplaint.assignmentSetup.employeeCode')}</Label>
              <Controller
                name='employeeCode'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Input {...field} disabled />
                    {fieldState.error && (
                      <p className='text-sm text-destructive'>{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <Label>{t('settingComplaint.assignmentSetup.employeeName')}</Label>
              <Controller
                name='fullName'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Input {...field} disabled />
                    {fieldState.error && (
                      <p className='text-sm text-destructive'>{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <Label>{t('complaintManagement.postOffice')}</Label>
              <Controller
                name='departmentIds'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <ComboBoxMulti
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('settingComplaint.assignmentSetup.placeholderArea')}
                      options={postOfficeOptions}
                      isLoading={isLoadingPostOfficeAllData}
                    />
                    {fieldState.error && (
                      <p className='text-sm text-destructive'>
                        {t('settingComplaint.assignmentSetup.departmentRequired')}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className='flex gap-4 w-full mt-2'>
              <Button
                type='button'
                variant='outline'
                className='flex-1 border-[#F97316] text-[#F97316] hover:bg-orange-50 hover:text-[#F97316]'
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type='submit'
                className='flex-1 bg-[#F97316] hover:bg-orange-600 text-white'
                disabled={isLoading}
              >
                {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                {t('common.confirm')}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
