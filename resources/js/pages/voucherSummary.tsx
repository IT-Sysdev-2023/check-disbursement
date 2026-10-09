import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import {
    BreadcrumbItem,
} from '@/types';
import { Box } from '@mui/material';
import { chequeStatusRangeColumn, voucherSummaryColumn } from './eod/columns';
import { DataGrid, GridPaginationModel } from '@mui/x-data-grid';
import { router } from '@inertiajs/react';
import { chequeStatusRange } from '@/routes';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import TableDataGrid from './dashboard/components/TableDataGrid';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cheque Status Monitoring',
        href: '#',
    },
];

export default function VoucherSummary({
    cheques,
}: {
    cheques: any;
}) {
    const chequeColumn = voucherSummaryColumn();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <PageContainer title="Voucher Status Summary">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TableDataGrid
                        data={cheques}
                        // filter={filter.search}
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
