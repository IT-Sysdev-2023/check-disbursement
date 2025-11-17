import { details } from '@/routes';
import { Cv } from '@/types';
import { router } from '@inertiajs/react';
import { Button, Stack } from '@mui/material';
import Avatar from '@mui/material/Avatar';
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
        field: 'paid_to',
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
        field: 'ck_no',
        headerName: 'CK No.',
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
                    View
                </Button>
            </Stack>
        ),
    },
];

function handleView(cv: Cv) {
  router.visit(details(cv.id));
}
