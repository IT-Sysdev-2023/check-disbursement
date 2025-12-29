import { details, detailsCrf } from '@/routes';
import { ReleasingType } from '@/types';
import { router } from '@inertiajs/react';
import { Button, Chip, MenuItem, Select } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

export const createReleasingCvColumns = (
    handleStatusChange: (
        checkId: number,
        value: string,
        check:string
    ) => void,
): GridColDef[] => [
    {
        field: 'checkNumber',
        headerName: 'Check Number',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 50,
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
        field: 'cvNo',
        headerName: 'CV Number',
        minWidth: 150,
        renderCell: (params) => params.row.cvHeader?.cvNo,
    },
    {
        field: 'payee',
        headerName: 'Payee',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
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
        field: 'details',
        headerName: 'Check Details',
        minWidth: 120,
        renderCell: (params) => {
            return (
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                        router.visit(details(params.row.id));
                    }}
                >
                    View
                </Button>
            );
        },
    },
    {
        field: 'location',
        headerName: 'Location',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: (params) => {
            return params.row.taggedLocation?.location;
        },
    },

    {
        field: 'businessUnit',
        headerName: 'Business Unit',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: (params) => {
            return params.row.company.name || '—';
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
            const { id, taggedLocation } = params.row;
            return (
                <Select
                    size="small"
                    value={null}
                    label="For Signature"
                    onChange={(e) => {
                        if (!e.target.value) return;
                        handleStatusChange(
                            id,
                            e.target.value,
                            'cv'
                        );
                    }}
                >
                    
                        <MenuItem value={taggedLocation}>
                            <Chip label={ taggedLocation +" Check"} color="secondary" />
                        </MenuItem>

                    <MenuItem value="cancel">
                        <Chip label="Cancel Check" color="error" />
                    </MenuItem>
                </Select>
            );
        },
    },
];

export const createReleasingCrfColumns = (
    handleStatusChange: (id: number, value: string, check: string) => void,
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
        minWidth: 100,
    },
    {
        field: 'ckNo',
        headerName: 'CK No.',
        headerAlign: 'right',
        align: 'right',
        minWidth: 100,
    },
    {
        field: 'details',
        headerName: 'Check Details',
        minWidth: 120,
        renderCell: (params) => {
            return (
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                        router.visit(detailsCrf(params.row.id));
                    }}
                >
                    View
                </Button>
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

            const { id, taggedLocation } = params.row;

            return (
                <Select
                    size="small"
                    value={null}
                    label="For Signature"
                    onChange={(e) => {
                        if (!e.target.value) return;
                        handleStatusChange(
                            id,
                            e.target.value,
                            'crf'
                        );
                        return null;
                    }}
                >
                    
                        <MenuItem value={taggedLocation}>
                            <Chip label={ taggedLocation +" Check"} color="secondary" />
                        </MenuItem>

                    <MenuItem value="cancel">
                        <Chip label="Cancel Check" color="error" />
                    </MenuItem>
                </Select>
            );
        },
    },
];
