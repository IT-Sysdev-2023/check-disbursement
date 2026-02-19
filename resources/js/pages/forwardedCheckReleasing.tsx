import useNotifications from '@/components/notifications/useNotifications';
import PageContainer from '@/components/pageContainer';
import PdfReader from '@/components/pdf-reader';
import AppLayout from '@/layouts/app-layout';
import { cancelForwarded, releaseCheckForwarded } from '@/routes';
import {
    Crf,
    Cv,
    DateFilterType,
    FlashReponse,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Box,
    Button,
    Grid,
    Modal,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import TableFilter from '../components/tableFilter';
import {
    createForwardedReleasingColumns,
} from './chequeReleasing/components/columns';
import TableDataGrid from './dashboard/components/TableDataGrid';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { modalStyle } from '@/lib/modalStyle';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Releasing',
        href: '#',
    },
];

export default function ForwardedCheckReleasing({
    cheques,
    company,
    filter,
}: {
    cheques: InertiaPagination<Cv | Crf>;
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
    company: SelectionType[];
    receiver: SelectionType[];
}) {
    const [open, setOpen] = useState(false);
    const [checkStatusId, setCheckStatusId] = useState<number | undefined>(
        undefined,
    );
    const [stream, setStream] = useState('');
    const [openModalPdf, setOpenModalPdf] = useState(false);

    const notifications = useNotifications();

    const { setData, post, processing, errors, reset } = useForm({
        reason: '',
    });

    const { flash } = usePage().props as {
        flash?: { status?: boolean; message?: string; stream?: string };
    };

    useEffect(() => {
        if (flash?.status && flash?.stream) {
            setStream(flash.stream);
            setOpenModalPdf(true);
        }
    }, [flash]);

    // const handleStatusChange = (checkStatusId: number, value: string) => {
    //     if (value === 'view') {
    //         router.visit(signatureDetails(checkStatusId));
    //         return;
    //     }
    //     setCheckStatusId(checkStatusId);
    //     setOpenModal(true);
    // };

    const handleStatusChange = (checkStatusId: number, value: string) => {
        if (value === 'cancel') {
            setCheckStatusId(checkStatusId);
            setOpen(true);
            return;
        }

        router.push({
            url: releaseCheckForwarded([checkStatusId, value]).url,
            component: 'chequeReleasing/releaseCheckForwarded',
            props: (curr) => ({
                ...curr,
                id: checkStatusId,
                status: value,
                label: value + ' Check',
            }),
        });
    };

    const handleSubmitCancellation = (e: React.FormEvent) => {
        e.preventDefault();

        if (checkStatusId)
            post(cancelForwarded(checkStatusId).url, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: ({ props }) => {
                    const m = props.flash as FlashReponse;
                    reset();
                    setOpen(false);

                    notifications.show(m.message, {
                        severity: 'error',
                        autoHideDuration: 3000,
                    });
                },
            });
    };

    const columns = createForwardedReleasingColumns(handleStatusChange);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Releasing">
                <TableFilter
                    company={company}
                    filters={filter}
                />

                <TableDataGrid
                    data={cheques}
                    filter={filter.search}
                    pagination={handlePagination}
                    handleSearchFilter={handleSearch}
                    handleSortFilter={handleSort}
                    columns={columns}
                />
                {/* <Copyright sx={{ my: 4 }} /> */}

                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle}>
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            Reason for Cancellation
                        </Typography>

                        <form onSubmit={handleSubmitCancellation}>
                            <Grid
                                container
                                spacing={2}
                                sx={{ mb: 2, width: '100%', mt: 3 }}
                            >
                                <Grid size={{ xs: 12, sm: 12 }}>
                                    <TextField
                                        id="outlined-multiline-static"
                                        label="Type your reason here..."
                                        onChange={(e) =>
                                            setData('reason', e.target.value)
                                        }
                                        error={!!errors.reason}
                                        helperText={errors.reason}
                                        multiline
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
                                    Update
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Modal>
            </PageContainer>
            <PdfReader
                open={openModalPdf}
                handleClose={() => setOpenModalPdf(false)}
                stream={stream}
            />
        </AppLayout>
    );
}
