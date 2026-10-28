import useNotifications from '@/components/notifications/useNotifications';
import PageContainer from '@/components/pageContainer';
import { usePdfPreview } from '@/components/PdfPreview';
import TableFilter from '@/components/tableFilter';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import {
    closingCheque,
    exportPdfAll,
    exportPdfBu,
    markAsClose,
    submitDocuments,
} from '@/routes';
import {
    ChequeStatus,
    ClosingCheckDetailsType,
    FilterType,
    FlashReponse,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import { SwipeVertical, ViewCompact } from '@mui/icons-material';
import {
    Box,
    Button,
    Grid,
    IconButton,
    Modal,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { FileDown, RefreshCwIcon } from 'lucide-react';
import { SyntheticEvent, useState } from 'react';
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
    businessUnits,
    totalDocuments,
}: {
    cheques: InertiaPagination<ChequeStatus>;
    company: SelectionType[];
    businessUnits: SelectionType[];
    filter: FilterType;
    totalDocuments: number;
}) {
    const [openModal, setOpenModal] = useState(false);
    const [recordDetails, setRecordDetails] =
        useState<ClosingCheckDetailsType | null>(null);

    // const handleStatusChange = (data: ClosingCheckDetailsType) => {
    //     setRecordDetails(data);
    //     if (data.hasDocument) {
    //         setOpenModal(true);
    //     } else {
    //         setOpenScan(true);
    //     }
    // };

    const { openPdf } = usePdfPreview();

    const handleMarkClose = () => {
        if (recordDetails)
            router.post(
                markAsClose(recordDetails.id),
                {},
                {
                    onSuccess: ({ props }) => {
                        const m = props.flash as FlashReponse;

                        setOpenModal(false);
                        if (m.status) {
                            openPdf(m.stream!);
                        }
                    },
                },
            );
    };
    const [openScan, setOpenScan] = useState(false);

    const handleRefreshTotalFiles = () => {
        router.reload({ only: ['totalDocuments'] });
    };

    const notifications = useNotifications();

    const handleGetFiles = async () => {
        const { data } = await axios.post(submitDocuments().url, {
            chequeNumber: recordDetails?.checkNo,
            id: recordDetails?.id,
        });

        if (data.status === 'success') {
            notifications.show(data.message, {
                severity: 'success',
                autoHideDuration: 3000,
            });
            setOpenScan(false);
        }
    };

    const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
        if (newValue === null) return;
        router.get(
            closingCheque(),
            {
                tab: newValue,
            },
            { replace: true },
        );
    };
    const generatePdf = () => {
        router.post(
            exportPdfBu(),
            {
                company: filter.selectedCompany,
                bu: filter.selectedBu,
            },
            {
                onSuccess: ({ props }) => {
                    const m = props.flash as FlashReponse;
                    if (m.status) {
                        openPdf(m.stream!);
                    }
                },
            },
        );
    };
    const generateAll = () => {
        router.post(
            exportPdfAll(),
            {},
            {
                onSuccess: ({ props }) => {
                    const m = props.flash as FlashReponse;
                    if (m.status) {
                        openPdf(m.stream!);
                    }
                },
            },
        );
    };
    const isDisabled = filter.selectedBu != '' && filter.selectedBu != '';

    const columns = createClosingCvColumns();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Closing Cheques">
                <ToggleButtonGroup
                    color="primary"
                    value={filter.tab}
                    exclusive
                    onChange={handleChangeTab}
                    aria-label="Platform"
                >
                    <ToggleButton value="doc_required">
                        <ViewCompact sx={{ mr: 1, fontSize: 18 }} />
                        Document Required
                    </ToggleButton>
                    <ToggleButton value="doc_uploaded">
                        <SwipeVertical sx={{ mr: 1, fontSize: 18 }} />
                        Document Uploaded
                    </ToggleButton>
                </ToggleButtonGroup>

                <TableFilter
                    company={company}
                    businessUnits={businessUnits}
                    filters={filter}
                >
                    {filter.tab == 'doc_uploaded' && (
                        <>
                            <Button
                                disabled={!isDisabled}
                                variant="outlined"
                                startIcon={<FileDown />}
                                onClick={generatePdf}
                            >
                                Export
                            </Button>

                            {/* <Button
                                variant="outlined"
                                startIcon={<FileDown />}
                                onClick={generateAll}
                            >
                                Export All
                            </Button> */}
                        </>
                    )}
                </TableFilter>

                <TableDataGrid
                    data={cheques}
                    filter={filter.search}
                    pagination={handlePagination}
                    handleSearchFilter={handleSearch}
                    handleSortFilter={handleSort}
                    columns={columns}
                />
                {/* </Box> */}
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

            <Modal
                open={openScan}
                onClose={(event, reason) => {
                    // if (reason === 'backdropClick') {
                    //     return;
                    // }
                    setOpenScan(false);
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
