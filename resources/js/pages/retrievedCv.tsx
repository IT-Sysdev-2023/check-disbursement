import AppLayout from '@/layouts/app-layout';
// import { retrieveCrfRecords } from '@/routes';
import { Cv, inertiaPagination, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import Search from './dashboard/components/Search';
import Copyright from './dashboard/internals/components/Copyright';
import CvDataGrid from './dashboard/components/CvDataGrid';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retrieved CV/CRF',
        href: '#',
    },
];

export default function RetrievedCv({ cv }: { cv: inertiaPagination<Cv> }) {
    // console.log(cv);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <Box id="hero" sx={{ px: 3 }}>
                <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                    Check Vouchers
                </Typography>
                <Stack direction="row" sx={{ gap: 1 }}>
                    <Search />
                    {/* <CustomDatePicker /> */}
                </Stack>
                <Grid container spacing={2} columns={12}>
                    {/* <Grid size={{ xs: 12, lg: 9 }}> */}
                    <CvDataGrid cvs={cv} />

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
