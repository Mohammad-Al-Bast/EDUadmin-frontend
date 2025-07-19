import type { JSX } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    // TODO: Implement actual authentication logic
    // For now, we'll simulate an authenticated user with a token
    const token = true;
    return token ? children : <Navigate to="/auth/login" />;
};

export default ProtectedRoute;