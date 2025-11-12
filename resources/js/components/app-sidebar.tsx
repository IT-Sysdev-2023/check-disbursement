import { retrievedCrf } from '@/actions/App/Http/Controllers/CrfController';
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
import {
    about,
    changePassword,
    checkRequestForm,
    checkStatus,
    checkVoucher,
    dashboard,
    notifications,
    report,
    retrievedRecords,
} from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Bell,
    BookOpen,
    Check,
    Database,
    FileSpreadsheet,
    Key,
    LayoutGrid,
    PackageOpen,
    Tickets,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Extract',
        href: '#',
        icon: Database,
        submenu: [
            { title: 'Check Voucher', href: checkVoucher(), icon: Tickets },
            {
                title: 'Check Request Form',
                href: checkRequestForm(),
                icon: BookOpen,
            },
        ],
    },
    {
        title: 'Retrieved CV',
        href: retrievedRecords(),
        icon: PackageOpen,
    },
    {
        title: 'Retrieved CRF',
        href: retrievedCrf(),
        icon: PackageOpen,
    },
    {
        title: 'Check Status',
        href: checkStatus(),
        icon: Check,
    },
    {
        title: 'Report',
        href: report(),
        icon: FileSpreadsheet,
    },
    {
        title: 'About Us',
        href: about(),
        icon: Users,
    },
    {
        title: 'Change Password',
        href: changePassword(),
        icon: Key,
    },
    {
        title: 'Notifications',
        href: notifications(),
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
