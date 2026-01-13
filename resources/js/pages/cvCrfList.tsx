import useNotifications from '@/components/notifications/useNotifications';
import PageContainer from '@/components/pageContainer';
import TableFilter from '@/components/tableFilter';
import AppLayout from '@/layouts/app-layout';
import { markAsClose } from '@/routes';
import {
    ClosingCheckDetailsType,
    Crf,
    Cv,
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
    Modal,
    SelectChangeEvent,
    Typography,
} from '@mui/material';
import {
    GridFilterModel,
    GridPaginationModel,
    GridSortModel,
} from '@mui/x-data-grid';
import { useState } from 'react';
import {
    createClosingCrfColumns,
    createClosingCvColumns,
} from './closing/components/columns';
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
    defaultCheck,
}: {
    cheques: InertiaPagination<Cv | Crf>;
    company: SelectionType[];
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
    defaultCheck: string;
}) {
    const [check, setCheck] = useState(defaultCheck);
    const [tableLoading, setTableLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [recordDetails, setRecordDetails] =
        useState<ClosingCheckDetailsType | null>(null);
    const notifications = useNotifications();
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
            only: ['crf'],
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
    const handleStatusChange = (data: ClosingCheckDetailsType) => {
        setRecordDetails(data);
        setOpenModal(true);

        // if (check === 'cv') router.visit(signatureDetails(id));
        // else router.visit(detailsCrf(id));
    };
    const handleMarkClose = () => {
        if (recordDetails)
            router.post(
                markAsClose(recordDetails.id),
                {},
                {
                    onSuccess: ({ props }) => {
                        const m = props.flash as FlashReponse;

                        setOpenModal(false);
                        notifications.show(m.message, {
                            severity: 'success',
                            autoHideDuration: 3000,
                        });
                    },
                },
            );
    };

    const cvColumns = createClosingCvColumns(handleStatusChange);
    const crfColumns = createClosingCrfColumns(handleStatusChange);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Check Status">
                <TableFilter
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
        </AppLayout>
    );
}
