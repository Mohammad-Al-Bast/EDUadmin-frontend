import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protected-route";
import DashboardRoutes from "./dashboard/dashboard-routes";
import AuthRoutes from "./auth/auth-routes";

const Home = () => <div>Home Page</div>; // Placeholder for Home component

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
        </Routes>
    );
};

export default AppRoutes;