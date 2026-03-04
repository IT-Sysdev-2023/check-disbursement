import AppLayout from '@/layouts/app-layout';
import { modalStyle } from '@/lib/modalStyle';
import { checkVoucher, storeBankAccount } from '@/routes';
import { SelectionType, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Box, Button, Grid, SelectChangeEvent, TextField, Typography } from '@mui/material';
import SelectItem from '../dashboard/components/SelectItem';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Voucher',
        href: checkVoucher().url,
    },
];

export default function BankAccountSetup({ banks }: { banks: SelectionType[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        bank: '',
        accountNumber: '',
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(storeBankAccount().url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

     const handleChange = (event: SelectChangeEvent) => {
            setData('bank', event.target.value);
        };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bank Setup" />
            <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Bank Account Setup
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid
                        container
                        spacing={2}
                        sx={{ mb: 2, width: '100%', mt: 3 }}
                    >
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <SelectItem
                                handleChange={handleChange}
                                value={data.bank}
                                title="Bank"
                                items={banks}
                            />
                        </Grid>

                         <Grid size={{ xs: 12, sm: 12 }}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Account Number"
                                value={data.accountNumber}
                                onChange={(e) =>
                                    setData('accountNumber', e.target.value)
                                }
                                error={!!errors.accountNumber}
                                helperText={errors.accountNumber}
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 12 }}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Name on Bank Account"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                error={!!errors.name}
                                helperText={errors.name}
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
