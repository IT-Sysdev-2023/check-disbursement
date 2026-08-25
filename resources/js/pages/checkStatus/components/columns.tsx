import { CheckScannedDetails } from '@/types';
import { Box, Chip, MenuItem, Select } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

export const createStatusChequeColumns = (
    handleStatusChange: (value: string, record: CheckScannedDetails) => void,
): GridColDef[] => [
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
        field: 'check',
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
            const { chequeStatus } = row.checkable;

            let status = null;

            if (row.checkable?.status) {
                status = row.checkable.status;
            }

            if (chequeStatus?.status) {
                status = chequeStatus.status;
            }
            if (chequeStatus?.forwardedStatus?.status) {
                status = chequeStatus.forwardedStatus.status;
            }

            if (chequeStatus?.isClosed) {
                status = 'closed';
            }

            if (!row.approverId) {
                status = 'forSignature';
            }
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
                forSignature: { label: 'For Signature', color: 'success' },
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
    {
        field: 'actions',
        headerName: 'Action',
        width: 100,
        align: 'center',
        flex: 1,
        headerAlign: 'center',
        sortable: false,
        renderCell: ({ row }) => {
            const record = {
                borrowedId: row.id,
                id: row.checkable.id,
                type: row.check,
                amount: row.checkable.unformattedAmount,
                checkNumber: row.checkable.chequeNumber,
            };
            return (
                <Box sx={{ width: '100%' }}>
                    <Select
                        size="small"
                        value={status ?? ''}
                        onChange={(e) =>
                            handleStatusChange(e.target.value, record)
                        }
                    >
                        <MenuItem value="details">
                            Check Request Form Details
                        </MenuItem>
                        {row.checkable?.chequeStatus?.status !== 'cancel' && (
                            <MenuItem value="scannedDetails">
                                Scanned Check Details
                            </MenuItem>
                        )}
                        {row.checkable?.status && (
                            <MenuItem value="cancel">Cancelled Check</MenuItem>
                        )}
                    </Select>
                </Box>
            );
        },
    },
];
