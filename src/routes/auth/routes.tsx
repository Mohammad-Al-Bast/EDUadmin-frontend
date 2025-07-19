import LoginPage from "@/components/pages/login";
import createAuthRoute from "./route-config";

const authRoutesList = [
    {
        path: "login",
        component: LoginPage,
        label: "Login"
    }
].map((route) =>
    createAuthRoute(route.path, route.component, route.label)
);

export default authRoutesList;