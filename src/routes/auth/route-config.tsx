export interface AuthRouteConfig {
    path: string;
    component: React.ComponentType;
    label: string;
    subtitle?: string;
}

const createAuthRoute = (
    path: string,
    component: React.ComponentType,
    label: string,
    subtitle?: string
): AuthRouteConfig => {
    return {
        path,
        component,
        label,
        subtitle
    };
};

export default createAuthRoute;