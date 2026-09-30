import PageContainer from '@/components/pageContainer';
import TableFilter from '@/components/tableFilter';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { chequeStatus } from '@/routes';
import {
    ChequeType,
    FilterType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head } from '@inertiajs/react';
import { Box } from '@mui/material';
import TableDataGrid from '../dashboard/components/TableDataGrid';
import { forReceivedColumn } from './components/cmcColumns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Status',
        href: '#',
    },
];

export default function ForReceived({
    cheques,
    company,
    businessUnits,
    filter,
}: {
    cheques: InertiaPagination<ChequeType>;
    businessUnits: SelectionType[];
    company: SelectionType[];
    filter: FilterType;
}) {
    const chequeColumn = forReceivedColumn();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Received Cheques">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TableFilter
                        company={company}
                        filters={filter}
                        businessUnits={businessUnits}
                        resetFilterRouter={chequeStatus()}
                    />
                    <TableDataGrid
                        data={cheques}
                        filter={filter.search}
                        pagination={handlePagination}
                        handleSearchFilter={handleSearch}
                        handleSortFilter={handleSort}
                        columns={chequeColumn}
                    />
                </Box>
            </PageContainer>
        </AppLayout>
    );
}
