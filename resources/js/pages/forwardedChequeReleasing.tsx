import PageContainer from '@/components/pageContainer';
import PdfReader from '@/components/pdf-reader';
import AppLayout from '@/layouts/app-layout';
import { modalStyle } from '@/lib/modalStyle';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import CallMissedOutgoingOutlinedIcon from '@mui/icons-material/CallMissedOutgoingOutlined';
import { cancelForwarded } from '@/routes';
import {
    Crf,
    Cv,
    DateFilterType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Box, Button, Grid, Modal, TextField, Typography } from '@mui/material';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import TableFilter from '../components/tableFilter';
import { createForwardedReleasingColumns } from './chequeReleasing/components/columns';
import TableDataGrid from './dashboard/components/TableDataGrid';
import ForwardedReleasingModal from '@/components/forwarded-releasing-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Releasing',
        href: '#',
    },
];

export default function ForwardedChequeReleasing({
    cheques,
    company,
    filter,
}: {
    cheques: InertiaPagination<Cv | Crf>;
    filter: {
        selectedCompany: string;
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
    company: SelectionType[];
    receiver: SelectionType[];
}) {
    const [open, setOpen] = useState(false);
    const [openReleasing, setOpenReleasing] = useState(false);
    const [selectedRows, setSelectedRows] = useState<
        { id: number; status: string }[]
        >([]);
     const [selectedCheques, setSelectedCheques] = useState<
        { id: number; status: string }[]
    >([]);

    const [chequeStatusId, setChequeStatusId] = useState<number | undefined>(
        undefined,
    );
    const [stream, setStream] = useState('');
    const [openModalPdf, setOpenModalPdf] = useState(false);

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

    const handleStatusChange = (items: { id: number; status: string }, value: string) => {
        if (value === 'cancel') {
            setChequeStatusId(items.id);
            setOpen(true);
            return;
        }
        // console.log(items);

        proceed([items]);
        // router.push({
        //     url: releaseCheckForwarded([chequeStatusId, value]).url,
        //     component: 'chequeReleasing/releaseCheckForwarded',
        //     props: (curr) => ({
        //         ...curr,
        //         id: chequeStatusId,
        //         status: value,
        //         label: value + ' Check',
        //     }),
        // });
    };

    const handleSubmitCancellation = (e: React.FormEvent) => {
        e.preventDefault();

        if (chequeStatusId)
            post(cancelForwarded(chequeStatusId).url, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
    };

    const multipleRelease = () => {
       proceed(selectedRows);
    };

    const proceed = (items: { id: number; status: string }[]) => {
        setSelectedCheques(items);
        setOpenReleasing(true);
    };

    const handleSelectionChange = (model: GridRowSelectionModel) => {
        const selectedR = cheques.data
            .filter((row) => model.ids.has(row.id))
            .map((row) => ({
                id: row.id,
                status: 'released', //not dynamic, change this if new status added
            }));
        setSelectedRows(selectedR);
    };

    const columns = createForwardedReleasingColumns(handleStatusChange);
    const enableButton = selectedRows.length > 0;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Releasing">
                <TableFilter company={company} filters={filter} />

                <TableDataGrid
                    data={cheques}
                    filter={filter.search}
                    hasSelection
                    handleSelectionChange={handleSelectionChange}
                    pagination={handlePagination}
                    handleSearchFilter={handleSearch}
                    handleSortFilter={handleSort}
                    columns={columns}
                />
                <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
                    <Button
                        disabled={!enableButton}
                        variant="outlined"
                        startIcon={<CallMissedOutgoingOutlinedIcon />}
                        onClick={multipleRelease}
                    >
                        Release
                    </Button>
                </Box>
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
            <ForwardedReleasingModal
                                cheques={selectedCheques}
                                open={openReleasing}
                                handleClose={() => {
                                    setOpenReleasing(false);
                                }}
                            />
            <PdfReader
                open={openModalPdf}
                handleClose={() => setOpenModalPdf(false)}
                stream={stream}
            />
        </AppLayout>
    );
}
