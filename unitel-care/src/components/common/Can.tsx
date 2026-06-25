import { useAuthStore } from '@/store/useAuthStore';
import type { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  roles: string[];
  otherwise?: ReactNode;
};
const Can: FC<Props> = ({ children, roles, otherwise }) => {
  const { currentUser } = useAuthStore();

  const userGroups = currentUser?.role || [];

  if (!!roles && roles.some((i) => userGroups?.includes(i))) {
    return <>{children}</>;
  }

  return otherwise ? <>{otherwise}</> : undefined;
};

export default Can;
