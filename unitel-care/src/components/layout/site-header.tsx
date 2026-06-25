import EnIcon from '@/assets/icons/EnIcon';
import KmIcon from '@/assets/icons/KmIcon';
import VnIcon from '@/assets/icons/VnIcon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TENANT_CODE } from '@/constants/common';
import { ROLE_TO_GROUP } from '@/constants/permissions';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDebounce } from '@/hooks/useDebounce';
import { LANG_STORAGE_KEY } from '@/i18n';
import { tokenService } from '@/lib/token';
import { Combobox } from '../common/ComboBoxCustom';
import { useEffect, useState, useRef } from 'react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { usePageLoadingStore } from '@/store/usePageLoadingStore';
import type { UserInfoToken } from '@/types/auth';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import { SidebarTrigger } from '../ui/sidebar';
import { NavUser } from './nav-user';
import intersection from 'lodash/intersection';

const LIMIT = 20;

export function SiteHeader() {
  const { i18n, t } = useTranslation();
  const isMobile = useIsMobile();
  const { currentUser, setCurrentUser } = useAuthStore();
  const { setIsPageLoading } = usePageLoadingStore();
  const username = currentUser?.username ?? '';
  const queryClient = useQueryClient();

  const userInfoTokenString = tokenService.getUserInfoToken();
  const userInfoToken = userInfoTokenString ? JSON.parse(userInfoTokenString) : null;
  const departmentCode = userInfoToken?.['cth-post-code'] ?? '';

  const [postUser, setPostUser] = useState<string>(departmentCode);
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 300);

  // Cập nhật postUser về default khi có departmentCode từ AuthStore
  useEffect(() => {
    if (departmentCode && !postUser) {
      setPostUser(departmentCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentCode]);

  // Lấy giá trị bưu cục default ban đầu và KHÔNG bao giờ đổi để tránh gọi API dư thừa
  const initialDeptCode = useRef(departmentCode).current;

  // ── Query lấy Bưu cục default lúc load ───────────────────────────────────────
  const { data: defaultPostData, isFetching: isFetchingDefault } = useQuery({
    queryKey: ['default-department-post', username, initialDeptCode],
    queryFn: () =>
      authService.getDepartmentUser(username, {
        offset: 0,
        limit: 1,
        query: initialDeptCode,
      }),
    enabled: !!username && !!initialDeptCode,
    staleTime: Infinity,
  });

  // ── Infinite query danh sách ───────────────────────────────────────────────
  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['department-posts', username, debouncedSearch],
    queryFn: ({ pageParam = 0 }) =>
      authService.getDepartmentUser(username, {
        offset: pageParam as number,
        limit: LIMIT,
        ...(debouncedSearch ? { query: debouncedSearch } : {}),
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length >= LIMIT) {
        return allPages.length * LIMIT;
      }
      return undefined;
    },
    enabled: !!username,
  });

  // Hàm lấy tên bưu cục theo ngôn ngữ hiện tại
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getDeptName = (dept: typeof defaultPostData extends Array<infer U> ? U : any) => {
    switch (i18n.language) {
      case 'vi':
        return dept.viVnName || dept.name || dept.code || '';
      case 'en':
        return dept.enUsName || dept.name || dept.code || '';
      case 'km':
        return dept.kmKhmName || dept.name || dept.code || '';
      case 'lo':
        return dept.loLaoName || dept.name || dept.code || '';
      default:
        return dept.name || dept.code || '';
    }
  };

  // Gộp thông tin default post và mảng mảng infinite options phẳng
  const defaultOptions = (defaultPostData ?? []).map((dept) => ({
    label: getDeptName(dept),
    value: dept.code ?? String(dept.departmentId ?? ''),
  }));

  const infiniteOptions = (data?.pages ?? []).flatMap((page) =>
    page.map((dept) => ({
      label: getDeptName(dept),
      value: dept.code ?? String(dept.departmentId ?? ''),
    }))
  );

  // Lọc xoá phần tử bị trùng (để default option đã hiển thị thì dưới list không lặp lại)
  const options = [...defaultOptions, ...infiniteOptions].reduce(
    (acc, curr) => {
      if (!acc.some((o) => o.value === curr.value)) {
        acc.push(curr);
      }
      return acc;
    },
    [] as typeof defaultOptions
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  const handleChangePost = async (value: string) => {
    if (!value || value === postUser) return;
    setPostUser(value);

    const refreshToken = tokenService.getRefreshToken();
    const tokenId = tokenService.getTokenId();

    if (!refreshToken || !tokenId) return;
    setIsPageLoading(true);
    try {
      const res = await authService.getTokenNew({
        departmentCode: value,
        refreshToken,
        tenantCode: TENANT_CODE,
        tokenId,
      });

      if (res.accessToken) {
        const userInfoToken = jwtDecode<UserInfoToken>(res.accessToken);

        const roleCode = userInfoToken?.['cth-role-code'] as string;
        tokenService.setTokens(
          res.accessToken,
          res.refreshToken || refreshToken,
          res.tokenId || tokenId,
          JSON.stringify(userInfoToken)
        );

        const allRoles = await authService.getAllRoles();
        let roles: string[] | null = null;

        if (roleCode && ROLE_TO_GROUP[roleCode]) {
          roles = [ROLE_TO_GROUP[roleCode]];

          if (allRoles?.data?.length > 0) {
            if (allRoles?.data?.includes('ODOWTC')) {
              roles.push('ODOWTC');
            }

            const roleFi = intersection(allRoles?.data, ['HFIN', 'FINS', 'FINGEN', 'FINBR']);
            if (roleFi.length > 0) {
              roles = roles.concat(roleFi);
            }

            const roleHPO_CS = intersection(allRoles?.data, ['HPO', 'CS']);
            if (roleHPO_CS.length > 0) {
              roles = roles.concat(roleHPO_CS);
            }
          }
        } else {
          if (allRoles?.data?.length > 0) {
            roles = allRoles?.data?.filter((i) => i !== 'CSKH');
          }
        }

        setCurrentUser({
          ...currentUser,
          role: roles,
        });
        // queryClient.clear();
        queryClient.invalidateQueries({ queryKey: ['list-complaint'] });
        queryClient.invalidateQueries({ queryKey: ['violation-report-list'] });
      }
    } catch (error) {
      console.error('Failed to change post:', error);
    } finally {
      setIsPageLoading(false);
    }
  };

  // ── Language ─────────────────────────────────────────────────────────────
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    queryClient.invalidateQueries();
    // queryClient.clear();
  };

  return (
    <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-none transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-background'>
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        {isMobile && (
          <SidebarTrigger className='text-primary transition-all duration-200 ease-linear group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:text-foreground group-data-[collapsible=icon]:hover:text-primary ' />
        )}
        <div className='ml-auto flex items-center gap-2'>
          <Select value={i18n.language} onValueChange={changeLanguage}>
            <SelectTrigger size='sm' className='w-fit'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='vi'>
                <div className='flex items-center gap-2'>
                  <VnIcon />
                  <span>{t('language.vi')}</span>
                </div>
              </SelectItem>
              <SelectItem value='en'>
                <div className='flex items-center gap-2'>
                  <EnIcon />
                  <span>{t('language.en')}</span>
                </div>
              </SelectItem>
              {/* sau có cấu hình ENV cho thị trường nào thì viết thêm điều kiện vào đây */}
              {/* <SelectItem value='lo'>
                <div className='flex items-center gap-2'>
                  <LoIcon />
                  <span>{t('language.lo')}</span>
                </div>
              </SelectItem> */}
              <SelectItem value='km'>
                <div className='flex items-center gap-2'>
                  <KmIcon />
                  <span>{t('language.km')}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Combobox chọn bưu cục với infinite scroll + search */}
          <div className='w-56'>
            <Combobox
              options={options}
              value={postUser}
              onChange={handleChangePost}
              placeholder={t('common.selectPost')}
              isLoading={isFetching || isFetchingDefault}
              onFilter={(query) => setSearch(query)}
              onLoadMore={handleLoadMore}
              clearValue={false}
            />
          </div>

          <NavUser />
        </div>
      </div>
    </header>
  );
}
