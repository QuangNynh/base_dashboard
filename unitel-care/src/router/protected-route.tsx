import { useAuthStore } from '@/store/useAuthStore';
import { type ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getMenu, type MenuItem } from './menu';
import { ROUTES } from './routes.config';

interface ProtectedRouteProps {
  children: ReactNode;
  roles: string[]; // dùng ROLE_GROUP
}

const getFirstAccessibleMenuUrl = (items: MenuItem[]): string | null => {
  for (const item of items) {
    if (item.url) return item.url;

    if (item.items) {
      const childUrl = getFirstAccessibleMenuUrl(item.items);
      if (childUrl) return childUrl;
    }
  }

  return null;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { currentUser, isAuthLoading } = useAuthStore();
  const { t } = useTranslation();

  const userGroups = currentUser?.role || [];
  const hasPermission = roles.length === 0 || roles.some((role) => userGroups.includes(role));
  const isDenied = !isAuthLoading && !!currentUser && !hasPermission;
  const isOperationUser = currentUser?.role?.includes('ODOWTC');
  const firstAccessibleMenuUrl = getFirstAccessibleMenuUrl(getMenu(userGroups));

  useEffect(() => {
    if (isDenied) {
      toast.error(t('errors.accessDenied'), { id: 'protected-route-access-denied' });
    }
  }, [isDenied, t]);

  // Đang fetch user info — chờ, không redirect sớm khi F5
  if (isAuthLoading) return null;

  if (isDenied && firstAccessibleMenuUrl) {
    return <Navigate to={firstAccessibleMenuUrl} replace />;
  }

  if (isDenied && isOperationUser) {
    return <Navigate to={ROUTES.VIOLATION_REPORT_LIST} replace />;
  }

  if (isDenied) return null;

  return <>{children}</>;
};
export default ProtectedRoute;
