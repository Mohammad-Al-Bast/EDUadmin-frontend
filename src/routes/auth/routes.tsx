import SignInPage from "@/components/pages/auth/signin";
import createAuthRoute from "./route-config";

const authRoutesList = [
    {
        path: "signin",
        component: SignInPage,
        label: "Sign In",
        subtitle: "Enter your email & password to sign in",
    }
].map((route) =>
    createAuthRoute(route.path, route.component, route.label, route.subtitle)
);

export default authRoutesList;