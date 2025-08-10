import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { Separator } from "@/components/ui/separator"
import RoutesList from '@/routes/dashboard/routes';
import SidebarGroupComponent from './sidebar-group';
import { SidebarUser } from './sidebar-user';
import { useAppSelector } from '@/hooks/redux';
import { selectUser } from '@/store/selectors/authSelectors';

const DashboardSideBarComponent = () => {
    const routes = RoutesList();
    const user = useAppSelector(selectUser);

    return (
        <Sidebar collapsible='icon'>

            {/* Sidebar Header */}
            <SidebarHeader className='flex items-start justify-center h-12 border-b'>
                <span className='flex items-center gap-2'>
                    <img
                        src="/images/liu.png"
                        alt="Logo"
                        className='h-8 w-8 rounded-full'
                    />
                    <span className="text-xl font-semibold">
                        LIU
                    </span>
                </span>
            </SidebarHeader>

            {/* Sidebar Content */}
            <SidebarContent className='overflow-y-auto flex-1 [&>*]:mb-[-1.2rem]'>
                <h2 className='px-2 pb-2 pt-3'>{"Platform"}</h2>
                {routes.filter(route => route.isShown).map((route) => (
                    <SidebarGroupComponent key={route.path} route={route} />
                ))}
            </SidebarContent>

            <Separator orientation='horizontal' className='w-full' />

            {/* Sidebar Footer */}
            <SidebarFooter>
                <SidebarUser user={{
                    name: user?.name ?? "Unknown User",
                    email: user?.email ?? "unknown@example.com",
                }} />
            </SidebarFooter>
        </Sidebar>
    );
};

export default DashboardSideBarComponent;