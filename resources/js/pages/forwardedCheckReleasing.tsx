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
    SelectChangeEvent,
    TextField,
    Typography,
} from '@mui/material';
import {
    GridFilterModel,
    GridPaginationModel,
    GridSortModel,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import TableFilter from '../components/tableFilter';
import {
    createForwardedReleasingCvColumns,
    createReleasingCrfColumns,
} from './checkReleasing/components/columns';
import TableDataGrid from './dashboard/components/TableDataGrid';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Releasing',
        href: '#',
    },
];
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ForwardedCheckReleasing({
    cheques,
    company,
    defaultCheck,
    filter,
}: {
    cheques: InertiaPagination<Cv | Crf>;
    defaultCheck: string;
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
    company: SelectionType[];
    receiver: SelectionType[];
}) {
    const [check, setCheck] = useState(defaultCheck);
    const [tableLoading, setTableLoading] = useState(false);
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

    const handlePagination = (model: GridPaginationModel) => {
        const page = model.page + 1;
        const per_page = model.pageSize;

        router.reload({
            data: {
                page: page,
                per_page: per_page,
            },
        });
    };

    const handleSearch = (model: GridFilterModel) => {
        const query = model.quickFilterValues?.length
            ? model.quickFilterValues?.[0]
            : '';

        router.reload({
            data: {
                search: query,
            },
            only: [check === 'cv' ? 'cv' : 'crf'],
            replace: true,
        });
    };

    const handleCheck = (event: SelectChangeEvent) => {
        setCheck(event.target.value);
        router.reload({
            data: {
                selectedCheck: event.target.value,
            },
            only: ['cheques'],
            replace: true,
            onStart: () => setTableLoading(true),
            onFinish: () => setTableLoading(false),
        });
    };

    const handleSort = (model: GridSortModel) => {
        router.reload({
            data: {
                sort: {
                    field: model[0].field,
                    sort: model[0].sort,
                },
            },
            only: [check === 'cv' ? 'cv' : 'crf'],
            replace: true,
        });
    };

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
            component: 'checkReleasing/releaseCheckForwarded',
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

    const cvColumns = createForwardedReleasingCvColumns(handleStatusChange);
    const crfColumns = createReleasingCrfColumns(handleStatusChange);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Receiving">
                <TableFilter
                    isCheckDisabled
                    currentTab="cheques"
                    handleChangeCheck={handleCheck}
                    company={company}
                    filters={filter}
                    check={check}
                />

                <TableDataGrid
                    data={cheques}
                    filter={filter.search}
                    pagination={handlePagination}
                    handleSearchFilter={handleSearch}
                    handleSortFilter={handleSort}
                    columns={check === 'cv' ? cvColumns : crfColumns}
                    isLoading={tableLoading}
                />
                {/* <Copyright sx={{ my: 4 }} /> */}

                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
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
