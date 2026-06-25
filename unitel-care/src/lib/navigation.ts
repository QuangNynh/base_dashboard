import type { NavigateFunction } from 'react-router-dom';

const navigationService = {
  _navigate: null as NavigateFunction | null,

  setNavigate(fn: NavigateFunction): void {
    this._navigate = fn;
  },

  navigate(path: string, options?: { state?: unknown; replace?: boolean }): void {
    if (!this._navigate) {
      console.warn(
        '[navigationService] navigate() called before setNavigate(). Falling back to window.location.'
      );
      window.location.href = path;
      return;
    }
    this._navigate(path, options);
  },
};

export default navigationService;
