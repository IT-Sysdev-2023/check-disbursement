import useNotifications from '@/components/notifications/useNotifications';
import PageContainer from '@/components/pageContainer';
import TableFilter from '@/components/tableFilter';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { markAsClose, submitDocuments } from '@/routes';
import {
    ChequeStatus,
    ClosingCheckDetailsType,
    DateFilterType,
    FlashReponse,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Box,
    Button,
    Grid,
    IconButton,
    Modal,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { RefreshCwIcon } from 'lucide-react';
import { useState } from 'react';
import { createClosingCvColumns } from './closing/components/columns';
import TableDataGrid from './dashboard/components/TableDataGrid';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Status',
        href: '#',
    },
];
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 5,
};
export default function CvCrfList({
    cheques,
    company,
    filter,
    totalDocuments,
}: {
    cheques: InertiaPagination<ChequeStatus>;
    company: SelectionType[];
    filter: {
        selectedCompany: string;
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
    totalDocuments: number;
}) {
    const [openModal, setOpenModal] = useState(false);
    const [recordDetails, setRecordDetails] =
        useState<ClosingCheckDetailsType | null>(null);

    const [stream, setStream] = useState('');
    const [openModalPdf, setOpenModalPdf] = useState(false);

    const handleStatusChange = (data: ClosingCheckDetailsType) => {
        setRecordDetails(data);
        setOpenModal(true);

        // if (check === 'cv') router.visit(signatureDetails(id));
        // else router.visit(detailsCrf(id));
    };
    const handleMarkClose = () => {
        try {
            if (recordDetails)
                router.post(
                    markAsClose(recordDetails.id),
                    {},
                    {
                        onSuccess: ({ props }) => {
                            const m = props.flash as FlashReponse;

                            setOpenModal(false);
                            if (m.status) {
                                setStream(m.stream);
                                setOpenModalPdf(true);
                            }
                        },
                    },
                );
        } finally {
            setOpenScan(true);
        }
    };

    const columns = createClosingCvColumns(handleStatusChange);

    const [openScan, setOpenScan] = useState(false);

    const handleCloseScan = () => setOpenScan(false);

    const handleRefreshTotalFiles = () => {
        router.reload({ only: ['totalDocuments'] });
    };
    const notifications = useNotifications();
    const handleGetFiles = async () => {
        const { data } = await axios.post(submitDocuments().url, {
            chequeNumber: recordDetails?.checkNo,
            id: recordDetails?.id
        });

        if (data.status === 'success') {
            notifications.show(data.message, {
                severity: 'success',
                autoHideDuration: 3000,
            });
            setOpenScan(false);
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Cheque Status">
                <TableFilter company={company} filters={filter} />

                <TableDataGrid
                    data={cheques}
                    filter={filter.search}
                    pagination={handlePagination}
                    handleSearchFilter={handleSearch}
                    handleSortFilter={handleSort}
                    columns={columns}
                />
            </PageContainer>

            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{ mb: 2 }}
                    >
                        Check Details
                    </Typography>

                    <Grid container spacing={2}>
                        {recordDetails &&
                            [
                                {
                                    label: 'CV/CRF Number',
                                    value: recordDetails.cvNo,
                                },
                                {
                                    label: 'Released Date',
                                    value: recordDetails.releasedAt,
                                },
                                { label: 'Bank', value: recordDetails.bank },
                                {
                                    label: 'Check Number',
                                    value: recordDetails.checkNo,
                                },
                                { label: 'Payee', value: recordDetails.payee },
                                {
                                    label: 'Amount',
                                    value: recordDetails.amount,
                                },
                                {
                                    label: 'Received By',
                                    value: recordDetails.receivedBy,
                                },
                            ].map(({ label, value }) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={label}>
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {label}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            fontWeight={500}
                                        >
                                            {value || '—'}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                    </Grid>

                    <Box sx={{ textAlign: 'right', mt: 3 }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleMarkClose}
                        >
                            Mark as Close
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal open={openModalPdf} onClose={() => setOpenModalPdf(false)}>
                <Box sx={{ ...style, width: '70%' }}>
                    {stream && (
                        <iframe
                            src={stream}
                            style={{ width: '100%', height: '500px' }}
                            frameBorder={0}
                        />
                    )}
                </Box>
            </Modal>

            <Modal
                open={openScan}
                onClose={(event, reason) => {
                    if (reason === 'backdropClick') {
                        return;
                    }
                    handleCloseScan();
                }}
                aria-labelledby="scan-modal-title"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 3,
                    }}
                >
                    <Typography
                        id="scan-modal-title"
                        variant="h6"
                        fontWeight={600}
                        mb={2}
                    >
                        Scan Document
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        <TextField
                            label="Cheque Number"
                            value={recordDetails?.checkNo}
                            size="small"
                            disabled
                            fullWidth
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                minWidth: 160,
                                px: 2,
                                borderRadius: 1,
                                bgcolor: 'action.hover',
                            }}
                        >
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Total Files
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {totalDocuments}
                                </Typography>
                            </Box>
                            <Tooltip title="Refresh">
                                <IconButton
                                    size="small"
                                    onClick={handleRefreshTotalFiles}
                                >
                                    <RefreshCwIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 1,
                            mt: 3,
                        }}
                    >
                        {/* <Button onClick={handleCloseScan}>Cancel</Button> */}

                        <Button variant="contained" onClick={handleGetFiles}>
                            Get Files
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </AppLayout>
    );
}
