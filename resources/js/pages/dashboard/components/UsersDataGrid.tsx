import UserModal from '@/pages/admin/components/userModal';
import { users } from '@/routes';
import { InertiaPagination, Permission, User } from '@/types';
import { router } from '@inertiajs/react';
import { Button, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useState } from 'react';

export default function UsersDataGrid({
    usersList,
}: {
    usersList: InertiaPagination<User>;
}) {
    const [openModal, setOpenModal] = useState(false);
    const [userDetails, setUserDetails] = useState<User>();
    const handlePagination = (model: GridPaginationModel) => {
        const page = model.page + 1; // MUI DataGrid uses 0-based index
        const per_page = model.pageSize;

        router.get(
            users(),
            { page, per_page },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleModal = (user: User) => {
        setUserDetails(user);
        setOpenModal(true);
    };

    const handleClose = () => setOpenModal(false);
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Id',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 50,
        },
        {
            field: 'name',
            headerName: 'Full Name',
            headerAlign: 'right',
            align: 'right',
            flex: 2,
            minWidth: 100,
        },
        {
            field: 'username',
            headerName: 'Username',
            headerAlign: 'right',
            align: 'right',
            flex: 2,
            minWidth: 100,
        },
        {
            field: 'roles',
            headerName: 'Role',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 50,
            valueGetter: (params: Permission[]) => {
                return params?.map((r) => r.name).join(', ') || '-';
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            filterable: false,
            width: 150,
            renderCell: (params) => (
                
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        size="small"
                        // startIcon={<VisibilityIcon />}
                        onClick={() => handleModal(params.row)}
                    >
                        Assign
                    </Button>
                </Stack>
            ),
        },
    ];

    return (
        <>
            <DataGrid
                rows={usersList.data}
                columns={columns}
                rowCount={usersList.total}
                paginationMode="server"
                paginationModel={{
                    page: usersList.current_page - 1,
                    pageSize: usersList.per_page,
                }}
                pageSizeOptions={[10, 15, 25, 50]}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
                onPaginationModelChange={handlePagination}
                disableColumnResize
                density="compact"
                slotProps={{
                    filterPanel: {
                        filterFormProps: {
                            logicOperatorInputProps: {
                                variant: 'outlined',
                                size: 'small',
                            },
                            columnInputProps: {
                                variant: 'outlined',
                                size: 'small',
                                sx: { mt: 'auto' },
                            },
                            operatorInputProps: {
                                variant: 'outlined',
                                size: 'small',
                                sx: { mt: 'auto' },
                            },
                            valueInputProps: {
                                InputComponentProps: {
                                    variant: 'outlined',
                                    size: 'small',
                                },
                            },
                        },
                    },
                }}
            />
            <UserModal
                open={openModal}
                details={userDetails}
                onClose={handleClose}
            />
        </>
    );
}
