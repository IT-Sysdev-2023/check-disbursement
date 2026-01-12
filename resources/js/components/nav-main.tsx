import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import {
    about,
    changePassword,
    checkReleasing,
    checkRequestForm,
    checkStatus,
    checkVoucher,
    forwardedCheckReleasing,
    forwardedReleasing,
    notifications,
    report,
    retrievedRecords,
    users,
} from '@/routes';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Bell,
    BookOpen,
    Check,
    ChevronDown,
    ChevronRight,
    Database,
    FileSpreadsheet,
    Forward,
    Key,
    PackageOpen,
    Rocket,
    Tickets,
    Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage<SharedData>();
    const user = page.props.auth.user;

    // Memoize role names (array of strings)
    const roles = useMemo(
        () => user?.roles?.map((r) => r.name) || [],
        [user?.roles],
    );
    const isAdmin = roles.includes('admin');
    const releasing = roles.includes('releasing');
    const scanning = roles.includes('scanning');
    const forwarded = roles.includes('forwarded');

    const [openItem, setOpenItem] = useState<string | null>(null);

    // 🔹 Append "Users" only if admin
    const finalItems = useMemo(() => {
        return [
            ...items,
            ...(isAdmin || scanning
                ? [
                      {
                          title: 'Extract',
                          href: '#',
                          icon: Database,
                          submenu: [
                              {
                                  title: 'Check Voucher',
                                  href: checkVoucher(),
                                  icon: Tickets,
                              },
                              {
                                  title: 'Check Request Form',
                                  href: checkRequestForm(),
                                  icon: BookOpen,
                              },
                          ],
                      },
                      {
                          title: 'Retrieved CV/CRF',
                          href: retrievedRecords(),
                          icon: PackageOpen,
                      },
                  ]
                : []),
            ...(isAdmin || releasing
                ? [
                      {
                          title: 'Check Releasing',
                          href: checkReleasing(),
                          icon: Check,
                      },
                  ]
                : []),
             ...(isAdmin || forwarded
                ? [
                      {
                          title: 'Forwarded Check',
                          href: forwardedCheckReleasing(),
                          icon: Forward,
                     },
                    {
                          title: 'Check Releasing(Forwarded)',
                          href: forwardedReleasing(),
                          icon: Rocket,
                      },
                  ]
                : []),
            ...(isAdmin || releasing || scanning
                ? [
                      {
                          title: 'Check Status',
                          href: checkStatus(),
                          icon: Activity,
                      },
                  ]
                : []),
            ...(isAdmin
                ? [
                      {
                          title: 'Users',
                          href: users(),
                          icon: Users,
                      } as NavItem,
                  ]
                : []),
            {
                title: 'Report',
                href: report(),
                icon: FileSpreadsheet,
            },
            //         {
            //     title: 'Retrieved CRF',
            //     href: RetrievedCrf(),
            //     icon: PackageOpen,
            // },

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
    }, [items, isAdmin, releasing, scanning]);

    // Automatically open submenu if current page belongs to it
    useEffect(() => {
        for (const item of finalItems) {
            if (item.submenu) {
                for (const sub of item.submenu) {
                    const subHref =
                        typeof sub.href === 'string' ? sub.href : sub.href.url;
                    if (page.url.startsWith(subHref)) {
                        setOpenItem(item.title);
                        return;
                    }
                }
            }
        }
    }, [page.url, finalItems]);

    const handleToggle = (title: string) => {
        setOpenItem((prev) => (prev === title ? null : title));
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {finalItems.map((item) => {
                    const href =
                        typeof item.href === 'string'
                            ? item.href
                            : item.href.url;

                    const isActive = page.url.startsWith(href);
                    const hasSubmenu = Array.isArray(item.submenu);
                    const isOpen = openItem === item.title;

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild={!hasSubmenu}
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                onClick={
                                    hasSubmenu
                                        ? () => handleToggle(item.title)
                                        : undefined
                                }
                            >
                                {hasSubmenu ? (
                                    <div className="flex w-full cursor-pointer items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </div>
                                        {isOpen ? (
                                            <ChevronDown size={16} />
                                        ) : (
                                            <ChevronRight size={16} />
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href={href}
                                        headers={{
                                            'Cache-Control': 'no-cache',
                                        }}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                )}
                            </SidebarMenuButton>

                            {/* Submenu */}
                            {hasSubmenu && isOpen && (
                                <div className="mt-1 ml-6 space-y-1">
                                    {item.submenu?.map((sub) => {
                                        const subHref =
                                            typeof sub.href === 'string'
                                                ? sub.href
                                                : sub.href.url;
                                        const isSubActive =
                                            page.url.startsWith(subHref);

                                        return (
                                            <SidebarMenuButton
                                                key={sub.title}
                                                asChild
                                                isActive={isSubActive}
                                                tooltip={{
                                                    children: sub.title,
                                                }}
                                            >
                                                <Link
                                                    href={subHref}
                                                    prefetch
                                                    className="flex items-center gap-2 pl-4 text-sm"
                                                >
                                                    {sub.icon && <sub.icon />}
                                                    <span>{sub.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        );
                                    })}
                                </div>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
