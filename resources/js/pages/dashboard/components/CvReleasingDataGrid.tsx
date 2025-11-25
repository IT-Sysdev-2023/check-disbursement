import ReasonCancellationModal from '@/components/reason-cancellation-modal';
import { details, releaseCheck } from '@/routes';
import { Cv, inertiaPagination } from '@/types';
import { router } from '@inertiajs/react';
import { Button, Chip, MenuItem, Select } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useState } from 'react';


export default function CvReleasingDataGrid({
    cvs,
    pagination,
}: {
    cvs: inertiaPagination<Cv>;
    pagination: (model: GridPaginationModel) => void;
}) {
    const [open, setOpen] = useState(false);
    const [checkId, setCheckId] = useState();
    const columns: GridColDef[] = [
        {
            field: 'checkNumber',
            headerName: 'Check Number',
            headerAlign: 'right',
            align: 'right',
            flex: 0.5,
            minWidth: 50,
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
            field: 'cvHeader',
            headerName: 'CV Number',
            minWidth: 150,
            valueGetter: (params) => params.cvNo,
        },
        {
            field: 'payee',
            headerName: 'Payee',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 80,
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
            field: 'details',
            headerName: 'Check Details',
            minWidth: 120,
            renderCell: (params) => {
                return (
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                            router.visit(details(params.row.id));
                        }}
                    >
                        View
                    </Button>
                );
            },
        },

        {
            field: 'businessUnit',
            headerName: 'Business Unit',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 80,
            renderCell: (params) => {
                return params.row.company.name || '—';
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
                        value={ ''}
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

        if (value === 'cancel') {
            setCheckId(id);
            setOpen(true);
            return;
        }
        // if (value === 'release') {
        router.visit(releaseCheck([id, value]));
        // } 
        // router.put(
        //     updateStatus(id),
        //     {
        //         value: value,
        //     },
        //     {
        //         preserveScroll: true,
        //         preserveState: true,
        //     },
        // );
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

            <ReasonCancellationModal
                            checkId={checkId}
                            open={open}
                            handleClose={()=> setOpen(false)}
                        />
        </>
    );
}
