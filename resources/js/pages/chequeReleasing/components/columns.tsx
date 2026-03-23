import { details, detailsCrf } from '@/routes';
import { router } from '@inertiajs/react';
import { Button, Chip, MenuItem, Select } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

export const createReleasingColumns = (
    handleStatusChange: (checkId: number, value: string) => void,
): GridColDef[] => [
    {
        field: 'checkNumber',
        headerName: 'Check Number',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
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
        field: 'payee',
        headerName: 'Payee',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 80,
    },
    {
        field: 'amount',
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
        sortable: false,
        renderCell: ({ row }) => {
            return (
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                        if (row.type === 'cv')
                            router.visit(details(row.chequeId));
                        else router.visit(detailsCrf(row.chequeId));
                    }}
                >
                    View
                </Button>
            );
        },
    },
    {
        field: 'location',
        headerName: 'Location',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
    },

    {
        field: 'companyName',
        headerName: 'Business Unit',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
    },
    {
        field: 'checkDateStatus',
        headerName: 'Status',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        sortable: false,
        renderCell: ({ row }) => {
            
            return row.checkDateStatus ? (
                <Chip
                    label={row.checkDateStatus}
                    color="primary"
                    variant="outlined"
                />
            ) : row.isReturned && row.approvedAt ? (
                 <Chip
                    label='For Releasing'
                    color="primary"
                    variant="outlined"
                />
            ) : !row.isReturned && row.approvedAt && row.secondaryBorrower  ? (
                 <Chip
                    label='Borrowed'
                    color="primary"
                    variant="outlined"
                />
            ): '';
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
        renderCell: ({ row }) => {
            const { taggedLocation, scannedId, borrowedCheckId, isReturned } = row;

            if (!scannedId || !isReturned) {
                return null;
            }

            return (
                <Select
                    size="small"
                    value=""
                    label="For Signature"
                    onChange={(e) => {
                        if (!e.target.value) return;
                        handleStatusChange(borrowedCheckId, e.target.value);
                    }}
                >
                    <MenuItem value="" disabled>
                        Select action
                    </MenuItem>

                    {!row.checkDateStatus && (
                        <MenuItem value={taggedLocation}>
                            <Chip
                                label={taggedLocation + ' Check'}
                                color="secondary"
                            />
                        </MenuItem>
                    )}

                    <MenuItem value="cancel">
                        <Chip label="Cancel Check" color="error" />
                    </MenuItem>
                </Select>
            );
        },
    },
];

export const createForwardedCvColumns = (
    handleStatusChange: (
        checkStatus: number,
        value: string,
        checkId: number,
    ) => void,
): GridColDef[] => [
    {
        field: 'checkNumber',
        headerName: 'Check Number',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 50,
        renderCell: ({ row }) => row.checkable?.checkNumber,
    },
    {
        field: 'checkDate',
        headerName: 'Check Date',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: ({ row }) => row.checkable?.checkDate,
    },
    {
        field: 'type',
        headerName: 'Type Of Check',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: ({ row }) => row.checkableType,
    },
    {
        field: 'accountName',
        headerName: 'Bank',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: ({ row }) => row.checkable?.bank,
    },
    {
        field: 'checkAmount',
        headerName: 'Amount',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => row.checkable?.amount,
    },
    {
        field: 'location',
        headerName: 'Location',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => row.checkable?.tagLocation?.location,
    },

    {
        field: 'status',
        headerName: 'Status',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => row.status || '—',
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
            const { id, checkable } = params.row;
            return (
                <Select
                    size="small"
                    value={null}
                    onChange={(e) => {
                        if (!e.target.value) return;
                        handleStatusChange(id, e.target.value, checkable);
                    }}
                >
                    <MenuItem value="received">
                        <Chip label="Received" color="primary" />
                    </MenuItem>
                    <MenuItem value="view">
                        <Chip label="View Forwarded Info" color="info" />
                    </MenuItem>
                </Select>
            );
        },
    },
];

export const createForwardedReleasingColumns = (
    handleStatusChange: (id: number, value: string) => void,
): GridColDef[] => [
    {
        field: 'checkNumber',
        headerName: 'Check Number',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 50,
        renderCell: ({ row }) => row.checkable.checkNumber,
    },
    {
        field: 'checkDate',
        headerName: 'Check Date',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: ({ row }) => row.checkable.checkDate,
    },
    {
        field: 'type',
        headerName: 'Type Of Check',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: ({ row }) => row.checkableType,
    },
    {
        field: 'bank',
        headerName: 'Bank',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: ({ row }) => row.checkable.bank,
    },
    {
        field: 'checkAmount',
        headerName: 'Amount',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => row.checkable.amount,
    },
    {
        field: 'location',
        headerName: 'Location',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => row.checkable.tagLocation?.location,
    },

    {
        field: 'status',
        headerName: 'Status',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => row.status || '—',
    },

    {
        field: 'actions',
        headerName: 'Action',
        width: 100,
        align: 'center',
        flex: 1,
        headerAlign: 'center',
        sortable: false,
        renderCell: ({ row }) => {
            const { id } = row;
            return (
                <Select
                    size="small"
                    value={null}
                    onChange={(e) => {
                        if (!e.target.value) return;
                        handleStatusChange(id, e.target.value);
                    }}
                >
                    <MenuItem value="released">
                        <Chip label="Release Check" color="primary" />
                    </MenuItem>
                    <MenuItem value="cancelled">
                        <Chip label="Cancel Check" color="info" />
                    </MenuItem>
                </Select>
            );
        },
    },
];
