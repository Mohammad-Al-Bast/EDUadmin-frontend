import type { RootState } from "@/store";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const token = useSelector((state: RootState) => state.auth.token);
    return token ? children : <Navigate to="/auth/login" />;
};

export default ProtectedRoute;