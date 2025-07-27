export interface DashboardRouteConfig {
    path: string;
    component: React.ComponentType;
    icon?: React.ReactNode;
    isShown: boolean;
    isAuthenticated?: boolean;
    permissions?: string[];
}

const createDashboardRoute = (
    path: string,
    component: React.ComponentType,
    icon: React.ReactNode,
    isShown: boolean,
    isAuthenticated?: boolean,
): DashboardRouteConfig => {
    return {
        path,
        component,
        icon,
        isShown,    
        isAuthenticated,
    };
};

export default createDashboardRoute;