import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { modalMediumStyle } from '@/lib/modalStyle';
import { handlePagination } from '@/lib/utils';
import { cancelChequeRange } from '@/routes';
import {
    BreadcrumbItem,
    ChequeStatusRangeMonitoring,
    ChequeStatusRangeType,
    PaginatorType,
    SelectionType,
} from '@/types';
import { router, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Grid,
    Modal,
    SelectChangeEvent,
    TextField,
    Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { FormEvent, useState } from 'react';
import SelectItem from './dashboard/components/SelectItem';
import { chequeStatusRangeColumn } from './eod/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cheque Status Monitoring',
        href: '#',
    },
];
export default function ChequeStatusRange({
    bank,
    items,
    records,
}: {
    bank: string;
    items: SelectionType[];
    records: PaginatorType<ChequeStatusRangeType>;
}) {
    const [selectedBank, setSelectedBank] = useState<string>(bank ?? 'all');
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const { setData, post, reset, errors, data } =
        useForm<ChequeStatusRangeMonitoring>({
            id: null,
            newChequeNumber: '',
            oldChequeNumber: '',
            reason: '',
            isCancelled: false,
        });

    const handleChange = async (event: SelectChangeEvent) => {
        const val = event.target.value;
        setSelectedBank(val);
        // const selectedBank = banks.find((bank) => bank.value === data.bank);

        router.reload({
            data: {
                bank: event.target.value,
            },
        });
    };
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!data.id) return;

        post(cancelChequeRange(data.id).url, {
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setOpenModal(false);
                reset();
            },
        });
    };

    const handleAction = (data: ChequeStatusRangeMonitoring) => {
        setData({
            id: data.id,
            oldChequeNumber: data.oldChequeNumber,
            newChequeNumber: data.newChequeNumber ?? '',
            reason: data.reason ?? '',
            isCancelled: data.isCancelled,
        });

        setOpenModal(true);
    };

    const chequeColumn = chequeStatusRangeColumn(handleAction);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <PageContainer title="Cheque Status Monitoring">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <SelectItem
                        handleChange={handleChange}
                        value={selectedBank}
                        title="Bank/ Bank Account"
                        items={items}
                    />
                    <Box sx={{ width: '100%' }}>
                        <DataGrid
                            sx={{ mt: 3 }}
                            rows={records.data}
                            rowCount={records.total}
                            columns={chequeColumn}
                            paginationMode="server"
                            disableRowSelectionOnClick={false}
                            paginationModel={{
                                page: records.current_page - 1,
                                pageSize: records.per_page,
                            }}
                            onPaginationModelChange={handlePagination}
                            showToolbar
                            pageSizeOptions={[5, 10, 15, 25]}
                            slotProps={{
                                loadingOverlay: {
                                    variant: 'circular-progress',
                                    noRowsVariant: 'circular-progress',
                                },
                                baseIconButton: {
                                    size: 'small',
                                },
                            }}
                        />
                    </Box>
                </Box>

                <Modal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalMediumStyle}>
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            New Cheque number
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <Grid
                                container
                                spacing={2}
                                sx={{ mb: 2, width: '100%', mt: 3 }}
                            >
                                <TextField
                                    label="Cheque Number"
                                    name="cheque_number"
                                    onChange={(e) =>
                                        setData(
                                            'newChequeNumber',
                                            e.target.value,
                                        )
                                    }
                                    value={data.newChequeNumber}
                                    disabled={data.isCancelled}
                                    error={Boolean(errors?.newChequeNumber)}
                                    helperText={errors?.newChequeNumber}
                                    fullWidth
                                    autoFocus
                                />
                                <TextField
                                    id="reason"
                                    label="Type your reason here..."
                                    onChange={(e) =>
                                        setData('reason', e.target.value)
                                    }
                                    value={data.reason}
                                    error={!!errors.reason}
                                    helperText={errors.reason}
                                    multiline
                                    disabled={data.isCancelled}
                                    rows={4}
                                    fullWidth
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            minHeight: 120,
                                            alignItems: 'flex-start',
                                        },
                                    }}
                                />
                            </Grid>
                            <Box sx={{ textAlign: 'right', mt: 2 }}>
                                <Button
                                    type="submit"
                                    disabled={data.isCancelled}
                                    variant="outlined"
                                    color="secondary"
                                    size="large"
                                    loading={loading}
                                    //  disabled={processing}
                                >
                                    Save
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Modal>
            </PageContainer>
        </AppLayout>
    );
}
