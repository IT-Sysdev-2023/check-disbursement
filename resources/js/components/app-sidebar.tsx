import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { changePassword, dashboard, notifications } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Bell, BookOpen, Check, FileSpreadsheet, Folder, Key, LayoutGrid, PackageOpen, Users } from 'lucide-react';
import AppLogo from './app-logo';
import { releasing } from '@/routes/sidebar';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Check Releasing',
        href: releasing(),
        icon: PackageOpen,
    },
    {
        title: 'Check Status',
        href: 'status()',
        icon: Check,
    },
    {
        title: 'Report',
        href: 'report()',
        icon: FileSpreadsheet,
    },
    {
        title: 'About Us',
        href: 'about()',
        icon: Users,
    },
    {
        title: 'Change Password',
        href: 'changePassword()',
        icon: Key,
    },
    {
        title: 'Notifications',
        href: 'notifications()',
        icon: Bell,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Get Started',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
