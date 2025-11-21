import AppLayout from '@/layouts/app-layout';
import { checkReleasing } from '@/routes';
import { Auth, Crf, Cv, inertiaPagination, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Box, Grid, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { GridPaginationModel } from '@mui/x-data-grid';
import { useState } from 'react';
import CrfReleasingDataGrid from './dashboard/components/CrfReleasingDataGrid';
import CvReleasingDataGrid from './dashboard/components/CvReleasingDataGrid';
import Search from './dashboard/components/Search';
import SelectItem from './dashboard/components/SelectItem';
import Copyright from './dashboard/internals/components/Copyright';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Releasing',
        href: '#',
    },
];

export default function CheckReleasing({
    cv,
    crf,
    auth,
}: {
    cv: inertiaPagination<Cv>;
    crf: inertiaPagination<Crf>;
    auth: Auth;
}) {
    const [bu, setBu] = useState<{ label: string; value: string }>({
        label: '',
        value: '',
    });

    console.log(cv);
    const [check, setCheck] = useState('1');

    const [search, setSearch] = useState('');
    const permissions =
        auth.user?.permissions?.map((r) => ({ value: r.id, label: r.name })) ||
        [];

    const checks = [
        { value: '1', label: 'CV' },
        { value: '2', label: 'CRF' },
    ];

    const handleChangeCheck = (event: SelectChangeEvent) => {
        setCheck(event.target.value);

        router.get(
            checkReleasing(),
            { bu: bu.label },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

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
            checkReleasing(),
            { bu: selectedItem?.label },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const handlePagination = (model: GridPaginationModel) => {
        const page = model.page + 1; // MUI DataGrid uses 0-based index
        const per_page = model.pageSize;

        router.get(
            checkReleasing(),
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
            checkReleasing(),
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
                    Check Releasing
                </Typography>
                <Stack direction="row" sx={{ gap: 3 }}>
                    <Search onSearch={handleSearch} value={search} />
                    <SelectItem
                        handleChange={handleChange}
                        value={bu.value}
                        title="BU"
                        items={permissions}
                    />
                    <SelectItem
                        handleChange={handleChangeCheck}
                        value={check}
                        title="Check"
                        items={checks}
                    />
                </Stack>
                <Grid container spacing={2} columns={12} sx={{ mt: 3 }}>
                    {check === '1' && (
                        <CvReleasingDataGrid
                            cvs={cv}
                            pagination={handlePagination}
                        />
                    )}

                    {check === '2' && (
                        <CrfReleasingDataGrid
                            crf={crf}
                            pagination={handlePagination}
                        />
                    )}
                </Grid>
                <Copyright sx={{ my: 4 }} />
            </Box>
        </AppLayout>
    );
}
