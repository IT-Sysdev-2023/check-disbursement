import { details } from '@/routes';
import { router } from '@inertiajs/react';
import { Button, Stack } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { GridCellParams, GridColDef } from '@mui/x-data-grid';

function renderStatus(status: 'Online' | 'Offline') {
    const colors: { [index: string]: 'success' | 'default' } = {
        Online: 'success',
        Offline: 'default',
    };

    return <Chip label={status} color={colors[status]} size="small" />;
}

export function renderAvatar(
    params: GridCellParams<{ name: string; color: string }, any, any>,
) {
    if (params.value == null) {
        return '';
    }

    return (
        <Avatar
            sx={{
                backgroundColor: params.value.color,
                width: '24px',
                height: '24px',
                fontSize: '0.85rem',
            }}
        >
            {params.value.name.toUpperCase().substring(0, 1)}
        </Avatar>
    );
}

export const columns: GridColDef[] = [
    {
        field: 'cv_header', headerName: 'CV Number', minWidth: 150,
        valueGetter: (params) => params.cv_no,
     },
    {
        field: 'check_number',
        headerName: 'Check Number',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 50,
    },
    {
        field: 'check_amount',
        headerName: 'Check Amount',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
    },
    {
        field: 'bank_account_no',
        headerName: 'Bank Account No.',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
    },
    {
        field: 'bank_name',
        headerName: 'Bank Name',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
    },
    {
        field: 'check_date',
        headerName: 'Check Date',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
    },
    //  {
    //     field: 'payee',
    //     headerName: 'Payee',
    //     headerAlign: 'right',
    //     align: 'right',
    //     flex: 2,
    //     minWidth: 100,
    // },
    // {
    //     field: 'cv_header',
    //     headerName: 'Payee',
    //     headerAlign: 'right',
    //     align: 'right',
    //     flex: 1,
    //     minWidth: 200,
    //     valueGetter: (params) => params.collector_name,
    // },
    // {
    //   field: 'status',
    //   headerName: 'Status',
    //   flex: 0.5,
    //   minWidth: 80,
    //   renderCell: (params) => renderStatus('Online'),
    // },
    {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        filterable: false,
        align: 'center',
        headerAlign: 'center',
        width: 150,
        renderCell: (params) => (
            <Stack direction="row" spacing={1}>
                <Button
                    variant="outlined"
                    size="small"
                    // startIcon={<VisibilityIcon />}
                    onClick={() => handleView(params.row)}
                >
                    Check Details
                </Button>
            </Stack>
        ),
    },
];

function handleView(cv: any) {
  router.visit(details(cv.id));
}
