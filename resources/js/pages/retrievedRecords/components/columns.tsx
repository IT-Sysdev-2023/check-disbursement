import { ActionType } from '@/types';
import { Chip, MenuItem, Select } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

const renderStatus = (status: 'Releasing' | 'Borrowed' | 'Signature' | 'Assign') => {
    const colors: { [index: string]: 'success' | 'error' | 'info' } = {
        Signature: 'info',
        Releasing: 'success',
        Borrowed: 'error',
        Assign: 'error'
    };

    const label = ['Signature', 'Releasing', 'Assign'].includes(status)
        ? 'For ' + status
        : status;

    return <Chip label={label} color={colors[status]} size="small" />;
};

export const createCvColumns = (
    handleStatusChange: (
        id: number,
        value: ActionType,
        companyName: string,
    ) => void,
): GridColDef[] => [
    {
        field: 'cvNo',
        headerName: 'CV Number',
        minWidth: 150,
        renderCell: (params) => {
            return params.row.cvHeader?.cvNo;
        },
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
        field: 'name',
        headerName: 'Business Unit',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        renderCell: (params) => {
            return params.row.company?.name;
        },
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

export const createCrfColumns = (
    handleStatusChange: (
        id: number,
        value: ActionType,
        company: string,
    ) => void,
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
        minWidth: 120,
        sortable: false,
        renderCell: (params) => {
            const { row } = params;
            // console.log(row);
            return renderStatus(row?.borrowedCheck ? 'Borrowed' : 'Signature');
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
                    {params.row.borrowedCheck == null && (
                        <MenuItem value="borrow">Borrow Check</MenuItem>
                    )}
                    <MenuItem value="scan">Scan</MenuItem>
                </Select>
            );
        },
    },
];

export const createNoCheckNumberColumns = (
    handleStatusChange: (
        id: number,
        value: ActionType,
        companyName: string,
    ) => void,
): GridColDef[] => [
    {
        field: 'cvNo',
        headerName: 'CV Number',
        minWidth: 150,
        renderCell: (params) => {
            return params.row.cvHeader?.cvNo;
        },
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
        field: 'name',
        headerName: 'Business Unit',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        renderCell: (params) => {
            return params.row.company?.name;
        },
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
        renderCell: () => {
            return renderStatus('Assign');
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
                    <MenuItem value="scan">Assign</MenuItem>
                    <MenuItem value="details">Check Details</MenuItem>
                </Select>
            );
        },
    },
];
