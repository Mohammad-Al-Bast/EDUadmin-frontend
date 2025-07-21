import { SidebarGroup, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import type { DashboardRouteConfig } from '@/routes/dashboard/route-config';
import * as Collapsible from '@radix-ui/react-collapsible';
import { NavLink } from 'react-router-dom';

interface SidebarGroupContentProps {
    subRoutes: DashboardRouteConfig[] | undefined;
    path: string;
}

const SidebarGroupContent = ({
    subRoutes,
    path,
}: SidebarGroupContentProps) => {
    return (
        <>
            {subRoutes && (
                <Collapsible.Content>
                    <SidebarGroup>
                        <SidebarMenu className='gap-2'>
                            {subRoutes?.map((subRoute: DashboardRouteConfig) => (
                                <SidebarMenuItem key={subRoute.path} className='w-full'>
                                    <NavLink
                                        to={`${path}/${subRoute.path}`}
                                        className={({ isActive }) => `
                            flex items-center p-2 gap-2 text-center ml-[0.45rem] rounded-md
                            ${isActive
                                                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                                : 'text-gray-500'
                                            }
                    `}
                                    >
                                        <div className=''>{subRoute.icon}</div>
                                        <span className='group-data-[collapsible=icon]:hidden capitalize text-sm'>
                                            {subRoute.path}
                                        </span>
                                    </NavLink>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </Collapsible.Content>
            )}
        </>
    );
};

export default SidebarGroupContent;