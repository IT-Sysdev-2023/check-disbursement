import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import {
    BreadcrumbItem,
} from '@/types';
import { Box } from '@mui/material';
import { chequeStatusRangeColumn } from './eod/columns';
import { DataGrid, GridPaginationModel } from '@mui/x-data-grid';
import { router } from '@inertiajs/react';
import { chequeStatusRange } from '@/routes';
import { handlePagination } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cheque Status Monitoring',
        href: '#',
    },
];

export default function ChequeStatusRange({
    data,
}: {
    data: any;
}) {
    const chequeColumn = chequeStatusRangeColumn();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <PageContainer title="Cheque Status Monitoring">
                <Box sx={{ width: '100%', typography: 'body1' }}>

                    <DataGrid
                                    rows={data.data}
                                    rowCount={data.total}
                                    columns={chequeColumn}
                                    paginationMode="server"
                                    disableRowSelectionOnClick={false}
                                    paginationModel={{
                                        page: data.current_page - 1,
                                        pageSize: data.per_page,
                                    }}
                                    onPaginationModelChange={handlePagination}
                                    showToolbar
                                    pageSizeOptions={[5, 10, 15, 25]}
                                    slotProps={{
                                        loadingOverlay: {
                                            variant: 'circular-progress',
                                            noRowsVariant: 'circular-progress',
                                        },
                                        baseIconButton: {
                                            size: 'small',
                                        },
                                    }}
                                />
                    {/* <TableDataGrid
                        data={records}
                        filter={filter.search}
                        pagination={handlePagination}
                        handleSearchFilter={handleSearch}
                        handleSortFilter={handleSort}
                        columns={chequeColumn}
                    /> */}
                </Box>
            </PageContainer>
        </AppLayout>
    );
}
