import { AppSidebar } from '@/components/layout/app-sidebar';
import { PageHeaderBreadcrumb } from '@/components/layout/bread-crumb';
import { SiteHeader } from '@/components/layout/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { tokenService } from '@/lib/token';
import { useAuthStore } from '@/store/useAuthStore';
import { usePageLoadingStore } from '@/store/usePageLoadingStore';
import { ROLE_TO_GROUP } from '@/constants/permissions';
import { useEffect } from 'react';
import { authService } from '@/services/authService';
import Loading from '@/components/common/Loading';
import intersection from 'lodash/intersection';

type Props = {
  children: React.ReactNode;
};

const DefaultLayout = ({ children }: Props) => {
  const { setCurrentUser, isAuthLoading, logout } = useAuthStore();
  const { isPageLoading, setIsPageLoading } = usePageLoadingStore();

  const userInfoTokenString = tokenService.getUserInfoToken();
  const userInfoToken = userInfoTokenString ? JSON.parse(userInfoTokenString) : null;

  const getUserInfo = async (username: string) => {
    setIsPageLoading(true);
    try {
      const res = await authService.getUserInfo({ username });
      const allRoles = await authService.getAllRoles();

      const roleCode = userInfoToken?.['cth-role-code'] as string;

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

      if (res) {
        setCurrentUser({
          ...res,
          role: roles,
        });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      tokenService.clear();
      setCurrentUser(null);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    const tokenStr = tokenService.getUserInfoToken();
    const token = tokenStr ? JSON.parse(tokenStr) : null;
    const username = token?.['cth-username'];

    if (!username) {
      logout();
      return;
    }

    getUserInfo(username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 👈 chỉ chạy 1 lần

  return (
    <SidebarProvider
      className='h-screen overflow-hidden'
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant='inset' className='bg-background' />

      <div className='flex flex-col w-full h-full bg-bgContent pb-3 gap-2'>
        <SiteHeader />

        <div className='flex-1 min-h-0 overflow-auto scrollbar-custom'>
          <Loading isLoading={isAuthLoading || isPageLoading}>
            <SidebarInset className='flex flex-col bg-bgContent px-4 gap-4'>
              <PageHeaderBreadcrumb />
              <div className='@container/main flex flex-col gap-4'>{children}</div>
            </SidebarInset>
          </Loading>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DefaultLayout;
