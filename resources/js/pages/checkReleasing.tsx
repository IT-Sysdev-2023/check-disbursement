import AppLayout from '@/layouts/app-layout';
import { releasing, retrieveData } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Box,
    Button,
    Container,
    Grid,
    InputLabel,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import CustomizedDataGrid from './dashboard/components/CustomizedDataGrid';
import Copyright from './dashboard/internals/components/Copyright';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check-Releasing',
        href: releasing().url,
    },
];

export default function Releasing() {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Check-Releasing" />
            <Box
                id="hero"
                sx={(theme) => ({
                    width: '100%',
                    backgroundRepeat: 'no-repeat',

                    backgroundImage:
                        'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
                    ...theme.applyStyles('dark', {
                        backgroundImage:
                            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
                    }),
                })}
            >
                 <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                        Details
                    </Typography>
                    <Grid container spacing={2} columns={12}>
                        {/* <Grid size={{ xs: 12, lg: 9 }}> */}
                            <CustomizedDataGrid />
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
