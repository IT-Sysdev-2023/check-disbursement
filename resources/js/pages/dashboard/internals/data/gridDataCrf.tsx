import { details } from '@/routes';
import { Cv } from '@/types';
import { router } from '@inertiajs/react';
import { Button, Stack } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { GridCellParams, GridColDef } from '@mui/x-data-grid';


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

export const columnsCrf: GridColDef[] = [
    {
        field: 'filename',
        headerName: 'Filename',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 50,
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
        field: 'location',
        headerName: 'Location',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
    },
    {
        field: 'date',
        headerName: 'Date',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
    },
     {
        field: 'paid_to',
        headerName: 'Paid To',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
    },
     {
        field: 'particulars',
        headerName: 'Particulars',
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
        field: 'bank',
        headerName: 'Bank',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
    },
     {
        field: 'ck_no',
        headerName: 'CK No.',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
    },
     {
        field: 'prepared_by',
        headerName: 'Prepared By',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
    },
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

function handleView(cv: Cv) {
  router.visit(details(cv.id));
}
