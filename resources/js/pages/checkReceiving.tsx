import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { Borrower, InertiaPagination, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import BorrowedTableGrid from './dashboard/components/borrowedTableGrid';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cheque Receiving',
        href: '#',
    },
];

export default function CheckReceiving({
    cheques,
}: {
    cheques: InertiaPagination<Borrower>;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CR" />
            <PageContainer title="Assign Approver">
                <BorrowedTableGrid data={cheques} />
            </PageContainer>
        </AppLayout>
    );
}
