import { ResetPasswordPage, SignInPage } from "@/components/pages/auth";
import createAuthRoute from "./route-config";

const authRoutesList = [
    {
        path: "signin",
        component: SignInPage,
        label: "Sign In",
        subtitle: "Enter your email & password to sign in",
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