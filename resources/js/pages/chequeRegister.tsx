import useNotifications from '@/components/notifications/useNotifications';
import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { chequeRegisterStore } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Box, Button, TextField } from '@mui/material';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cheque Registration',
        href: '#',
    },
];

export default function ChequeRegister() {
    const { data, setData, post, processing, reset } = useForm({
        min: '',
        max: '',
    });

    const minValue = data.min === '' ? null : Number(data.min);
    const maxValue = data.max === '' ? null : Number(data.max);

    const rangeError =
        minValue !== null && maxValue !== null && maxValue < minValue;
    const notifications = useNotifications();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (rangeError) {
            return;
        }

        post(chequeRegisterStore().url, {
            onSuccess: () => {
                reset();
                notifications.show('Range Added', {
                    severity: 'success',
                    autoHideDuration: 3000,
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />

            <PageContainer title="Cheque Releasing">
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                    }}
                >
                    <TextField
                        label="Min"
                        type="number"
                        size="small"
                        value={data.min}
                        onChange={(e) => setData('min', e.target.value)}
                        slotProps={{
                            htmlInput: {
                                min: 0,
                            },
                        }}
                    />

                    <TextField
                        label="Max"
                        type="number"
                        size="small"
                        value={data.max}
                        onChange={(e) => setData('max', e.target.value)}
                        error={rangeError}
                        helperText={
                            rangeError ? 'Max should not be lower than Min' : ''
                        }
                        slotProps={{
                            htmlInput: {
                                min: 0,
                            },
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={rangeError || processing}
                    >
                        {processing ? 'Submitting...' : 'Submit'}
                    </Button>
                </Box>
            </PageContainer>
        </AppLayout>
    );
}
