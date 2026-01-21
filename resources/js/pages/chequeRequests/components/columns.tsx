import { GridColDef } from '@mui/x-data-grid';

export const createRequestsChequeColumns = (): GridColDef[] => [
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
        renderCell: ({ row }) => row.checkable?.payee,
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
        field: 'location',
        headerName: 'Location',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => row.checkable.tagLocation?.location,
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
];
