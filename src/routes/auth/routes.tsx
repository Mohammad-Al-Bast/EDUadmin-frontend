import { ResetPasswordPage, LogInPage } from "@/components/pages/auth";
import createAuthRoute from "./route-config";

const authRoutesList = [
    {
        path: "login",
        component: LogInPage,
        label: "Log In",
        subtitle: "Enter your email & password to log in",
    },
    {
        path: "reset-password",
        component: ResetPasswordPage,
        label: "Reset Password",
        subtitle: "Reset your password using your email",
    }
].map((route) =>
    createAuthRoute(route.path, route.component, route.label, route.subtitle)
);

export default authRoutesList;