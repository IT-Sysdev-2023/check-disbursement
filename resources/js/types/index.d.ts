import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    submenu?: {
        title: string;
        href: NonNullable<InertiaLinkProps['href']>;
        icon: LucideIcon | null;
    }[];
}
interface Page<PageProps> {
    component: string;
    props: PageProps;
    url: string;
    version?: string;
}

export interface SharedData {
    name: string;
    flash: { status: boolean; message?: string };
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Cv {
    id: number;
    nav_table_id: number;
    cv_number: string;
    check_number: number;
    check_amount: string;
    check_date: string;
    payee: string;
    created_at: string;
    updated_at: string;
}

export interface Crf {
    id: number;
    filename: string;
    company: string;
    no: number;
    location: string;
    date: string;
    paid_to: string;
    particulars: string;
    amount: number;
    bank: string;
    ck_no: number;
    prepared_by: string;
    created_at: string;
    updated_at: string;
}

export interface inertiaPagination<T> {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    current_page_url: string;
    first_page_url: string;
    last_page_url?: string;
    next_page_url?: string;
    prev_page_url?: string;
    path?: string;
    from: number;
    to: number;
    data: T[];
}

export interface ProgressState {
    [message: string]: {
        progress: number;
        buffer: number;
        message: string;
    };
}

export interface EventType {
    percentage: number;
    total: number;
    message: string;
}

export interface FlashReponse {
    status: boolean;
    message: string;
    duplicates: string[]
}
