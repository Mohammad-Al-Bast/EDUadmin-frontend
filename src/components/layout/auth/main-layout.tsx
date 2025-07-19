import { Outlet, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface MainLayoutProps {
    routes: {
        path: string;
        component: React.ComponentType;
        label: string;
    }[];
}
const MainLayout: React.FC<MainLayoutProps> = ({ routes }) => {

    const location = useLocation();
    const currentRoute = routes.find((route) => location.pathname.endsWith(route.path));

    return (
        <div className="min-h-screen flex flex-col items-center justify-center" >
            {/* Main Content */}
            <main className="w-full max-w-[450px] mx-auto my-auto" >
                <Card className='p-3' >
                    <div className="text-2xl text-center mb-4">
                        {
                            currentRoute ?
                                <span className="flex items-center justify-center gap-1">
                                    {currentRoute.label}
                                </span>
                                : "Auth Page"
                        }
                    </div>
                    <CardContent>
                        <Outlet />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default MainLayout;