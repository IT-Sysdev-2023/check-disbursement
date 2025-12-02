import { details, detailsCrf } from '@/routes';
import { ReleasingType } from '@/types';
import { router } from '@inertiajs/react';
import { Button, Chip, MenuItem, Select } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

export const createReleasingCvColumns = (
    handleStatusChange: (id: number, value: ReleasingType) => void,
): GridColDef[] => [
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
        field: 'cvNo',
        headerName: 'CV Number',
        minWidth: 150,
        renderCell: (params) => params.row.cvHeader?.cvNo,
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
                    value={checkStatus.status ?? ''}
                    label="For Signature"
                    onChange={(e) =>
                        handleStatusChange(checkStatus.id, e.target.value)
                    }
                >
                    <MenuItem value="release">
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

export const createReleasingCrfColumns = (
    handleStatusChange: (id: number, value: ReleasingType) => void,
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
