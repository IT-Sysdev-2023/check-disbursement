import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { retrievedRecords, storeUnassignCheck } from '@/routes';
import { BreadcrumbItem, Cv } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
import {
    Box,
    Button,
    Divider,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import dayjs from 'dayjs';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Unassign CV',
        href: retrievedRecords().url,
    },
    {
        title: 'CV Details',
        href: '#',
    },
];

export default function UnassignCheck({ cv }: { cv: { data: Cv } }) {
    const details = cv.data;

    const { data, setData, post, errors } = useForm({
        checkNumber: details.checkNumber,
        id: cv.data.id,
    });

    const handleSubmit = () => {
        post(storeUnassignCheck().url, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV Details" />
            <PageContainer title="CV Details">
                <Box sx={{ flexGrow: 1, width: '100%' }}>
                    <Grid container spacing={2} sx={{ width: '100%' }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    CV Number
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {details.cvHeader?.cvNo}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Payee
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {details.payee}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Check Number
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={data.checkNumber}
                                    error={!!errors.checkNumber}
                                    helperText={errors.checkNumber ?? ' '}
                                    onChange={(e) =>
                                        setData(
                                            'checkNumber',
                                            Number(e.target.value),
                                        )
                                    }
                                    sx={{ mb: 1 }}
                                />
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Check Amount
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {details.checkAmount}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Check Date
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {dayjs(details.checkDate).format(
                                        'MMMM D, YYYY',
                                    )}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Bank Account No.
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {details.bankAccountNo}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Bank Name
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {details.bankName}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Remarks
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {details.cvHeader?.remarks}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 3 }} />
                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="space-between"
                    >
                        <Button
                            variant="contained"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => window.history.back()}
                        >
                            Back
                        </Button>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </PageContainer>
        </AppLayout>
    );
}
