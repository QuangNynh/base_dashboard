import { create } from 'zustand';

interface PageLoadingStore {
  isPageLoading: boolean;
  setIsPageLoading: (loading: boolean) => void;
}

export const usePageLoadingStore = create<PageLoadingStore>((set) => ({
  isPageLoading: false,
  setIsPageLoading: (loading) => set({ isPageLoading: loading }),
}));
