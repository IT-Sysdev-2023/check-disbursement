import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import {
    BorrowedCheque,
    InertiaPagination,
    type BreadcrumbItem,
} from '@/types';
import { Head } from '@inertiajs/react';
import TableDataGrid from '../dashboard/components/TableDataGrid';
import { returnedChequeColumns } from './components/returnedColumns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Returned Cheques',
        href: '#',
    },
];

export default function ReturnedCheques({
    cheques,
    filter,
}: {
    cheques: InertiaPagination<BorrowedCheque>;
    filter: {
        search: string;
    };
}) {
    const columns = returnedChequeColumns();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Returned Cheques" />
            <PageContainer title="Returned Cheques">
                <TableDataGrid
                    data={cheques}
                    filter={filter.search}
                    pagination={handlePagination}
                    handleSearchFilter={handleSearch}
                    handleSortFilter={handleSort}
                    columns={columns}
                />
            </PageContainer>
        </AppLayout>
    );
}
