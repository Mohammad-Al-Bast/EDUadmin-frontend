export interface DashboardRouteConfig {
    path: string;
    component: React.ComponentType;
    icon?: React.ReactNode;
    isShown: boolean;
    isAuthenticated?: boolean;
    permissions?: string[];
    subRoutes?: DashboardRouteConfig[];
}

const createDashboardRoute = (
    path: string,
    component: React.ComponentType,
    icon: React.ReactNode,
    isShown: boolean,
    isAuthenticated?: boolean,
    subRoutes: DashboardRouteConfig[] = []
): DashboardRouteConfig => {
    return {
        path,
        component,
        icon,
        isShown,
        isAuthenticated,
        subRoutes,
    };
};

export default createDashboardRoute;