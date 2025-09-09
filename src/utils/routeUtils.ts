import type { DashboardRouteConfig } from '@/routes/dashboard/route-config';
import type { LoginUser } from '@/types/login/login.types';

/**
 * Check if a user has access to a specific route
 */
export const hasRouteAccess = (route: DashboardRouteConfig, user: LoginUser | null): boolean => {
    // If route is not shown, no access
    if (!route.isShown) return false;

    // If route requires authentication and user is not logged in
    if (route.isAuthenticated && !user) return false;

    // If route is admin-only and user is not admin
    if (route.isAdminOnly && (!user || !user.is_admin)) return false;

    return true;
};

/**
 * Filter routes based on user permissions
 */
export const filterRoutesByAccess = (routes: DashboardRouteConfig[], user: LoginUser | null): DashboardRouteConfig[] => {
    return routes.filter(route => hasRouteAccess(route, user));
};

/**
 * Check if current user is admin
 */
export const isUserAdmin = (user: LoginUser | null): boolean => {
    return user?.is_admin ?? false;
};
