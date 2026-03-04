import AppLayout from '@/layouts/app-layout';
import { modalStyle } from '@/lib/modalStyle';
import { checkVoucher, storeBank } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Voucher',
        href: checkVoucher().url,
    },
];

export default function BankSetup() {
    const { data, setData, post, processing, errors, reset } = useForm({
        acronym: '',
        bank: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(storeBank().url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bank Setup" />
            <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Setup Bank
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid
                        container
                        spacing={2}
                        sx={{ mb: 2, width: '100%', mt: 3 }}
                    >

                        <Grid size={{ xs: 12, sm: 12 }}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Bank Name"
                                  value={data.bank}
                                onChange={(e) =>
                                    setData('bank', e.target.value)
                                }
                                error={!!errors.bank}
                                helperText={errors.bank}
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 12 }}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Bank Acronym"
                                 value={data.acronym}
                                onChange={(e) =>
                                    setData('acronym', e.target.value)
                                }
                                error={!!errors.acronym}
                                helperText={errors.acronym}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ textAlign: 'right', mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            loading={processing}
                        >
                            Save
                        </Button>
                    </Box>
                </form>
            </Box>
        </AppLayout>
    );
}
