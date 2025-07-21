import * as Collapsible from '@radix-ui/react-collapsible';
import { useState } from 'react';
import type { DashboardRouteConfig } from '@/routes/dashboard/route-config';
import SidebarGroupHead from './sidebar-group-head';
import SidebarGroupContent from './sidebar-group-content';

interface SidebarGroupProps {
    route: DashboardRouteConfig;
}

const SidebarGroup = ({ route }: SidebarGroupProps) => {
    const { path, subRoutes, icon, isShown } = route;
    const [isOpen, setIsOpen] = useState(false);

    if (!isShown) return null;

    return (
        <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
            <Collapsible.Trigger className='w-full'>
                <div>
                    <SidebarGroupHead
                        path={path}
                        subRoutes={subRoutes?.filter((subRoute) => subRoute.isShown)}
                        icon={icon}
                        open={isOpen}
                        onToggle={() => setIsOpen(!isOpen)}
                    />
                </div>
            </Collapsible.Trigger>
            <Collapsible.Content>
                <SidebarGroupContent
                    subRoutes={subRoutes?.filter((subRoute) => subRoute.isShown)}
                    path={path}
                />
            </Collapsible.Content>
        </Collapsible.Root>
    );
};

export default SidebarGroup;