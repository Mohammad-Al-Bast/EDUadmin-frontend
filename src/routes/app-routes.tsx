import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protected-route";
import DashboardRoutes from "./dashboard/dashboard-routes";
import AuthRoutes from "./auth/auth-routes";
import NotFound from "@/components/pages/not-found";
import Home from "@/components/pages/home/home";

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/*" element={<AuthRoutes />} />
            <Route
                path="/dashboard/*"
                element={
                    <ProtectedRoute>
                        <DashboardRoutes />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;