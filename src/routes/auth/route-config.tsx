export interface AuthRouteConfig {
    path: string;
    component: React.ComponentType;
    label: string;
}

const createAuthRoute = (
    path: string,
    component: React.ComponentType,
    label: string,
): AuthRouteConfig => {
    return {
        path,
        component,
        label
    };
};

export default createAuthRoute;