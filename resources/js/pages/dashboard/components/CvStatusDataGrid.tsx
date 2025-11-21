
import { details } from '@/routes';
import { Cv, inertiaPagination } from '@/types';
import { router } from '@inertiajs/react';
import { Chip, MenuItem, Select } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';

export default function CvStatusDataGrid({
    cvs,
    pagination,
}: {
    cvs: inertiaPagination<Cv>;
    pagination: (model: GridPaginationModel) => void;
}) {

    const columns: GridColDef[] = [
        // {
        //     field: 'cv_header',
        //     headerName: 'CV Number',
        //     minWidth: 150,
        //     valueGetter: (params) => params.cv_no,
        // },
        {
            field: 'checkNumber',
            headerName: 'Check Number',
            headerAlign: 'right',
            align: 'right',
            flex: 0.5,
            minWidth: 50,
        },
        {
            field: 'checkAmount',
            headerName: 'Check Amount',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'bankAccountNo',
            headerName: 'Bank Account No.',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'bankName',
            headerName: 'Bank Name',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'checkDate',
            headerName: 'Check Date',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 120,
            flex: 1,
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
                            statusMap[params.row.scannedCheck.status]?.label ||
                            'For Releasing'
                        }
                        color={
                            statusMap[params.row.scannedCheck.status]?.color ||
                            'default'
                        }
                    />
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Action',
            width: 100,
            align: 'center',
            flex: 1,
            headerAlign: 'center',
            sortable: false,
            renderCell: (params) => {
                const { scannedCheck } = params.row;
                return (
                    <Select
                        size="small"
                        value={scannedCheck.status ?? ''}
                        label=""
                        onChange={(e) =>
                            handleStatusChange(params.row.id, e.target.value)
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
            router.visit(details(id));
        }

        // if (value === 'borrow') {
        //     // setBu(bu);
        //     setCheckId(id);
        //     setOpen(true);
        // }
    };

    return (
        <>
            <DataGrid
                rows={cvs.data}
                columns={columns}
                rowCount={cvs.meta.total}
                rowHeight={70}
                paginationMode="server"
                paginationModel={{
                    page: cvs.meta.current_page - 1,
                    pageSize: cvs.meta.per_page,
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
