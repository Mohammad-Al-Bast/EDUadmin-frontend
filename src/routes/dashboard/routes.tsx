import { BookOpen, CircleGauge, FileCheck, FileUp, GraduationCap, Users } from "lucide-react";
import type { DashboardRouteConfig } from "./route-config";
import createDashboardRoute from "./route-config";
import Profile from "@/components/pages/profile/profile";
import TeamsPage from "@/components/pages/Dashboard/team/team";
import StudentsPage from "@/components/pages/Dashboard/students/students";
import UploadPage from "@/components/pages/Dashboard/upload/upload";
import ChangeGradePage from "@/components/pages/Dashboard/ChangeGrade/change-grade";
import CoursesPage from "@/components/pages/Dashboard/courses/courses";
import HomePage from "@/components/pages/Dashboard/home/home";

const RoutesList = () => {
    const dashboardRoutesList: DashboardRouteConfig[] = [
        {
            path: "dashboard",
            icon: <CircleGauge className="size-5" />,
            component: HomePage,
            isAuthenticated: true,
            isShown: true,
        },
        {
            path: "upload",
            icon: <FileUp className="size-5" />,
            component: UploadPage,
            isAuthenticated: true,
            isShown: true,
        },
        {
            path: "courses",
            icon: <BookOpen className="size-5" />,
            component: CoursesPage,
            isAuthenticated: true,
            isShown: true,
        },
        {
            path: "students",
            icon: <GraduationCap className="size-5" />,
            component: StudentsPage,
            isAuthenticated: true,
            isShown: true,
        },
        {
            path: "change-grade",
            icon: <FileCheck className="size-5" />,
            component: ChangeGradePage,
            isAuthenticated: true,
            isShown: true,
        },
        {
            path: "profile",
            component: Profile,
            isAuthenticated: true,
            isShown: false,
        },
        {
            path: "teams",
            icon: <Users className="size-5" />,
            component: TeamsPage,
            isAuthenticated: true,
            isShown: true,
        }
    ].map((route) =>
        createDashboardRoute(route.path, route.component, route.icon, route.isShown, route.isAuthenticated)
    );

    return dashboardRoutesList;
};

export default RoutesList;