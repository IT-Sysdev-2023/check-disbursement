import BorrowedCheckModal from '@/components/borrowed-check-modal';
import { details } from '@/routes';
import { Cv, inertiaPagination } from '@/types';
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

    const columns: GridColDef[] = [
        {
            field: 'cv_header',
            headerName: 'CV Number',
            minWidth: 150,
            valueGetter: (params: any) => params.cv_no,
        },
        {
            field: 'check_number',
            headerName: 'Check Number',
            headerAlign: 'right',
            align: 'right',
            flex: 0.5,
            minWidth: 50,
        },
        {
            field: 'check_amount',
            headerName: 'Check Amount',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'bank_account_no',
            headerName: 'Bank Account No.',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'bank_name',
            headerName: 'Bank Name',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'check_date',
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
                            handleStatusChange(params.row.id, e.target.value, params.row.cv_header.nav_header_table.nav_database.company)
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
            router.visit(details(id));
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
                rows={cvs.data}
                columns={columns}
                rowCount={cvs.total}
                paginationMode="server"
                paginationModel={{
                    page: cvs.current_page - 1,
                    pageSize: cvs.per_page,
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
                whichCheck='cv'
                checkId={checkId}
                open={open}
                bu={bu}
                handleClose={handleClose}
            />
        </>
    );
}
