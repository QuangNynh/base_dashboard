import i18n from '@/i18n';
import navigationService from '@/lib/navigation';
import { tokenService } from '@/lib/token';
import type { getUserInfoResponse } from '@/types/auth';
import { toast } from 'sonner';
import { create } from 'zustand';

interface UserInfo extends getUserInfoResponse {
  role: string[] | null;
}

interface AuthStore {
  currentUser: UserInfo | null;
  isAuthLoading: boolean;
  setCurrentUser: (user: UserInfo | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  currentUser: null,
  isAuthLoading: true,
  setCurrentUser: (user) => set({ currentUser: user, isAuthLoading: false }),

  logout: () => {
    tokenService.clear();
    set({ currentUser: null });
    // Toast gọi trực tiếp — <Toaster> nằm ngoài <App> nên persist sau navigate
    // Dùng i18n.t() thay vì hook vì đây không phải React component
    toast.success(i18n.t('messages.logoutSuccess'));
    navigationService.navigate('/login');
  },
}));
