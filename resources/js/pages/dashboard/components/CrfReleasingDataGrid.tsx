import BorrowedCheckModal from '@/components/borrowed-check-modal';
import { detailsCrf, updateStatus } from '@/routes';
import { Crf, InertiaPagination } from '@/types';
import { router } from '@inertiajs/react';
import { Button, Chip, MenuItem, Select } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useState } from 'react';

const renderStatus = (status: 'Releasing' | 'Borrowed' | 'Signature') => {
    const colors: { [index: string]: 'success' | 'error' | 'info' } = {
        Signature: 'info',
        Releasing: 'success',
        Borrowed: 'error',
    };

    return <Chip label={status} color={colors[status]} size="small" />;
};

export default function CrfReleasingDataGrid({
    crf,
    pagination,
}: {
    crf: InertiaPagination<Crf>;
    pagination: (model: GridPaginationModel) => void;
}) {
    console.log(crf);
    const [checkId, setCheckId] = useState<number | undefined>();
    const [open, setOpen] = useState(false);
    const [bu, setBu] = useState('');
    const handleClose = () => setOpen(false);

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
            minWidth: 100,
        },
        {
            field: 'ckNo',
            headerName: 'CK No.',
            headerAlign: 'right',
            align: 'right',
            minWidth: 100,
        },
         {
            field: 'details',
            headerName: 'Check Details',
            minWidth: 120,
            renderCell: (params) => {
                return (
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                            router.visit(detailsCrf(params.row.id));
                        }}
                    >
                        View
                    </Button>
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
                const { checkStatus } = params.row;

                return (
                    <Select
                        size="small"
                        value={checkStatus.status ?? ''}
                        label="For Signature"
                        onChange={(e) =>
                            handleStatusChange(checkStatus.id, e.target.value)
                        }
                    >
                        <MenuItem value="release">
                            {' '}
                            <Chip label="Released Check" color="primary" />
                        </MenuItem>
                        <MenuItem value="forward">
                            <Chip label="Forward Check" color="secondary" />
                        </MenuItem>
                        <MenuItem value="deposit">
                            <Chip label="Deposit Check" color="info" />
                        </MenuItem>
                        <MenuItem value="stale">
                            <Chip label="Stale Check" color="warning" />
                        </MenuItem>
                        <MenuItem value="cancel">
                            <Chip label="Cancel Check" color="error" />
                        </MenuItem>
                    </Select>
                );
            },
        },
    ];

    const handleStatusChange = (id: number, value: string) => {
        router.put(
            updateStatus(id),
            {
                value: value,
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <>
            <DataGrid
                rows={crf.data}
                columns={columnsCrf}
                rowCount={crf.meta.total}
                 rowHeight={70}
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
            <BorrowedCheckModal
                bu={bu}
                whichCheck="crf"
                checkId={checkId}
                open={open}
                handleClose={handleClose}
            />
        </>
    );
}
