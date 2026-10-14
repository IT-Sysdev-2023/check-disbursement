import { GridColDef } from "@mui/x-data-grid";

export const forwardColumns = (
): GridColDef[] => [
    {
        field: 'cvNo',
        headerName: 'Cv No',
        flex: 1,
        renderCell: ({ row }) => row.checkable.cvNo,
    },
    {
        field: 'chequeNumber',
        headerName: 'Cheque Number',
        flex: 1,
        renderCell: ({ row }) => row.checkable.chequeNumber,
    },
    {
        field: 'chequeDate',
        headerName: 'Cheque Date',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        renderCell: ({ row }) => row.checkable.chequeDate,
    },
    {
        field: 'payee',
        headerName: 'Payee',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        renderCell: ({ row }) => row.checkable.payee,
    },
    {
        field: 'amount',
        headerName: 'Cheque Amount',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        renderCell: ({ row }) => row.checkable.amount,
    },
    {
        field: 'location',
        headerName: 'Location',
        headerAlign: 'center',
        align: 'center',
        renderCell: ({ row }) => row.checkable.location,
    }
];