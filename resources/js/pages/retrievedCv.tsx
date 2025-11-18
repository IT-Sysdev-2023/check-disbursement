import AppLayout from '@/layouts/app-layout';
import { retrievedRecords } from '@/routes';
import { Auth, Cv, inertiaPagination, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Box, Grid, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { GridPaginationModel } from '@mui/x-data-grid';
import { useState } from 'react';
import CvDataGrid from './dashboard/components/CvDataGrid';
import Search from './dashboard/components/Search';
import SelectItem from './dashboard/components/SelectItem';
import Copyright from './dashboard/internals/components/Copyright';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retrieved CV/CRF',
        href: '#',
    },
];

export default function RetrievedCv({
    cv,
    auth,
}: {
    cv: inertiaPagination<Cv>;
    auth: Auth;
}) {
    const [bu, setBu] = useState<{ label: string; value: string }>({
        label: '',
        value: '',
    });

    const [search, setSearch] = useState('');
    const permissions =
        auth.user?.permissions?.map((r) => ({ value: r.id, label: r.name })) ||
        [];

    const handleChange = (event: SelectChangeEvent) => {
        const selectedItem = permissions.find(
            (item) => item.value == Number(event.target.value),
        );

        if (selectedItem) {
            setBu({
                label: selectedItem?.label,
                value: String(selectedItem?.value),
            });
        }

        router.get(
            retrievedRecords(),
            { bu: selectedItem?.label },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true
            },
        );
    };

    console.log(cv);

    const handlePagination = (model: GridPaginationModel) => {
        const page = model.page + 1; // MUI DataGrid uses 0-based index
        const per_page = model.pageSize;

        router.get(
            retrievedRecords(),
            { page, per_page, bu: bu.label },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleSearch = (value: string) => {
        setSearch(value);

        router.get(
            retrievedRecords(),
            { search: value, bu: bu.label },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <Box id="hero" sx={{ px: 3 }}>
                <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                    Check Vouchers
                </Typography>
                <Stack direction="row" sx={{ gap: 3 }}>
                    <Search onSearch={handleSearch} value={search} />
                    <SelectItem
                        handleChange={handleChange}
                        value={bu.value}
                        title="BU"
                        items={permissions}
                    />
                </Stack>
                <Grid container spacing={2} columns={12}>
                    <CvDataGrid cvs={cv} pagination={handlePagination} />
                </Grid>
                <Copyright sx={{ my: 4 }} />
            </Box>
        </AppLayout>
    );
}
