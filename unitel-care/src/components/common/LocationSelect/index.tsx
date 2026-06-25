import {
  useWatch,
  Controller,
  type Control,
  type FieldValues,
  type UseFormSetValue,
} from 'react-hook-form';
import { Label } from '@/components/ui/label';
import type { BranchResponse, PostManResponse, PostOfficeResponse } from '@/types/post-office';
import type { SelectDataFn } from '@/types/common';
import { Combobox } from '../ComboBoxCustom';
import { useLocationChain } from '@/hooks/useLocationChain';

type LocationSelectProps<T extends FieldValues> = {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  branchName?: string;
  postOfficeName?: string;
  postmanName?: string;
  branchLabel?: string;
  postOfficeLabel?: string;
  postmanLabel?: string;
  branchPlaceholder?: string;
  postOfficePlaceholder?: string;
  postmanPlaceholder?: string;
  onBranchChange?: (branchId: string) => void;
  onPostOfficeChange?: (postOfficeId: string) => void;
  onPostmanChange?: (postmanId: string) => void;
  disabled?: boolean;
  required?: boolean | { branch?: boolean; postOffice?: boolean; postman?: boolean };
  autoClearPostOffice?: boolean;
  autoClearPostman?: boolean;
  showPostman?: boolean;
  selectBranchData?: SelectDataFn<BranchResponse>;
  selectPostOfficeData?: SelectDataFn<PostOfficeResponse>;
  selectPostmanData?: SelectDataFn<PostManResponse>;
};

export function LocationSelect<T extends FieldValues>({
  control,
  setValue,
  branchName = 'branchId',
  postOfficeName = 'postOfficeId',
  postmanName = 'postmanId',
  branchLabel = 'location.branch',
  postOfficeLabel = 'location.postOffice',
  postmanLabel = 'location.postman',
  branchPlaceholder = 'location.placeholderBranch',
  postOfficePlaceholder = 'location.placeholderPostOffice',
  postmanPlaceholder = 'location.placeholderPostman',
  onBranchChange,
  onPostOfficeChange,
  onPostmanChange,
  disabled = false,
  required = false,
  autoClearPostOffice = true,
  autoClearPostman = true,
  showPostman = true,
  selectBranchData,
  selectPostOfficeData,
  selectPostmanData,
}: LocationSelectProps<T>) {
  const selectedBranchId = useWatch({
    control,
    name: branchName as Parameters<typeof control.register>[0],
  }) as string | undefined;
  const selectedPostOfficeId = useWatch({
    control,
    name: postOfficeName as Parameters<typeof control.register>[0],
  }) as string | undefined;

  const {
    branchOptions,
    postOfficeOptions,
    postmanOptions,
    branchLoading,
    postOfficeLoading,
    postmanLoading,
  } = useLocationChain({
    branchId: selectedBranchId,
    postOfficeId: selectedPostOfficeId,
    showPostman,
    selectBranchData,
    selectPostOfficeData,
    selectPostmanData,
  });

  const getRequired = (field: string) => {
    if (typeof required === 'boolean') return required;
    return required?.[field as keyof typeof required] || false;
  };

  return (
    <>
      {/* Chi nhánh */}
      <div className='flex flex-col gap-2'>
        <Label htmlFor={branchName}>
          {branchLabel}
          {getRequired('branch') && <span className='text-red-500 ml-1'>*</span>}
        </Label>
        <Controller
          name={branchName as Parameters<typeof control.register>[0]}
          control={control}
          rules={getRequired('branch') ? { required: 'Vui lòng chọn chi nhánh' } : undefined}
          render={({ field, fieldState }) => (
            <Combobox
              options={branchOptions}
              value={field.value}
              onChange={(val: string) => {
                field.onChange(val);
                if (autoClearPostOffice && selectedPostOfficeId) {
                  setValue(
                    postOfficeName as Parameters<typeof setValue>[0],
                    '' as Parameters<typeof setValue>[1]
                  );
                }
                if (autoClearPostman && selectedPostOfficeId) {
                  setValue(
                    postmanName as Parameters<typeof setValue>[0],
                    '' as Parameters<typeof setValue>[1]
                  );
                }
                onBranchChange?.(val);
              }}
              placeholder={branchPlaceholder}
              disable={disabled || branchLoading}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      {/* Bưu cục */}
      <div className='flex flex-col gap-2'>
        <Label htmlFor={postOfficeName}>
          {postOfficeLabel}
          {getRequired('postOffice') && <span className='text-red-500 ml-1'>*</span>}
        </Label>
        <Controller
          name={postOfficeName as Parameters<typeof control.register>[0]}
          control={control}
          rules={getRequired('postOffice') ? { required: 'Vui lòng chọn bưu cục' } : undefined}
          render={({ field, fieldState }) => (
            <Combobox
              options={postOfficeOptions}
              value={field.value}
              onChange={(val: string) => {
                field.onChange(val);
                if (autoClearPostman && selectedPostOfficeId) {
                  setValue(
                    postmanName as Parameters<typeof setValue>[0],
                    '' as Parameters<typeof setValue>[1]
                  );
                }
                onPostOfficeChange?.(val);
              }}
              placeholder={postOfficePlaceholder}
              disable={disabled || !selectedBranchId || postOfficeLoading}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      {/* Postman */}
      {showPostman && (
        <div className='flex flex-col gap-2'>
          <Label htmlFor={postmanName}>
            {postmanLabel}
            {getRequired('postman') && <span className='text-red-500 ml-1'>*</span>}
          </Label>
          <Controller
            name={postmanName as Parameters<typeof control.register>[0]}
            control={control}
            rules={getRequired('postman') ? { required: 'Vui lòng chọn nhân viên' } : undefined}
            render={({ field, fieldState }) => (
              <Combobox
                options={postmanOptions}
                value={field.value}
                onChange={(val: string) => {
                  field.onChange(val);
                  onPostmanChange?.(val);
                }}
                placeholder={postmanPlaceholder}
                disable={disabled || !selectedPostOfficeId || postmanLoading}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
      )}
    </>
  );
}
