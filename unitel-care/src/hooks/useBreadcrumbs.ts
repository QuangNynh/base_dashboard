import { routers, type AppRoute } from '@/router';
import { matchPath, useLocation } from 'react-router-dom';

function flattenRoutes(routes: AppRoute[]): AppRoute[] {
  return routes.flatMap((route) => [
    route,
    ...(route.children ? flattenRoutes(route.children) : []),
  ]);
}

export function useBreadcrumbs(): string[] {
  const location = useLocation();
  const allRoutes = flattenRoutes(routers);

  const matched = allRoutes.find(
    (route) => route.path && matchPath({ path: route.path, end: true }, location.pathname)
  );

  return matched?.breadcrumb ?? [];
}
