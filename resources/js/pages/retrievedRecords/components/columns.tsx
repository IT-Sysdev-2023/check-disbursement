import { ActionType, ChequeType } from '@/types';
import { Box, Chip, IconButton, MenuItem, Select, Stack } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { Edit2, Notebook, NotepadText } from 'lucide-react';
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
        field: 'checkNumber',
        headerName: 'Check Number',
        // minWidth: 150,
    },
    {
        field: 'checkDate',
        headerName: 'Check Date',
        headerAlign: 'right',
        align: 'right',
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
        field: 'payee',
        headerName: 'Payee',
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
        field: 'status',
        headerName: 'Status',
        minWidth: 200,
        renderCell: ({ row }) => {
            if (!row.checkNumber) {
                return (
                    <Chip
                        label="Assign Check Number"
                        color="error"
                        size="small"
                    />
                );
            }
            if (!row.checkDate) {
                return (
                    <Chip
                        label="Assign Check Date"
                        color="error"
                        size="small"
                    />
                );
            }

            if (row.taggedAt) {
                return (
                    <Chip label="For Signature" color="success" size="small" />
                );
            }

            return renderStatus(row?.borrowedCheck ? 'Borrowed' : 'Tagging');
        },
    },
    {
        field: 'actions',
        headerName: 'Action',
        width: 130,
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

                            if (!row.checkNumber) {
                                items.push(
                                    <MenuItem key="assignCn" value="assignCn">
                                        Assign Check Number
                                    </MenuItem>,
                                );
                            }

                            if (!row.checkDate) {
                                items.push(
                                    <MenuItem key="assignCd" value="assignCd">
                                        Assign Check Date
                                    </MenuItem>,
                                );
                            }

                            if (
                                row.checkDate &&
                                row.checkNumber &&
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

export const createPendingChequeColumns = (): GridColDef[] => [
    {
        field: 'checkNumber',
        headerName: 'Check Number',
        minWidth: 150,
        renderCell: ({ row }) => row.checkable.checkNumber,
    },
    {
        field: 'checkDate',
        headerName: 'Check Date',
        headerAlign: 'right',
        align: 'right',
        renderCell: ({ row }) => row.checkable.checkDate,
    },
    {
        field: 'amount',
        headerName: 'Check Amount',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => row.checkable.amount,
    },
    {
        field: 'payee',
        headerName: 'Payee',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        renderCell: ({ row }) => row.checkable.payee,
    },
    {
        field: 'companyName',
        headerName: 'Business Unit',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        renderCell: ({ row }) => row.checkable.company,
    },

    {
        field: 'status',
        headerName: 'Status',
        minWidth: 120,
        renderCell: () => {
            return <Chip label="Pending" color="secondary" size="small" />;
        },
    },
];

export const createManageColumns = (
    handleDetails: (id: number, type: 'cv' | 'crf') => void,
    handleAction: (id: number) => void,
    handleScanDetails: (id: number) => void,
): GridColDef[] => [
    {
        field: 'checkNumber',
        headerName: 'Check Number',
        minWidth: 150,
    },
    {
        field: 'checkDate',
        headerName: 'Check Date',
        headerAlign: 'right',
        align: 'right',
        minWidth: 80,
    },
    {
        field: 'payee',
        headerName: 'Payee',
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
        headerAlign: 'right',
        align: 'right',
        flex: 1,
    },
    {
        field: 'syncStatus',
        headerName: 'Sync Status',
        width: 130,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: ({ row }) => {
            return row.scannedId ? (
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
            return (
                <Stack direction="row" sx={{ gap: 1 }}>
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleDetails(row.chequeId, row.type)}
                    >
                        <NotepadText />
                    </IconButton>

                    {row.scannedId && (
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleScanDetails(row.scannedId)}
                        >
                            <Notebook />
                        </IconButton>
                    )}

                    {!row.scannedId && (
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                                handleAction(
                                    row.borrowedCheckId
                                )
                            }
                        >
                            <Edit2 />
                        </IconButton>
                    )}
                </Stack>
            );
        },
    },
];
