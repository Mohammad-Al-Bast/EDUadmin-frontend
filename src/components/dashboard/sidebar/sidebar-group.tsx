import * as Collapsible from '@radix-ui/react-collapsible';
import { useState } from 'react';
import type { DashboardRouteConfig } from '@/routes/dashboard/route-config';
import SidebarGroupHead from './sidebar-group-head';

interface SidebarGroupProps {
    route: DashboardRouteConfig;
}

const SidebarGroup = ({ route }: SidebarGroupProps) => {
    const { path, icon, isShown } = route;
    const [isOpen, setIsOpen] = useState(false);

    if (!isShown) return null;

    return (
        <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
            <Collapsible.Trigger className='w-full'>
                <div>
                    <SidebarGroupHead
                        path={path}
                        icon={icon}
                        open={isOpen}
                    />
                </div>
            </Collapsible.Trigger>
        </Collapsible.Root>
    );
};

export default SidebarGroup;
