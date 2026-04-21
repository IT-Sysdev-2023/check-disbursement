import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import {
    about,
    bankAccountSetup,
    bankSetup,
    checkReleasing,
    checkRequestForm,
    checkStatus,
    checkVoucher,
    chequeRequests,
    closingChecks,
    forwardedCheckReleasing,
    forwardedReleasing,
    report,
    retrievedRecords,
    users,
} from '@/routes';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    BookmarkX,
    BookOpen,
    Check,
    ChevronDown,
    ChevronRight,
    Database,
    FileSpreadsheet,
    FolderCheck,
    Forward,
    Landmark,
    PackageOpen,
    Pen,
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
    // const releasing = roles.includes('releasing');
    const disbursementOfficer = roles.includes('disbursement_officer');
    const regionalOfficer = roles.includes('regional_officer');
    const closingOfficer = roles.includes('closing_officer');
    const sectionHead = roles.includes('section_head');
    const viewing = roles.includes('viewing');

    const [openItem, setOpenItem] = useState<string | null>(null);

    // 🔹 Append "Users" only if admin
    const finalItems = useMemo(() => {
        return [
            ...items,
            ...(isAdmin || disbursementOfficer
                ? [
                      {
                          title: 'Extract',
                          href: '#',
                          icon: Database,
                          submenu: [
                              {
                                  title: 'Cheque Voucher',
                                  href: checkVoucher(),
                                  icon: Tickets,
                              },
                              {
                                  title: 'Cheque Request Form',
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
            ...(isAdmin || sectionHead
                ? [
                      {
                          title: 'Cheque Receiving',
                          href: chequeRequests(),
                          icon: FolderCheck,
                      },
                    //   {
                    //       title: 'Check/Docs Borrowing',
                    //       href: checkBorrowing(),
                    //       icon: FolderCheck,
                    //   },
                      {
                          title: 'Cheque Releasing',
                          href: checkReleasing(),
                          icon: Check,
                      },
                  ]
                : []),
            ...(isAdmin || closingOfficer
                ? [
                      {
                          title: 'CV/ CRF List',
                          href: closingChecks(),
                          icon: BookmarkX,
                      },
                  ]
                : []),
            ...(isAdmin || regionalOfficer
                ? [
                      {
                          title: 'Forwarded Check',
                          href: forwardedCheckReleasing(),
                          icon: Forward,
                      },
                      {
                          title: 'Cheque Releasing(Forwarded)',
                          href: forwardedReleasing(),
                          icon: Rocket,
                      },
                  ]
                : []),
            ...(isAdmin ||
            disbursementOfficer ||
            regionalOfficer ||
            sectionHead ||
            closingOfficer || viewing
                ? [
                      {
                          title: 'Cheque Status',
                          href: checkStatus(),
                          icon: Activity,
                      },
                  ]
                : []),
            ...(isAdmin
                ? [
                      {
                          title: 'Set Up',
                          href: '#',
                          icon: Pen,
                          submenu: [
                              {
                                  title: 'Bank',
                                  href: bankSetup(),
                                  icon: Landmark,
                              },
                                {
                                  title: 'Bank Accounts',
                                  href: bankAccountSetup(),
                                  icon: Tickets,
                              },
                          ],
                      },
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
            // {
            //     title: 'Change Password',
            //     href: reset(),
            //     icon: Key,
            // },
            // {
            //     title: 'Notifications',
            //     href: notifications(),
            //     icon: Bell,
            // },
        ];
    }, [
        items,
        isAdmin,
        disbursementOfficer,
        closingOfficer,
        regionalOfficer,
        sectionHead,
        viewing
    ]);

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
        <SidebarGroup className="px-2 py-2">
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
