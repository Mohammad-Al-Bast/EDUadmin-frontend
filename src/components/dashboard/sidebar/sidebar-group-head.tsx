import { SidebarGroup as SidebarGroupUi, SidebarGroupLabel } from '@/components/ui/sidebar';
import { NavLink } from 'react-router-dom';

interface SidebarGroupHeadProps {
    path: string;
    open: boolean;
    icon: React.ReactNode;
}

const SidebarGroupHead = ({
    path,
    icon,
}: SidebarGroupHeadProps) => {
    const replaceHyphens = (str: string) => str.replace(/-/g, ' ');

    return (
        <SidebarGroupUi>
            <div
                className='flex items-center justify-between w-full capitalize'
            >

                <NavLink
                    to={path}
                    className={({ isActive }) => `
                            flex items-center gap-2 w-full rounded-md py-0.5
                            ${isActive
                            ? 'bg-black text-white dark:bg-white dark:text-black [&_svg]:text-white dark:[&_svg]:text-black'
                            : 'text-sidebar-accent-foreground'
                        }
                            ${icon ? 'px-2' : ''}
                            `}
                >
                    {({ isActive }) => (
                        <>
                            {
                                icon &&
                                <span className='w-4 group-data-[collapsible=icon]:-ml-[0.2rem]'>
                                    {icon}
                                </span>
                            }
                            <SidebarGroupLabel
                                className={`text-base ${isActive
                                    ? 'text-white dark:text-black'
                                    : 'text-black dark:text-white'
                                    }`}
                            >
                                {replaceHyphens(path)}
                            </SidebarGroupLabel>
                        </>
                    )}
                </NavLink>
            </div>
        </SidebarGroupUi>
    );
};

export default SidebarGroupHead;