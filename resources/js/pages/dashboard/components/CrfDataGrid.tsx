import BorrowedCheckModal from '@/components/borrowed-check-modal';
import { detailsCrf } from '@/routes';
import { Crf, inertiaPagination } from '@/types';
import { router } from '@inertiajs/react';
import { Chip, MenuItem, Select } from '@mui/material';
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

export default function CrfDataGrid({
    crf,
    pagination,
}: {
    crf: inertiaPagination<Crf>;
    pagination: (model: GridPaginationModel) => void;
}) {
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
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'paid_to',
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
            field: 'ck_no',
            headerName: 'CK No.',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 120,
            renderCell: (params) => {
                return renderStatus(
                    params.row?.borrowed_check ? 'Borrowed' : 'Signature',
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
                                params.row.company,
                            )
                        }
                    >
                        <MenuItem value="details">Check Details</MenuItem>
                        {params.row.borrowed_check == null && (
                            <MenuItem value="borrow">Borrow Check</MenuItem>
                        )}
                        <MenuItem value="scan">Scan</MenuItem>
                    </Select>
                );
            },
        },
    ];

    const handleStatusChange = (id: number, value: string, bu: string) => {
        if (value === 'details') {
            router.visit(detailsCrf(id));
        }
        if (value === 'borrow') {
            setBu(bu);
            setCheckId(id);
            setOpen(true);
        }
    };

    return (
        <>
            <DataGrid
                rows={crf.data}
                columns={columnsCrf}
                rowCount={crf.total}
                paginationMode="server"
                paginationModel={{
                    page: crf.current_page - 1,
                    pageSize: crf.per_page,
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
