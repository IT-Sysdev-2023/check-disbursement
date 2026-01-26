import { CheckScannedDetails } from '@/types';
import { Box, Chip, MenuItem, Select } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

export const createStatusChequeColumns = (
    handleStatusChange: (value: string, record: CheckScannedDetails) => void,
): GridColDef[] => [
    {
        field: 'checkNumber',
        headerName: 'Check Number',
        headerAlign: 'right',
        align: 'right',
        flex: 0.5,
        minWidth: 50,
        renderCell: ({ row }) => row.checkable.checkNumber,
    },
    {
        field: 'checkAmount',
        headerName: 'Check Amount',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => row.checkable.amount,
    },
    {
        field: 'stat',
        headerName: 'Handling Status',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => row.checkable.taggedLocation,
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
        field: 'checkDate',
        headerName: 'Check Date',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: ({ row }) => row.checkable.checkDate,
    },
    {
        field: 'status',
        headerName: 'Status',
        minWidth: 120,
        flex: 1,
        renderCell: ({ row }) => {
            const { checkStatus } = row.checkable;
            console.log(checkStatus);
            let status = checkStatus?.status;

            if (checkStatus?.forwardedStatus?.status) {
                status = checkStatus.forwardedStatus.status;
            }

            if (checkStatus?.isClosed) {
                status = 'close';
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
                close: { label: 'Closed', color: 'primary' },
                release: { label: 'Released', color: 'default' },
                forward: { label: 'Forwarded', color: 'warning' },
                deposit: { label: 'Deposit', color: 'success' },
                cancel: { label: 'Cancelled', color: 'error' },
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
        field: 'actions',
        headerName: 'Action',
        width: 100,
        align: 'center',
        flex: 1,
        headerAlign: 'center',
        sortable: false,
        renderCell: ({ row }) => {
            const record = {
                id: row.checkable.id,
                type: row.check,
                amount: row.checkable.unformattedAmount,
                checkNumber: row.checkable.checkNumber,
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
                        {row.checkable?.checkStatus?.status !== 'cancel' && (
                            <MenuItem value="scannedDetails">
                                Scanned Check Details
                            </MenuItem>
                        )}
                    </Select>
                </Box>
            );
        },
    },
];
