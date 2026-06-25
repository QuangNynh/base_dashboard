import { useQuery } from '@tanstack/react-query';
import { postOfficeService } from '@/services/postOfficeService';
import type { Option, SelectDataFn } from '@/types/common';
import type { BranchResponse, PostManResponse, PostOfficeResponse } from '@/types/post-office';

const defaultSelectBranchData: SelectDataFn<BranchResponse> = (res) =>
  res.data.map((item) => ({
    value: item.departmentId,
    label: item.name,
  }));

const defaultSelectPostOfficeData: SelectDataFn<PostOfficeResponse> = (res) =>
  res.data.map((item) => ({
    value: item.departmentId,
    label: item.name,
  }));

const defaultSelectPostmanData: SelectDataFn<PostManResponse> = (res) =>
  res.data.map((item) => ({
    value: String(item.userId),
    label: item.fullName,
  }));

export type UseLocationChainOptions = {
  branchId?: string;
  postOfficeId?: string;
  showPostman?: boolean;
  selectBranchData?: SelectDataFn<BranchResponse>;
  selectPostOfficeData?: SelectDataFn<PostOfficeResponse>;
  selectPostmanData?: SelectDataFn<PostManResponse>;
  branchQueryKey?: string[];
  postOfficeQueryKey?: string[];
  postmanQueryKey?: string[];
};

export type UseLocationChainResult = {
  branchOptions: Option[];
  postOfficeOptions: Option[];
  postmanOptions: Option[];
  branchLoading: boolean;
  postOfficeLoading: boolean;
  postmanLoading: boolean;
};

export function useLocationChain({
  branchId,
  postOfficeId,
  showPostman = true,
  selectBranchData = defaultSelectBranchData,
  selectPostOfficeData = defaultSelectPostOfficeData,
  selectPostmanData = defaultSelectPostmanData,
  branchQueryKey = ['branch-list'],
  postOfficeQueryKey = ['post-office-list'],
  postmanQueryKey = ['postman-list'],
}: UseLocationChainOptions = {}): UseLocationChainResult {
  const { data: branchOptions = [], isLoading: branchLoading } = useQuery<
    BranchResponse,
    Error,
    Option[]
  >({
    queryKey: branchQueryKey,
    queryFn: () => postOfficeService.getListBranch(),
    select: selectBranchData,
  });

  const { data: postOfficeOptions = [], isLoading: postOfficeLoading } = useQuery<
    PostOfficeResponse,
    Error,
    Option[]
  >({
    queryKey: [...postOfficeQueryKey, branchId],
    queryFn: () => postOfficeService.getListPostOffice(branchId ?? ''),
    enabled: !!branchId,
    select: selectPostOfficeData,
  });

  const { data: postmanOptions = [], isLoading: postmanLoading } = useQuery<
    PostManResponse,
    Error,
    Option[]
  >({
    queryKey: [...postmanQueryKey, postOfficeId],
    queryFn: () => postOfficeService.getPostMan(postOfficeId ?? ''),
    enabled: showPostman && !!postOfficeId,
    select: selectPostmanData,
  });

  return {
    branchOptions,
    postOfficeOptions,
    postmanOptions,
    branchLoading,
    postOfficeLoading,
    postmanLoading,
  };
}
