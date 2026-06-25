import navigationService from '@/lib/navigation';

export const redirectWithMessage = (
  path: string,
  message: string,
  type: 'error' | 'success' = 'error'
): void => {
  navigationService.navigate(path, { state: { message, type } });
};
