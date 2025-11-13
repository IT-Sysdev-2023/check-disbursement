import AppLayout from '@/layouts/app-layout';
// import { retrieveCrfRecords } from '@/routes';
import { inertiaPagination, User, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import Search from '../dashboard/components/Search';
import Copyright from '../dashboard/internals/components/Copyright';
import UsersDataGrid from '../dashboard/components/UsersDataGrid';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '#',
    },
];

export default function Users({ users }: { users: inertiaPagination<User> }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <Box id="hero" sx={{ px: 3 }}>
                <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                    Users
                </Typography>
                <Stack direction="row" sx={{ gap: 1 }}>
                    <Search />
                </Stack>
                <Grid container spacing={2} columns={12}>
                    <UsersDataGrid usersList={users} />
                </Grid>
                <Copyright sx={{ my: 4 }} />
            </Box>
        </AppLayout>
    );
}
