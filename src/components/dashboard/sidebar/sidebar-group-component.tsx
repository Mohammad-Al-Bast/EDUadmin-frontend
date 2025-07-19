import * as Collapsible from '@radix-ui/react-collapsible';
import { useState } from 'react';
import SidebarGroupHeadComponent from './sidebar-group-head-component';
import SidebarGroupContentComponent from './sidebar-group-content-component';
import type { DashboardRouteConfig } from '@/routes/dashboard/route-config';

interface SidebarGroupProps {
    route: DashboardRouteConfig;
}

const SidebarGroupComponent = ({ route }: SidebarGroupProps) => {
    const { path, subRoutes, icon, isShown } = route;
    const [isOpen, setIsOpen] = useState(false); // Add state for open/closed

    if (!isShown) return null;

    return (
        <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
            <Collapsible.Trigger className='w-full'>
                <div>
                    <SidebarGroupHeadComponent
                        path={path}
                        subRoutes={subRoutes?.filter((subRoute) => subRoute.isShown)}
                        icon={icon}
                        open={isOpen} // Pass the actual open state
                        onToggle={() => setIsOpen(!isOpen)} // Pass the toggle handler
                    />
                </div>
            </Collapsible.Trigger>
            <Collapsible.Content>
                <SidebarGroupContentComponent
                    subRoutes={subRoutes?.filter((subRoute) => subRoute.isShown)}
                    path={path}
                />
            </Collapsible.Content>
        </Collapsible.Root>
    );
};

export default SidebarGroupComponent;