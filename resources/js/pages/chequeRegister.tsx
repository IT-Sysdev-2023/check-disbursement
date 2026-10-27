import useNotifications from '@/components/notifications/useNotifications';
import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { chequeRegisterStore } from '@/routes';
import { FilterType, SelectionType, type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Box, Button, SelectChangeEvent, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import SelectItem from './dashboard/components/SelectItem';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cheque Registration',
        href: '#',
    },
];

export default function ChequeRegister({
    banks,
    filters,
}: {
    banks: SelectionType[];
    filters: FilterType;
    }) {
    const { data, setData, post, processing, reset } = useForm({
        min: '',
        max: '',
        bank:  filters.bank,
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
    const handleChange = async (event: SelectChangeEvent) => {
        const val = event.target.value;
        setData('bank', val);

        const selected = banks.find((bank) => bank.value === val);
        router.reload({
            data: {
                bank: selected?.value,
            },
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cheque Registration" />

            <PageContainer title="Cheque Registration">
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        flexWrap: 'wrap',
                    }}
                >
                    <TextField
                        label="Min"
                        type="number"
                        size="small"
                        value={data.min}
                        onChange={(e) => setData('min', e.target.value)}
                        slotProps={{
                            htmlInput: { min: 0 },
                        }}
                        required
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
                            htmlInput: { min: 0 },
                        }}
                        required
                    />
                    {/* <Stack
                        direction="row"
                        sx={{
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 4,
                            marginBottom: 2,
                        }}
                    > */}
                        <SelectItem
                            handleChange={handleChange}
                            value={data.bank}
                            title="Bank"
                            items={banks}
                        />
                    {/* </Stack> */}
                    {/* <TextField
                        label="Bank"
                        size="small"
                        value={data.bank}
                        onChange={(e) => setData('bank', e.target.value)}
                        required
                    />

                    <TextField
                        label="Bank Account"
                        size="small"
                        value={data.bank_account}
                        onChange={(e) =>
                            setData('bank_account', e.target.value)
                        }
                        required
                    /> */}

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
