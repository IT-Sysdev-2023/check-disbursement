import { Chip } from "@mui/material";
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

    export const forwardedChequeStatusColumns = (
    ): GridColDef[] => [
        {
            field: 'chequeNumber',
            headerName: 'Cheque Number',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            renderCell: ({ row }) => row.checkable?.chequeNumber,
        },
        {
            field: 'chequeAmount',
            headerName: 'Cheque Amount',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 80,
            renderCell: ({ row }) => row.checkable?.amount,
        },
    
        {
            field: 'bankName',
            headerName: 'Bank Name',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 100,
            renderCell: ({ row }) => row.checkable?.bank,
        },
        {
            field: 'chequeDate',
            headerName: 'Cheque Date',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 100,
            renderCell: ({ row }) => row.checkable?.chequeDate,
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
            headerAlign: 'right',
            align: 'right',
            minWidth: 120,
            flex: 1,
            renderCell: () => {
                return (
                    <Chip
                        label={'Released'}
                        color={'success'}
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
                console.log(row);
                return row.checkable?.location;
            },
        },
       
    ];