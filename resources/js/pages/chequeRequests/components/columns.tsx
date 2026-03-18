import { GridColDef } from '@mui/x-data-grid';

export const createRequestsChequeColumns = (): GridColDef[] => [
    {
        field: 'checkNumber',
        headerName: 'Check Number',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 50,
        renderCell: ({ row }) => row.checkable?.checkNumber,
    },
    {
        field: 'checkDate',
        headerName: 'Check Date',
        headerAlign: 'left',
        align: 'left',
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
        headerAlign: 'left',
        align: 'left',
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
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => row.checkable?.tagLocation?.location,
    },
     {
        field: 'check',
        headerName: 'Check Type',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => row.checkable?.check,
    },

    {
        field: 'businessUnit',
        headerName: 'Business Unit',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => {
            return row.checkable?.company || '—';
        },
    },
];
