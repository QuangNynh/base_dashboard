import { usePageLoadingStore } from '@/store/usePageLoadingStore';
import { useEffect } from 'react';

export const usePageLoading = (isLoading: boolean) => {
  const { setIsPageLoading } = usePageLoadingStore();

  useEffect(() => {
    setIsPageLoading(isLoading);
    // cleanup khi unmount để không bị treo loading
    return () => setIsPageLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
};
