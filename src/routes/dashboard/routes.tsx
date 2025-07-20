import { CircleGauge, LayoutList, Users } from "lucide-react";
import type { DashboardRouteConfig } from "./route-config";
import createDashboardRoute from "./route-config";

const DashboardHomeComponent = () => <div>Dashboard Home</div>;

const RoutesList = () => {
    const dashboardRoutesList: DashboardRouteConfig[] = [
        {
            path: "dashboard",
            icon: <CircleGauge className="size-5" />,
            component: DashboardHomeComponent,
            isAuthenticated: true,
            isShown: true,
        },
        {
            path: "upload-courses",
            icon: <LayoutList className="size-5" />,
            component: () => <div>Upload Courses</div>,
            isAuthenticated: true,
            isShown: true,
        },
        {
            path: "teams",
            icon: <Users className="size-5" />,
            component: () => <div>Teams</div>,
            isAuthenticated: true,
            isShown: true,
        }
    ].map((route) =>
        createDashboardRoute(route.path, route.component, route.icon, route.isShown, route.isAuthenticated)
    );

    return dashboardRoutesList;
};

export default RoutesList;