import { GridColDef } from '@mui/x-data-grid';

export const createBorrowingChequeColumns = (): GridColDef[] => [
    {
        field: 'checkNumber',
        headerName: 'Check Number',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
    },
    {
        field: 'checkDate',
        headerName: 'Check Date',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
    },
    {
        field: 'payee',
        headerName: 'Payee',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
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
        field: 'location',
        headerName: 'Location',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
    },
    {
        field: 'type',
        headerName: 'Check Type',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 80,
    },

    {
        field: 'companyName',
        headerName: 'Business Unit',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
    },
];
