import AppLayout from '@/layouts/app-layout';
// import { retrieveCrfRecords } from '@/routes';
import { InertiaPagination, User, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import UsersDataGrid from '../dashboard/components/UsersDataGrid';
import Copyright from '../dashboard/internals/components/Copyright';
import AddUserModal from './components/addUserModal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '#',
    },
];

export default function Users({ users }: { users: InertiaPagination<User> }) {
    const [openModal, setOpenModal] = useState(false);

    const onSave = () => { setOpenModal(true)};
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <Box id="hero" sx={{ px: 3 }}>
                <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                    Users
                </Typography>
                <Stack direction="row" sx={{ gap: 1 }}>
                    {/* <Search /> */}
                </Stack>
                <Grid container spacing={2} columns={12}>
                    <UsersDataGrid usersList={users} />
                </Grid>
                <Button variant="contained" onClick={onSave} sx={{ mt: 3 }}>
                    Add User
                </Button>
                <Copyright sx={{ my: 4 }} />
            </Box>
            <AddUserModal
                open={openModal}
                onClose={() => setOpenModal(false)}
            />
        </AppLayout>
    );
}
