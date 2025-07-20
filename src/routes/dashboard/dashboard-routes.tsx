/* eslint-disable @typescript-eslint/no-explicit-any */
import { Route, Routes, Navigate } from "react-router-dom";
import RoutesList from "./routes";
import NotFound from "@/components/pages/not-found";
import MainLayout from "@/components/layout/dashboard/main-layout";

const DashboardRoutes: React.FC = () => {
    const dashboardRoutesList = RoutesList();

    const renderRoutes = (routes: any, parentIsAuthenticated = true) => {
        return routes.map((route: any, index: number) => {
            const isAuthenticated = route.isAuthenticated ?? parentIsAuthenticated;

            return (
                <Route
                    key={index}
                    path={route.path}
                    element={
                        isAuthenticated ? (
                            <route.component />
                        ) : (
                            <Navigate to="/auth/login" />
                        )
                    }
                >
                    {route.subRoutes &&
                        renderRoutes(route.subRoutes, isAuthenticated)}
                </Route>
            );
        });
    };

    return (
        <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="/" element={<MainLayout routes={dashboardRoutesList} />}>
                {renderRoutes(dashboardRoutesList)}
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default DashboardRoutes;