import { details, detailsCrf } from '@/routes';
import { router } from '@inertiajs/react';
import { Button, Chip, MenuItem, Select } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

export const createReleasingCvColumns = (
    handleStatusChange: (checkId: number, value: string) => void,
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
        field: 'cvNo',
        headerName: 'CV Number',
        minWidth: 150,
        renderCell: ({ row }) => row.checkable?.cvNo,
    },
    {
        field: 'payee',
        headerName: 'Payee',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => row.checkable?.cvNo,
    },
    {
        field: 'checkAmount',
        headerName: 'Check Amount',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => row.checkable?.amount,
    },
    {
        field: 'details',
        headerName: 'Check Details',
        minWidth: 120,
        renderCell: ({ row }) => {
            return (
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                        router.visit(details(row.checkable?.id));
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
        renderCell: ({ row }) => {
            return row.checkable.tagLocation?.location;
        },
    },

    {
        field: 'businessUnit',
        headerName: 'Business Unit',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => {
            return row.checkable?.company || '—';
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
            const { taggedLocation } = row.checkable;
            return (
                <Select
                    size="small"
                    value=""
                    label="For Signature"
                    onChange={(e) => {
                        if (!e.target.value) return;
                        handleStatusChange(row.id, e.target.value);
                    }}
                >
                    <MenuItem value="" disabled>
                        Select action
                    </MenuItem>

                    <MenuItem value={taggedLocation}>
                        <Chip
                            label={taggedLocation + ' Check'}
                            color="secondary"
                        />
                    </MenuItem>

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
        renderCell: (params) => {
            return params.row.checkable.checkNumber;
        },
    },
    {
        field: 'checkDate',
        headerName: 'Check Date',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
            return params.row.checkable.checkDate;
        },
    },
    {
        field: 'type',
        headerName: 'Type Of Check',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
            return params.row.checkableType;
        },
    },
    {
        field: 'accountName',
        headerName: 'Account Name',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
    },
    {
        field: 'checkAmount',
        headerName: 'Amount',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: (params) => {
            return params.row.checkable.checkAmount;
        },
    },
    {
        field: 'location',
        headerName: 'Location',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: (params) => {
            console.log(params.row);
            return params.row.checkable.tagLocation?.location;
        },
    },

    {
        field: 'status',
        headerName: 'Status',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: (params) => {
            return params.row.status || '—';
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

export const createForwardedReleasingCvColumns = (
    handleStatusChange: (id: number, value: string) => void,
): GridColDef[] => [
    {
        field: 'checkNumber',
        headerName: 'Check Number',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 50,
        renderCell: (params) => {
            return params.row.checkable.checkNumber;
        },
    },
    {
        field: 'checkDate',
        headerName: 'Check Date',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
            return params.row.checkable.checkDate;
        },
    },
    {
        field: 'type',
        headerName: 'Type Of Check',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
            return params.row.checkableType;
        },
    },
    {
        field: 'accountName',
        headerName: 'Account Name',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
    },
    {
        field: 'checkAmount',
        headerName: 'Amount',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: (params) => {
            return params.row.checkable.checkAmount;
        },
    },
    {
        field: 'location',
        headerName: 'Location',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: (params) => {
            console.log(params.row);
            return params.row.checkable.tagLocation?.location;
        },
    },

    {
        field: 'status',
        headerName: 'Status',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: (params) => {
            return params.row.status || '—';
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
            const { id } = params.row;
            return (
                <Select
                    size="small"
                    value={null}
                    onChange={(e) => {
                        if (!e.target.value) return;
                        handleStatusChange(id, e.target.value);
                    }}
                >
                    <MenuItem value="release">
                        <Chip label="Release Check" color="primary" />
                    </MenuItem>
                    <MenuItem value="cancel">
                        <Chip label="Cancel Check" color="info" />
                    </MenuItem>
                </Select>
            );
        },
    },
];

export const createForwardedCrfColumns = (
    handleStatusChange: (id: number, value: string, checkId: number) => void,
): GridColDef[] => [
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
    // {
    //     field: 'details',
    //     headerName: 'Check Details',
    //     minWidth: 120,
    //     renderCell: (params) => {
    //         return (
    //             <Button
    //                 variant="contained"
    //                 size="small"
    //                 onClick={() => {
    //                     router.visit(detailsCrf(params.row.id));
    //                 }}
    //             >
    //                 View
    //             </Button>
    //         );
    //     },
    // },
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
                        handleStatusChange(id, e.target.value, checkable.id);
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

