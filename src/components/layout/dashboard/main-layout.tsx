import DashboardSideBarComponent from '@/components/dashboard/sidebar/dashboard-sidebar-component';
import { ModeToggle } from '@/components/theme/mode-toggle';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';

interface MainLayoutProps {
    routes: {
        path: string;
        component: React.ComponentType;
        icon?: React.ReactNode;
        isShown: boolean;
        isAuthenticated?: boolean;
        subRoutes?: {
            path: string;
            component: React.ComponentType;
            icon?: React.ReactNode;
            isShown: boolean;
            isAuthenticated?: boolean;
        }[];
    }[];
}

const MainLayout: React.FC<MainLayoutProps> = () => {
    return (
        <SidebarProvider>
            <div className='flex w-full min-h-screen'>
                {/* Sidebar */}
                <DashboardSideBarComponent />
                {/* Main Content */}
                <div className='flex-1 flex flex-col overflow-hidden'>
                    <nav className='w-full flex justify-between items-center h-14 border-b px-2'>
                        <div className="flex items-center gap-2">
                            <SidebarTrigger variant="outline" />
                        </div>
                        <div className="">
                            <ModeToggle />
                        </div>
                    </nav>
                    <div className="flex-1 overflow-hidden p-2">
                        <Outlet />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default MainLayout;