
import { Chip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

export const eodColumns = (): GridColDef[] => [
    {
        field: 'chequeNumber',
        headerName: 'Cheque Number',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        renderCell: ({ row }) => row.checkable.chequeNumber,
    },
    {
        field: 'chequeAmount',
        headerName: 'Cheque Amount',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => row.checkable.amount,
    },

    {
        field: 'bankName',
        headerName: 'Bank Name',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: ({ row }) => row.checkable.bank,
    },
    {
        field: 'chequeDate',
        headerName: 'Cheque Date',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: ({ row }) => row.checkable.chequeDate,
    },
    {
        field: 'checkableType',
        headerName: 'Cheque Type',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
    },
    {
        field: 'status',
        headerName: 'Status',
        minWidth: 120,
        flex: 1,
        renderCell: ({ row }) => {
            const { status } = row;
            
            const statusMap: Record<
                string,
                {
                    label: string;
                    color:
                        | 'default'
                        | 'primary'
                        | 'success'
                        | 'warning'
                        | 'error';
                }
            > = {
                closed: { label: 'Closed', color: 'primary' },
                released: { label: 'Released', color: 'default' },
                forwarded: { label: 'Forwarded', color: 'warning' },
                deposited: { label: 'Deposit', color: 'success' },
                cancelled: { label: 'Cancelled', color: 'error' },
                staled: { label: 'Staled', color: 'warning' },
            };

            return (
                <Chip
                    label={statusMap[status]?.label || 'For Releasing'}
                    color={statusMap[status]?.color || 'default'}
                />
            );
        },
    },
    {
        field: 'stat',
        headerName: 'Handling Status',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => {
            return row.checkable.location;
        },
    },
];
