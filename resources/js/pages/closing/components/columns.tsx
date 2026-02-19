import { ClosingCheckDetailsType } from '@/types';
import { IconButton } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { ArrowBigRightDash } from 'lucide-react';

export const createClosingCvColumns = (
    handleStatusChange: (data: ClosingCheckDetailsType) => void,
): GridColDef[] => [
    {
        field: 'checkNumber',
        headerName: 'Check Number',
        headerAlign: 'right',
        align: 'right',
        flex: 0.5,
        minWidth: 50,
        renderCell: ({ row }) => {
            return row.checkable?.checkNumber;
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
    // {
    //     field: 'bankName',
    //     headerName: 'Account Name',
    //     headerAlign: 'right',
    //     align: 'right',
    //     flex: 1,
    //     minWidth: 100,
    // },
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
            const { row } = params;

            const data = {
                id: row.id,
                cvNo: row.checkable?.cvNo,
                releasedAt: row.createdAt,
                bank: row.checkable?.bank,
                checkNo: row.checkable?.checkNumber,
                payee: row.checkable?.payee,
                amount: row.checkable?.amount,
                receivedBy: row.receiversName,
            };

            return (
                <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleStatusChange(data)}
                >
                    <ArrowBigRightDash />
                </IconButton>
            );
        },
    },
];
