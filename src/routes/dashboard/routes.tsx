import { CircleGauge, Monitor, Settings, UserCog } from "lucide-react";
import type { DashboardRouteConfig } from "./route-config";
import createDashboardRoute from "./route-config";

const DashboardHomeComponent = () => <div>Dashboard Home</div>;
const DashboardSettingsComponent = () => <div>Dashboard Settings</div>; 
const DashboardGeneralSettingsComponent = () => <div>General Settings</div>;
const DashboardAccountSettingsComponent = () => <div>Account Settings</div>;

const RoutesList = () => {
    const dashboardRoutesList: DashboardRouteConfig[] = [
        {
            path: "home",
            icon: <CircleGauge className="size-5" />,
            component: DashboardHomeComponent,
            isAuthenticated: true,
            isShown: true,
        },
        {
            path: "settings",
            icon: <Settings className="size-5" />,
            component: DashboardSettingsComponent,
            isAuthenticated: true,
            isShown: true,
            subRoutes: [
                {
                    path: "general",
                    icon: <Monitor className="size-5" />,
                    component: DashboardGeneralSettingsComponent,
                    isAuthenticated: true,
                    isShown: true,

                },
                {
                    path: "account",
                    icon: <UserCog className="size-5" />,
                    component: DashboardAccountSettingsComponent,
                    isAuthenticated: true,
                    isShown: true,
                }
            ],
        },
    ].map((route) =>
        createDashboardRoute(route.path, route.component, route.icon, route.isShown, route.isAuthenticated, route.subRoutes)
    );

    return dashboardRoutesList;
};

export default RoutesList;