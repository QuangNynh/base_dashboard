import { ROLE_GROUP } from '@/constants/permissions';
import { useAuthStore } from '@/store/useAuthStore';

type RoleGroup = (typeof ROLE_GROUP)[keyof typeof ROLE_GROUP];

export const useCheckPermissions = (requiredRoles: RoleGroup[]): boolean => {
  const { currentUser } = useAuthStore();

  if (!currentUser || !currentUser.role) {
    return false;
  }

  return requiredRoles.some((requiredRole) => currentUser.role?.includes(requiredRole));
};
