import * as Collapsible from '@radix-ui/react-collapsible';
import { useState } from 'react';
import SidebarGroupHeadComponent from './sidebar-group-head';
import SidebarGroupContentComponent from './sidebar-group-content';
import type { DashboardRouteConfig } from '@/routes/dashboard/route-config';

interface SidebarGroupProps {
    route: DashboardRouteConfig;
}

const SidebarGroupComponent = ({ route }: SidebarGroupProps) => {
    const { path, subRoutes, icon, isShown } = route;
    const [isOpen, setIsOpen] = useState(false); 

    if (!isShown) return null;

    return (
        <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
            <Collapsible.Trigger className='w-full'>
                <div>
                    <SidebarGroupHeadComponent
                        path={path}
                        subRoutes={subRoutes?.filter((subRoute) => subRoute.isShown)}
                        icon={icon}
                        open={isOpen} 
                        onToggle={() => setIsOpen(!isOpen)}
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