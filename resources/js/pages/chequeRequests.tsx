import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { Borrower, InertiaPagination, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import BorrowedTableGrid from './dashboard/components/borrowedTableGrid';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Releasing',
        href: '#',
    },
];

export default function CheckReleasing({
    cheques,
}: {
    cheques: InertiaPagination<Borrower>;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Check Releasing">
                <BorrowedTableGrid data={cheques} />
            </PageContainer>
        </AppLayout>
    );
}
