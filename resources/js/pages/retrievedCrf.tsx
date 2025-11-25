import AppLayout from '@/layouts/app-layout';
// import { retrieveCrfRecords } from '@/routes';
import { Crf, inertiaPagination, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import CrfDataGrid from './dashboard/components/CrfDataGrid';
import Search from './dashboard/components/Search';
import Copyright from './dashboard/internals/components/Copyright';
import { useState } from 'react';
import { retrievedRecords } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retrieved CRF',
        href: '#',
    },
];

export default function RetrievedCrf({ crf }: { crf: inertiaPagination<Crf> }) {

    const [search, setSearch] = useState('');

    const handleSearch = (value: string) => {
            setSearch(value);
    
            router.get(
                retrievedRecords(),
                { search: value},
                {
                    preserveScroll: true,
                    preserveState: true,
                    replace: true,
                },
            );
        };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CRF" />
            <Box id="hero" sx={{ px: 3 }}>
                <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                    Check Request Form
                </Typography>
                <Stack direction="row" sx={{ gap: 1 }}>
                    <Search onSearch={handleSearch} value={search}/>
                    {/* <CustomDatePicker /> */}
                </Stack>
                <Grid container spacing={2} columns={12}>
                    {/* <Grid size={{ xs: 12, lg: 9 }}> */}
                    <CrfDataGrid crf={crf} />

                    {/* </Grid> */}
                    {/* <Grid size={{ xs: 12, lg: 3 }}>
                            <Stack
                                gap={2}
                                direction={{
                                    xs: 'column',
                                    sm: 'row',
                                    lg: 'column',
                                }}
                            >
                                <ChartUserByCountry />
                            </Stack>
                        </Grid> */}
                </Grid>
                <Copyright sx={{ my: 4 }} />
            </Box>
        </AppLayout>
    );
}
