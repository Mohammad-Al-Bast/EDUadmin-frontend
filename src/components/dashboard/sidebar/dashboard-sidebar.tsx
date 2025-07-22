import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { Separator } from "@/components/ui/separator"
import RoutesList from '@/routes/dashboard/routes';
import SidebarGroupComponent from './sidebar-group';
import { SidebarUser } from './sidebar-user';
import { USER } from '@/constants/mock-data';

const DashboardSideBarComponent = () => {
    const routes = RoutesList();

    return (
        <Sidebar collapsible='icon'>

            {/* Sidebar Header */}
            <SidebarHeader className='flex items-start justify-center h-12 border-b'>
                <span className='flex items-center gap-2 group-data-[collapsible=icon]:gap-0'>
                    <img
                        src="/images/liu.png"
                        alt="Logo"
                        className='h-8 w-8 rounded-full group-data-[collapsible=icon]=hidden'
                    />
                    <span className="group-data-[collapsible=icon]:hidden text-xl font-semibold">
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
                <SidebarUser user={USER} />
            </SidebarFooter>
        </Sidebar>
    );
};

export default DashboardSideBarComponent;