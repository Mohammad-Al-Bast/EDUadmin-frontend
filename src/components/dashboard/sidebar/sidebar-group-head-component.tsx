import { SidebarGroup as SidebarGroupUi, SidebarGroupLabel } from '@/components/ui/sidebar';
import type { DashboardRouteConfig } from '@/routes/dashboard/route-config';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarGroupHeadProps {
    path: string;
    subRoutes: DashboardRouteConfig[] | undefined;
    open: boolean;
    icon: React.ReactNode;
    onToggle?: () => void;
}

const SidebarGroupHeadComponent = ({
    path,
    subRoutes,
    open,
    icon,
    onToggle,
}: SidebarGroupHeadProps) => {
    const hasSubRoutes = (subRoutes?.length ?? 0) > 0;

    return (
        <SidebarGroupUi>
            <div
                className='flex items-center justify-between w-full capitalize'
                onClick={hasSubRoutes ? onToggle : undefined}
            >
                {hasSubRoutes ? (
                    <NavLink
                        to={path}
                        className={'flex items-center w-full px-2 py-1'}
                    >
                        {({ isActive }) => (
                            <>
                                <span className='w-4 group-data-[collapsible=icon]:-ml-[0.2rem]'>
                                    {icon}
                                </span>
                                <SidebarGroupLabel
                                    className={`text-base ${isActive
                                        ? 'text-white dark:text-black'
                                        : 'text-black dark:text-white'
                                        }`}
                                >
                                    {path}
                                </SidebarGroupLabel>
                            </>
                        )}
                    </NavLink>
                ) : (
                    <NavLink
                        to={path}
                        className={({ isActive }) => `
                            flex items-center gap-2 w-full rounded-md px-2 py-1
                            ${isActive
                                ? 'bg-black text-white dark:bg-white dark:text-black [&_svg]:text-white dark:[&_svg]:text-black'
                                : 'text-sidebar-accent-foreground'
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <span className='w-4 group-data-[collapsible=icon]:-ml-[0.2rem]'>
                                    {icon}
                                </span>
                                <SidebarGroupLabel
                                    className={`text-base ${isActive
                                        ? 'text-white dark:text-black'
                                        : 'text-black dark:text-white'
                                        }`}
                                >
                                    {path}
                                </SidebarGroupLabel>
                            </>
                        )}
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
        </SidebarGroupUi>
    );
};

export default SidebarGroupHeadComponent;