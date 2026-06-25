import { useLocation } from 'react-router-dom';

type UseActiveMenuOptions = {
  ignoreSegments?: string[];
};

export const useActiveMenu = (options?: UseActiveMenuOptions) => {
  const location = useLocation();
  const path = location.pathname;

  const IGNORE = options?.ignoreSegments || ['create', 'update'];

  // normalize path
  const normalizePath = (input: string) => {
    const parts = input.split('/').filter(Boolean);

    if (IGNORE.includes(parts[parts.length - 1])) {
      parts.pop();
    }

    return '/' + parts.join('/');
  };

  // check active
  const isActive = (url?: string) => {
    if (!url) return false;

    const p = normalizePath(path);
    const u = url.replace(/\/+$/, '');

    return p === u || p.startsWith(u + '/');
  };

  // check mở menu cha
  const isOpen = (urls: (string | undefined)[]) => {
    return urls.some((url) => isActive(url));
  };

  return {
    path,
    isActive,
    isOpen,
  };
};
