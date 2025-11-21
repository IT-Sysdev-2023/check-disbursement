import BorrowedCheckModal from '@/components/borrowed-check-modal';
import { details, scanCheck } from '@/routes';
import { Cv, FlashReponse, inertiaPagination } from '@/types';
import { router } from '@inertiajs/react';
import { Alert, Chip, MenuItem, Select, Snackbar } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useState } from 'react';

const renderStatus = (status: 'Releasing' | 'Borrowed' | 'Signature') => {
    const colors: { [index: string]: 'success' | 'error' | 'info' } = {
        Signature: 'info',
        Releasing: 'success',
        Borrowed: 'error',
    };

    const label = ['Signature', 'Releasing'].includes(status)
        ? 'For ' + status
        : status;

    return <Chip label={label} color={colors[status]} size="small" />;
};

export default function CvDataGrid({
    cvs,
    pagination,
}: {
    cvs: inertiaPagination<Cv>;
    pagination: (model: GridPaginationModel) => void;
}) {
    const [checkId, setCheckId] = useState<number | undefined>();
    const [open, setOpen] = useState(false);
    const [bu, setBu] = useState('');
    const handleClose = () => setOpen(false);
    const [message, setMessage] = useState('');
    const [openSnackBar, setOpenSnackBar] = useState(false);

    const columns: GridColDef[] = [
        {
            field: 'cvHeader',
            headerName: 'CV Number',
            minWidth: 150,
            valueGetter: (params) => params.cvNo,
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
            field: 'payee',
            headerName: 'Payee',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
        },
        {
            field: 'company',
            headerName: 'Business Unit',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            valueGetter: (params) => params.name,
        },
        {
            field: 'checkDate',
            headerName: 'Check Date',
            headerAlign: 'right',
            align: 'right',
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 120,
            renderCell: (params) => {
                return renderStatus(
                    params.row?.borrowedCheck ? 'Borrowed' : 'Signature',
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
                        onChange={(e) =>
                            handleStatusChange(
                                params.row.id,
                                e.target.value,
                                params.row.company.name,
                            )
                        }
                    >
                        <MenuItem value="details">Check Details</MenuItem>
                        {params.row.borrowedCheck == null && (
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
            router.visit(details(id));
        }

        if (value === 'borrow') {
            setBu(bu);
            setCheckId(id);
            setOpen(true);
        }

        if (value === 'scan') {
            router.post(
                scanCheck(),
                {
                    check: 'cv',
                    status: null,
                    id: id,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: (page) => {
                        setOpenSnackBar(true);
                        const m = page.props.flash as FlashReponse;
                        setMessage(m.message);
                    },
                },
            );
        }
    };

    return (
        <>
            <DataGrid
                rows={cvs.data}
                columns={columns}
                rowCount={cvs.meta.total}
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

            <BorrowedCheckModal
                whichCheck="cv"
                checkId={checkId}
                open={open}
                bu={bu}
                handleClose={handleClose}
            />
            
            <Snackbar
                open={openSnackBar}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
}
