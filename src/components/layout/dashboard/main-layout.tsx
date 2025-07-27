import { ModeToggle } from '@/components/theme/mode-toggle';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { DashboardSideBar } from '@/components/dashboard/sidebar';

interface MainLayoutProps {
    routes: {
        path: string;
        component: React.ComponentType;
        icon?: React.ReactNode;
        isShown: boolean;
        isAuthenticated?: boolean;
    }[];
}

const MainLayout: React.FC<MainLayoutProps> = () => {
    const location = useLocation();

    const formatPathSegment = (segment: string) => {
        return segment
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const generateBreadcrumbs = () => {
        const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
        const breadcrumbs = [];

        breadcrumbs.push({
            label: 'Dashboard',
            path: '/dashboard',
            isLast: pathSegments.length === 1 && pathSegments[0] === 'dashboard'
        });

        let currentPath = '';
        pathSegments.forEach((segment, index) => {
            if (segment !== 'dashboard') {
                currentPath += `/${segment}`;
                const fullPath = pathSegments[0] === 'dashboard' ? `/dashboard${currentPath}` : currentPath;

                breadcrumbs.push({
                    label: formatPathSegment(segment),
                    path: fullPath,
                    isLast: index === pathSegments.length - 1
                });
            }
        });

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    return (
        <SidebarProvider>
            <div className='flex w-full min-h-screen'>
                {/* Sidebar */}
                <DashboardSideBar />
                {/* Main Content */}
                <div className='flex-1 flex flex-col overflow-hidden'>
                    <nav className='w-full flex justify-between items-center h-12 border-b px-2'>
                        <div className="flex items-center">
                            <div className="">
                                <SidebarTrigger className='block md:hidden' />
                            </div>
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {breadcrumbs.map((breadcrumb, idx) => (
                                        <div key={breadcrumb.path} className="flex items-center">
                                            <BreadcrumbItem>
                                                {breadcrumb.isLast || idx === breadcrumbs.length - 1 ? (
                                                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink asChild>
                                                        <Link to={breadcrumb.path}>{breadcrumb.label}</Link>
                                                    </BreadcrumbLink>
                                                )}
                                            </BreadcrumbItem>
                                            {(!breadcrumb.isLast && idx < breadcrumbs.length - 1) && <BreadcrumbSeparator className='ml-1 -mr-2' />}
                                        </div>
                                    ))}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="">
                            <ModeToggle />
                        </div>
                    </nav>
                    <div className="flex-1 overflow-hidden p-3">
                        <Outlet />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default MainLayout;