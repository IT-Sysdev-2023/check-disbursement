import FlashNotifier from '@/flash-notifier';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import NotificationListener from '@/notification-listener';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <FlashNotifier />
        <NotificationListener />
        {children}
    </AppLayoutTemplate>
);
