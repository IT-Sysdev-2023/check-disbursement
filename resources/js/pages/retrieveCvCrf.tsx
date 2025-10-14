import AppLayout from '@/layouts/app-layout';
import { retrieve } from '@/routes';
import { Cv, inertiaPagination, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import CustomizedDataGrid from './dashboard/components/CustomizedDataGrid';
import Search from './dashboard/components/Search';
import Copyright from './dashboard/internals/components/Copyright';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retrived CV/CRF',
        href: retrieve().url,
    },
];

export default function RetrieveCvCrf({ cv }: {cv: inertiaPagination<Cv>}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Check-Releasing" />
            <Box id="hero" sx={{ px: 3 }}>
                <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                    Details
                </Typography>
                <Stack direction="row" sx={{ gap: 1 }}>
                    <Search />
                    {/* <CustomDatePicker /> */}
                </Stack>
                <Grid container spacing={2} columns={12}>
                    {/* <Grid size={{ xs: 12, lg: 9 }}> */}
                    <CustomizedDataGrid cvs={cv} />
                    
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
