export interface DashboardRouteConfig {
    path: string;
    component: React.ComponentType;
    icon?: React.ReactNode;
    isShown: boolean;
    isAuthenticated?: boolean;
    isAdminOnly?: boolean;
    permissions?: string[];
}

const createDashboardRoute = (
    path: string,
    component: React.ComponentType,
    icon: React.ReactNode,
    isShown: boolean,
    isAuthenticated?: boolean,
    isAdminOnly?: boolean,
): DashboardRouteConfig => {
    return {
        path,
        component,
        icon,
        isShown,
        isAuthenticated,
        isAdminOnly,
    };
};

export default createDashboardRoute;