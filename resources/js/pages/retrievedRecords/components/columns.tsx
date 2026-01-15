import { ActionType, ChequeType } from '@/types';
import { Chip, MenuItem, Select } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

const renderStatus = (
    status:
        | 'Releasing'
        | 'Borrowed'
        | 'Signature'
        | 'Assign'
        | 'Tagged'
        | 'Tagging',
) => {
    const colors: {
        [index: string]: 'success' | 'error' | 'info' | 'warning';
    } = {
        Signature: 'success',
        Releasing: 'success',
        Borrowed: 'error',
        Assign: 'error',
        Tagged: 'success',
        Tagging: 'info',
    };

    const label = ['Signature', 'Releasing', 'Assign', 'Tagging'].includes(
        status,
    )
        ? 'For ' + status
        : status;

    return <Chip label={label} color={colors[status]} size="small" />;
};

export const createChequeColumns = (
    handleStatusChange: (
        id: number,
        value: ActionType,
        type: ChequeType,
    ) => void,
): GridColDef[] => [
    {
        field: 'checkNumber',
        headerName: 'Check Number',
        minWidth: 150,
    },
    {
        field: 'checkDate',
        headerName: 'Check Date',
        headerAlign: 'right',
        align: 'right',
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
        field: 'payee',
        headerName: 'Payee',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
    },
    {
        field: 'companyName',
        headerName: 'Business Unit',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
    },

    {
        field: 'status',
        headerName: 'Status',
        minWidth: 120,
        renderCell: ({ row }) => {
            if (!row.checkNumber) {
                return renderStatus('Assign');
            }
            if (row.taggedAt) {
                return renderStatus('Signature');
            }

            return renderStatus(row?.borrowedCheck ? 'Borrowed' : 'Tagging');
        },
    },
    {
        field: 'actions',
        headerName: 'Action',
        width: 130,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: ({ row }) => {
            const { status, id } = row;

            return (
                <Select
                    size="small"
                    value={status ?? ''}
                    onChange={(e) =>
                        handleStatusChange(id, e.target.value, row)
                    }
                >
                    <MenuItem value="details">Check Details</MenuItem>
                    {!row.checkNumber && (
                        <MenuItem value="assignCn">Assign Check Number</MenuItem>
                    )}
                     {!row.checkDate && (
                        <MenuItem value="assignCd">Assign Check Date</MenuItem>
                    )}
                    {!row.taggedAt && (
                        <MenuItem value="tag">Tag Location</MenuItem>
                    )}
                </Select>
            );
        },
    },
];

export const createManageCvColumns = (): GridColDef[] => [
    {
        field: 'cvNo',
        headerName: 'CV Number',
        minWidth: 150,
        renderCell: ({ row }) => row.checkable.cvHeader?.cvNo,
    },
    {
        field: 'cvDate',
        headerName: 'Cv Date',
        headerAlign: 'right',
        align: 'right',
        minWidth: 80,
        renderCell: ({ row }) => row.checkable.cvHeader?.cvDate,
    },
    {
        field: 'payee',
        headerName: 'Payee',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        renderCell: ({ row }) => row.checkable.payee,
    },
    {
        field: 'name',
        headerName: 'Business Unit',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        renderCell: ({ row }) => row.checkable.company,
    },
    {
        field: 'status',
        headerName: 'Approve Status',
        renderCell: () => {
            return <Chip label="Approved" color="success" size="small" />;
        },
    },

    {
        field: 'approvedBy',
        headerName: 'Approved By',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        renderCell: ({ row }) => row.approver?.name,
    },
    {
        field: 'syncStatus',
        headerName: 'Sync Status',
        width: 130,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: (params) => {
            return params.row.scannedId ? (
                <Chip label="Scanned" color="success" size="small" />
            ) : (
                <Chip label="Not Scanned" color="error" size="small" />
            );
        },
    },
];
