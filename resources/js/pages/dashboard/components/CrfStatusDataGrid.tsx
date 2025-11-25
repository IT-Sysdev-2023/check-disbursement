import { detailsCrf } from '@/routes';
import { Crf, inertiaPagination } from '@/types';
import { router } from '@inertiajs/react';
import { Chip, MenuItem, Select } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';



export default function CrfStatusDataGrid({
    crf,
    pagination,
}: {
    crf: inertiaPagination<Crf>;
    pagination: (model: GridPaginationModel) => void;
}) {

    const columnsCrf: GridColDef[] = [
        {
            field: 'crf',
            headerName: 'CRF #',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'company',
            headerName: 'Company',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'no',
            headerName: 'No.',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'paidTo',
            headerName: 'Paid To',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'amount',
            headerName: 'Amount',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'ckNo',
            headerName: 'CK No.',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            minWidth: 120,
            renderCell: (params) => {
                const statusMap: Record<
                    string,
                    {
                        label: string;
                        color: 'primary' | 'success' | 'warning' | 'error';
                    }
                > = {
                    release: { label: 'Released', color: 'primary' },
                    forward: { label: 'Forwarded', color: 'warning' },
                    deposit: { label: 'Deposit', color: 'success' },
                    cancel: { label: 'Cancelled', color: 'error' },
                };

                return (
                    <Chip
                        label={
                            statusMap[params.row.checkStatus.status]?.label ||
                            'For Releasing'
                        }
                        color={
                            statusMap[params.row.checkStatus.status]?.color ||
                            'default'
                        }
                    />
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Action',
            width: 130,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            renderCell: (params) => {
                const { status } = params.row;
                return (
                    <Select
                        size="small"
                        value={status ?? ''}
                        label="For Signature"
                        onChange={(e) =>
                            handleStatusChange(
                                params.row.id,
                                e.target.value,
                            )
                        }
                    >
                        <MenuItem value="details">
                            {' '}
                            Check Request Form Details
                        </MenuItem>
                        <MenuItem value="scannedCheck">
                            Scanned Check Details
                        </MenuItem>
                    </Select>
                );
            },
        },
    ];

    const handleStatusChange = (id: number, value: string) => {
        if (value === 'details') {
            router.visit(detailsCrf(id));
        }
      
    };

    return (
        <>
            <DataGrid
                rows={crf.data}
                columns={columnsCrf}
                rowCount={crf.meta.total}
                paginationMode="server"
                paginationModel={{
                    page: crf.meta.current_page - 1,
                    pageSize: crf.meta.per_page,
                }}
                pageSizeOptions={[10, 15, 25, 50]}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
                onPaginationModelChange={pagination}
                disableColumnResize
                density="compact"
                slotProps={{
                    filterPanel: {
                        filterFormProps: {
                            logicOperatorInputProps: {
                                variant: 'outlined',
                                size: 'small',
                            },
                            columnInputProps: {
                                variant: 'outlined',
                                size: 'small',
                                sx: { mt: 'auto' },
                            },
                            operatorInputProps: {
                                variant: 'outlined',
                                size: 'small',
                                sx: { mt: 'auto' },
                            },
                            valueInputProps: {
                                InputComponentProps: {
                                    variant: 'outlined',
                                    size: 'small',
                                },
                            },
                        },
                    },
                }}
            />
        </>
    );
}
