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
    roles?: Role[];
    permissions: Permission[];
    company_permissions: {
        id: number;
        user_id: number;
        company_id: number;
        company: Company;
        created_at: string;
        updated_at: string;
    }[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface SelectionType {
    label: string;
    value: number | string;
}

export interface DateFilterType {
    start: string | null;
    end: string | null;
}

export type ActionHandler = (id: number, bu?: string) => void;

export type ActionType = 'details' | 'borrow' | 'scan';
export type ReleasingType =
    | 'release'
    | 'forward'
    | 'deposit'
    | 'stale'
    | 'cancel';

export interface Company {
    id: number;
    code: string;
    company: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Role {
    created_at: string;
    guard_name: string;
    id: number;
    name: string;
    permissions: Permission[];
    pivot: PivotRole;
    updated_at: string;
}
export interface Permission {
    created_at: string;
    guard_name: string;
    id: number;
    name: string;
    pivot: PivotRole;
    updated_at: string;
}
export interface PivotRole {
    model_id: number;
    model_type: string;
    role_id: number;
}
export interface Cv {
    id: number;
    nav_table_id: number;
    cv_number: string;
    checkNumber: number;
    checkAmount: string;
    checkDate: string;
    payee: string;
    bankAccountNo: string;
    bankName: string;
    checkClassLocation: string;
    clearingDate: string;
    cvHeader?: CvHeader;
    borrowedCheck: BorrowedCheck;
    checkStatus: CheckStatus;
    created_at: string;
    updated_at: string;
}

export interface BorrowedCheck {
    id: number;
    check_id: number;
    name: string;
    reasong: string;
    check: 'crf' | 'cv';
}

export interface CheckStatus {
    id: number;
    user_id: number;
    check_id: number;
    status: 'release' | 'forward' | 'deposit' | 'cancel' | 'stale';
    check: 'crf' | 'cv';
    receivers_name?: string | null;
    image: string | null;
    signature: string | null;
    created_at: string;
    updated_at: string;
}

export interface CvHeader {
    cvNo: number;
    vendorNo: string;
    remarks: string;
}

export interface Crf {
    id: number;
    crf: string;
    filename: string;
    company: string;
    no: number;
    location: string;
    date: string;
    paidTo: string;
    particulars: string;
    amount: number;
    bank: string;
    ckNo: number;
    preparedBy: string;
    created_at: string;
    updated_at: string;
}

export interface Links {
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
}

export interface Meta {
    current_page: number;
    from: number;
    last_page: number;
    links: {
        active: boolean;
        label: string;
        page?: number;
        url?: string;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}
export interface InertiaPagination<T> {
    links: Links;
    meta: Meta;
    data: T[];
}

export type SelectionModelType = {
    type: 'include';
    ids: Set<GridRowId>;
};

export type DistinctMonths = Record<
    string,
    { cv_date: string; total: number }[]
>;

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
    duplicates: string[];
}
