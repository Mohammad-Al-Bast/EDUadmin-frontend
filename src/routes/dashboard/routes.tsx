import { CircleGauge, GraduationCap, LayoutList, Users } from "lucide-react";
import type { DashboardRouteConfig } from "./route-config";
import createDashboardRoute from "./route-config";
import Profile from "@/components/pages/profile/profile";
import TeamsPage from "@/components/pages/team/team";
import StudentsPage from "@/components/pages/students/students";

const DashboardHome = () => <div>Dashboard Home</div>;
const UploadCourses = () => <div>Upload Courses</div>;
const ChangeOfGradeForm = () => <div>Change of Grade Form</div>;

const RoutesList = () => {
    const dashboardRoutesList: DashboardRouteConfig[] = [
        {
            path: "dashboard",
            icon: <CircleGauge className="size-5" />,
            component: DashboardHome,
            isAuthenticated: true,
            isShown: true,
        },
        {
            path: "upload-courses",
            icon: <LayoutList className="size-5" />,
            component: UploadCourses,
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
            path: "teams",
            icon: <Users className="size-5" />,
            component: TeamsPage,
            isAuthenticated: true,
            isShown: true,
        },
        {
            path: "change-of-grade-form",
            component: ChangeOfGradeForm,
            isAuthenticated: true,
            isShown: true,
        },
        {
            path: "profile",
            component: Profile,
            isAuthenticated: true,
            isShown: false,
        }
    ].map((route) =>
        createDashboardRoute(route.path, route.component, route.icon, route.isShown, route.isAuthenticated)
    );

    return dashboardRoutesList;
};

export default RoutesList;