import { Chip, IconButton } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { ArrowBigRightDash } from 'lucide-react';

export const createStatusCvColumns = (
    handleStatusChange: (id: number) => void,
): GridColDef[] => [
    {
        field: 'checkNumber',
        headerName: 'Check Number',
        headerAlign: 'right',
        align: 'right',
        flex: 0.5,
        minWidth: 50,
    },
    {
        field: 'checkAmount',
        headerName: 'Check Amount',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
    },
    {
        field: 'bankAccountNo',
        headerName: 'Bank Account No.',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
    },
    {
        field: 'bankName',
        headerName: 'Bank Name',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
    },
    {
        field: 'checkDate',
        headerName: 'Check Date',
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
        width: 100,
        align: 'center',
        flex: 1,
        headerAlign: 'center',
        sortable: false,
        renderCell: (params) => {
            return (
                <IconButton
                    size="small"
                    color="primary"
                    onClick={() =>
                        handleStatusChange(params.row.id)
                    }
                >
                    <ArrowBigRightDash />
                </IconButton>
            );
        },
    },
];

export const createStatusCrfColumns = (
    handleStatusChange: (id: number) => void,
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
                    onClick={() =>
                        handleStatusChange(params.row.id)
                    }
                >
                    <ArrowBigRightDash />
                </IconButton>
                // <Select
                //     size="small"
                //     value={''}
                //     label="For Signature"
                //     onChange={(e) =>
                //         handleStatusChange(params.row.id, e.target.value)
                //     }
                // >
                //     <MenuItem value="details">
                //         {' '}
                //         Check Request Form Details
                //     </MenuItem>
                //     {/* <MenuItem value="scannedCheck">
                //         Scanned Check Details
                //     </MenuItem> */}
                // </Select>
            );
        },
    },
];
