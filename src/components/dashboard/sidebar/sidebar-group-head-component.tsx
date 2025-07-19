import { SidebarGroup as SidebaGroupUi, SidebarGroupLabel } from '@/components/ui/sidebar';
import type { DashboardRouteConfig } from '@/routes/dashboard/route-config';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarGroupHeadProps {
    path: string;
    subRoutes: DashboardRouteConfig[] | undefined;
    open: boolean;
    icon: React.ReactNode;
    onToggle?: () => void; // Add this line
}

const SidebarGroupHeadComponent = ({
    path,
    subRoutes,
    open,
    icon,
    onToggle, // Add this line
}: SidebarGroupHeadProps) => {
    const hasSubRoutes = (subRoutes?.length ?? 0) > 0;

    return (
        <SidebaGroupUi>
            <div
                className='flex items-center justify-between w-full capitalize'
                onClick={hasSubRoutes ? onToggle : undefined} // Add onClick handler
            >
                {hasSubRoutes ? (
                    <div className='flex items-center w-full'>
                        <span className='w-4 group-data-[collapsible=icon]:ml-[0.3rem]'>
                            {icon}
                        </span>
                        <SidebarGroupLabel className='text-base'>{path}</SidebarGroupLabel>
                    </div>
                ) : (
                    <NavLink
                        to={path}
                        className={({ isActive }) => `
                    flex items-center w-full rounded-md
                    ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                    `}
                    >
                        <span className='w-4 group-data-[collapsible=icon]:ml-[0.3rem]'>
                            {icon}
                        </span>
                        <SidebarGroupLabel className='text-base'>{path}</SidebarGroupLabel>
                    </NavLink>
                )}
                {hasSubRoutes && (
                    open ? (
                        <ChevronDown className='cursor-pointer size-4' />
                    ) : (
                        <ChevronRight className='cursor-pointer size-4' />
                    )
                )}
            </div>
        </SidebaGroupUi>
    );
};

export default SidebarGroupHeadComponent;