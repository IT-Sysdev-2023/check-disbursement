import { ClosingCheckDetailsType } from '@/types';
import { Chip, IconButton } from '@mui/material';
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
        field: 'toc',
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
            return row.checkable.tagLocation?.location;
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

export const createClosingCrfColumns = (
    handleStatusChange: (data: ClosingCheckDetailsType) => void,
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
        flex: 1,
        minWidth: 120,
        renderCell: (params) => {
            const statusMap: Record<
                string,
                {
                    label: string;
                    color: 'primary' | 'success' | 'warning' | 'error';
                }
            > = {
                release: { label: 'Released', color: 'primary' },
                forward: { label: 'Forwarded', color: 'warning' },
                deposit: { label: 'Deposit', color: 'success' },
                cancel: { label: 'Cancelled', color: 'error' },
            };

            return (
                <Chip
                    label={
                        statusMap[params.row.checkStatus.status]?.label ||
                        'For Releasing'
                    }
                    color={
                        statusMap[params.row.checkStatus.status]?.color ||
                        'default'
                    }
                />
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
            return (
                <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleStatusChange(params.row.id)}
                >
                    <ArrowBigRightDash />
                </IconButton>
            );
        },
    },
];
