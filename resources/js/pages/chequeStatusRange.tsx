import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { handlePagination } from '@/lib/utils';
import {
    BreadcrumbItem,
    ChequeStatusRangeType,
    PaginatorType,
    SelectionType,
} from '@/types';
import { router } from '@inertiajs/react';
import { Box, SelectChangeEvent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import SelectItem from './dashboard/components/SelectItem';
import { chequeStatusRangeColumn } from './eod/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cheque Status Monitoring',
        href: '#',
    },
];

export default function ChequeStatusRange({
    bank,
    items,
    data,
}: {
    bank: string;
    items: SelectionType[];
    data: PaginatorType<ChequeStatusRangeType>;
}) {
    const [selectedBank, setSelectedBank] = useState<string>(bank ?? 'all');

    const handleChange = async (event: SelectChangeEvent) => {
        const val = event.target.value;
        setSelectedBank(val);

        router.reload({
            data: {
                bank: event.target.value,
            },
        });
    };

    const chequeColumn = chequeStatusRangeColumn();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <PageContainer title="Cheque Status Monitoring">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <SelectItem
                        handleChange={handleChange}
                        value={selectedBank}
                        title="Bank/ Bank Account"
                        items={items}
                    />
                    <DataGrid
                        sx={{ mt:3}}
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
                </Box>
            </PageContainer>
        </AppLayout>
    );
}
