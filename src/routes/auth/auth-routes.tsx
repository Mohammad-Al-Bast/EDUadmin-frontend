import React from "react";
import authRoutesList from "./routes";
import { Route, Routes } from "react-router-dom";
import NotFound from "@/components/pages/not-found";
import MainLayout from "@/components/layout/auth/main-layout";

const AuthRoutes: React.FC = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={<MainLayout
                    routes={authRoutesList}
                />}
            >
                {authRoutesList.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        element={<route.component />}
                    />
                ))}
            </Route>
            <Route
                path="*"
                element={<NotFound />}
            />
        </Routes>
    );
};

export default AuthRoutes;