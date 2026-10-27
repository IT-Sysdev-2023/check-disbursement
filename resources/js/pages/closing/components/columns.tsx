import { ClosingCheckDetailsType } from '@/types';
import { IconButton } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { ArrowBigRightDash } from 'lucide-react';

export const createClosingCvColumns = (
): GridColDef[] => [
    {
        field: 'chequeNumber',
        headerName: 'Cheque Number',
        flex: 1,
        renderCell: ({ row }) => {
            return row.checkable?.chequeNumber;
        },
    },
    {
        field: 'cvNumber',
        headerName: 'Cv Number',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => {
            return row.checkable?.cvNo;
        },
    },
    {
        field: 'checkableType',
        headerName: 'Type of Check',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
    },
    {
        field: 'location',
        headerName: 'Location',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: ({ row }) => {
            return row.checkable?.tagLocation?.location;
        },
    },
    {
        field: 'amount',
        headerName: 'Amount',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
            return params.row.checkable?.amount;
        },
    },
    {
        field: 'status',
        headerName: 'Status',
        minWidth: 120,
        flex: 1,
        headerAlign: 'center',
        align: 'center',
    },
];
export const scannedDocumentsColumn = (
    handleAction: (id: number, chequeNumber: string) => void,
): GridColDef[] => [
    {
        field: 'chequeNumber',
        headerName: 'Cheque Number',
        flex: 1,
        renderCell: ({ row }) => {
            return row.checkable?.chequeNumber;
        },
    },
    {
        field: 'cvNumber',
        headerName: 'Cv Number',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => {
            return row.checkable?.cvNo;
        },
    },
    {
        field: 'checkableType',
        headerName: 'Type of Check',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
    },
    {
        field: 'location',
        headerName: 'Location',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: ({ row }) => {
            return row.checkable?.tagLocation?.location;
        },
    },
    {
        field: 'amount',
        headerName: 'Amount',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
            return params.row.checkable?.amount;
        },
    },
    {
        field: 'status',
        headerName: 'Status',
        minWidth: 120,
        headerAlign: 'center',
        align: 'center',
        flex: 1,
    },
    // {
    //     field: 'actions',
    //     headerName: 'View',
    //     width: 100,
    //     align: 'center',
    //     flex: 1,
    //     headerAlign: 'center',
    //     sortable: false,
    //     renderCell: (params) => {
    //         const { row } = params;

    //         return (
    //             <IconButton
    //                 size="small"
    //                 color="primary"
    //                 onClick={() =>
    //                     handleAction(row.id, row.checkable?.chequeNumber)
    //                 }
    //             >
    //                 <ArrowBigRightDash />
    //             </IconButton>
    //         );
    //     },
    // },
];
