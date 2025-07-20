import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { LogOutIcon, ShoppingCart } from 'lucide-react';
import { Tooltip, TooltipTrigger } from '@radix-ui/react-tooltip';
import { Separator } from "@/components/ui/separator"
import RoutesList from '@/routes/dashboard/routes';
import SidebarGroupComponent from './sidebar-group-component';
import { Button } from '@/components/ui/button';

const DashboardSideBarComponent = () => {
    const routes = RoutesList();

    const handleLogout = () => {
        console.log('Logging out...');
    };

    return (
        <Sidebar collapsible='icon'>

            {/* Sidebar Header */}
            <SidebarHeader className='flex items-center justify-center h-14 border-b'>
                <span className='flex items-center gap-2 group-data-[collapsible=icon]:gap-0'>
                    <ShoppingCart className='size-5' />
                    <span className="group-data-[collapsible=icon]:hidden text-xl font-bold">
                        MP
                    </span>
                </span>
            </SidebarHeader>

            {/* Sidebar Content */}
            <SidebarContent className='overflow-y-auto flex-1'>
                {routes.filter(route => route.isShown).map((route) => (
                    <SidebarGroupComponent key={route.path} route={route} />
                ))}
            </SidebarContent>

            <Separator orientation='horizontal' className='w-full' />

            {/* Sidebar Footer */}
            <SidebarFooter>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            className='w-full h-12 group'
                            onClick={handleLogout}
                        >
                            <span className='flex items-center justify-center gap-2 group-data-[collapsible=icon]:gap-0'>
                                <LogOutIcon className="h-4 w-4" />
                                <span className="group-data-[collapsible=icon]:hidden">
                                    Logout
                                </span>
                            </span>
                        </Button>
                    </TooltipTrigger>
                </Tooltip>
            </SidebarFooter>
        </Sidebar>
    );
};

export default DashboardSideBarComponent;