import { ActionType, ChequeType } from '@/types';
import {
    Box,
    Chip,
    IconButton,
    MenuItem,
    Select,
    Stack,
    Tooltip,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { Edit2, Eye, Notebook, NotepadText } from 'lucide-react';
import { JSX } from 'react';

const renderStatus = (
    status: 'Releasing' | 'Borrowed' | 'Assign' | 'Tagged' | 'Tagging',
) => {
    const colors: {
        [index: string]: 'success' | 'error' | 'info' | 'warning';
    } = {
        Releasing: 'success',
        Borrowed: 'error',
        Assign: 'error',
        Tagged: 'success',
        Tagging: 'info',
    };

    const label = ['Releasing', 'Assign', 'Tagging'].includes(status)
        ? 'For ' + status
        : status;

    return <Chip label={label} color={colors[status]} size="small" />;
};

export const createChequeColumns = (
    handleStatusChange: (value: ActionType, type: ChequeType) => void,
): GridColDef[] => [
    {
        field: 'chequeNumber',
        headerName: 'Cheque Number',
        flex: 1,
    },
    {
        field: 'chequeDate',
        headerName: 'Cheque Date',
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
        headerName: 'Cheque Amount',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
    },

    {
        field: 'companyName',
        headerName: 'Business Unit',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
    },

    {
        field: 'statusOrder',
        headerName: 'Status',
        flex: 1,
        renderCell: ({ row }) => {
            //ASSIGNMENT STATUS
            if (!row.chequeNumber || !row.chequeDate) {
                return (
                    <Chip label={row.statusOrder} color="error" size="small" />
                );
            }

            if (row.taggedAt) {
                return (
                    <Chip
                        label={row.statusOrder}
                        color="success"
                        size="small"
                    />
                );
            }

            //COMPLETED STATUS
            return renderStatus(row?.borrowedCheque ? 'Borrowed' : 'Tagging');
        },
    },
    {
        field: 'actions',
        headerName: 'Action',
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: ({ row }) => {
            const { status } = row;

            return (
                <Box sx={{ width: '100%' }}>
                    <Select
                        size="small"
                        value={status ?? ''}
                        onChange={(e) =>
                            handleStatusChange(e.target.value, row)
                        }
                    >
                        <MenuItem value="details">Check Details</MenuItem>
                        {(() => {
                            const items: JSX.Element[] = [];

                            if (!row.chequeNumber) {
                                items.push(
                                    <MenuItem key="assignCn" value="assignCn">
                                        Assign Cheque Number
                                    </MenuItem>,
                                );
                            }

                            if (!row.chequeDate) {
                                items.push(
                                    <MenuItem key="assignCd" value="assignCd">
                                        Assign Cheque Date
                                    </MenuItem>,
                                );
                            }

                            if (
                                row.chequeDate &&
                                row.chequeNumber &&
                                !row.taggedAt
                            ) {
                                items.push(
                                    <MenuItem key="tag" value="tag">
                                        Tag Location
                                    </MenuItem>,
                                );
                            }

                            return items;
                        })()}
                    </Select>
                </Box>
            );
        },
    },
];

export const createPendingChequeColumns = (
    onView: (id: number) => void,
): GridColDef[] => [
    {
        field: 'chequeNumber',
        headerName: 'Cheque Number',
        minWidth: 150,
        renderCell: ({ row }) => row.checkable?.chequeNumber,
    },
    {
        field: 'chequeDate',
        headerName: 'Cheque Date',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        renderCell: ({ row }) => row.checkable?.chequeDate,
    },
    {
        field: 'payee',
        headerName: 'Payee',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        renderCell: ({ row }) => row.checkable?.payee,
    },
    {
        field: 'amount',
        headerName: 'Check Amount',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => row.checkable?.amount,
    },

    {
        field: 'companyName',
        headerName: 'Business Unit',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        renderCell: ({ row }) => row.checkable?.company,
    },

    {
        field: 'status',
        headerName: 'Status',
        minWidth: 120,
        renderCell: () => {
            return <Chip label="Pending" color="secondary" size="small" />;
        },
    },

    {
        field: 'actions',
        headerName: 'View',
        sortable: false,
        filterable: false,
        minWidth: 90,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ row }) => {
            return (
                <Tooltip title="View details">
                    <IconButton size="small" onClick={() => onView(row.id)}>
                        <Eye fontSize="small" />
                    </IconButton>
                </Tooltip>
            );
        },
    },
];

export const createManageColumns = (
    handleDetails: (id: number, type: 'cv' | 'crf') => void,
    handleAction: (details: any) => void,
    handleScanDetails: (id: number) => void,
): GridColDef[] => [
    {
        field: 'chequeNumber',
        headerName: 'Cheque Number',
        minWidth: 150,
    },
    {
        field: 'chequeDate',
        headerName: 'Cheque Date',
        headerAlign: 'left',
        align: 'left',
        minWidth: 80,
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
        field: 'companyName',
        headerName: 'Business Unit',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
    },
    // {
    //     field: 'status',
    //     headerName: 'Approve Status',
    //     renderCell: () => {
    //         return <Chip label="Approved" color="success" size="small" />;
    //     },
    // },

    {
        field: 'approversName',
        headerName: 'Approved By',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
    },
    {
        field: 'scannedId',
        headerName: 'Sync Status',
        width: 130,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ row }) => {
            return row.isScanned ? (
                <Chip label="Scanned" color="success" size="small" />
            ) : (
                <Chip label="Not Scanned" color="error" size="small" />
            );
        },
    },
    {
        field: 'type',
        headerName: 'Check Type',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
    },
    {
        field: 'location',
        headerName: 'Location',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
    },
    {
        field: 'actions',
        headerName: 'Action',
        width: 130,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: ({ row }) => {

            const details = {
                'id': row.borrowedCheckId,
                'amount': row.amountUnformatted,
                'isScanned': row.isScanned,
                'payee': row.payee,
                'chequeDate': row.chequeDateUnformatted,
                'chequeNumber': row.chequeNumber,
            }
            const isSync = localStorage.getItem('syncScanned') === 'true';
            return (
                <Stack direction="row" sx={{ gap: 1 }}>
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleDetails(row.chequeId, row.type)}
                    >
                        <NotepadText />
                    </IconButton>

                   

                    {( !row.isScanned) && (
                        <IconButton
                            size="small"
                            color="primary"
                            disabled={!isSync}
                            onClick={() => handleAction(details)}
                        >
                            <Edit2 />
                        </IconButton>
                    )}

                     {(row.scannedId || (row.isScanned == 1)) && (
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleScanDetails(row.scannedId)}
                        >
                            <Notebook />
                        </IconButton>
                    )}
                </Stack>
            );
        },
    },
];
