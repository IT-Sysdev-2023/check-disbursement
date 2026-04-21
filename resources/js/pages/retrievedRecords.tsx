import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { details, detailsCrf, retrievedRecords } from '@/routes';
import {
    Auth,
    Borrower,
    BuType,
    ChequeType,
    FilterType,
    InertiaPagination,
    ManageChecks,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { router } from '@inertiajs/react';
import {
    AdfScannerOutlined,
    CalendarToday,
    DocumentScanner,
    SwipeVertical,
    ViewCompact,
} from '@mui/icons-material';
import { Box, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import PageContainer from '../components/pageContainer';
import TableFilter from '../components/tableFilter';
import BorrowedTableGrid from './dashboard/components/borrowedTableGrid';
import TableDataGrid from './dashboard/components/TableDataGrid';
import {
    AssignScanDetailsModal,
    Calendar,
    createManageColumns,
    ProgressModal,
    ScanDetails,
    TableView,
} from './retrievedRecords/components';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retrieved CV/CRF',
        href: '#',
    },
];

export default function RetrievedRecords({
    cheques,
    manageChecks,
    pending,
    filter,
    company,
    counts,
    calendar,
    businessUnits,
    auth,
}: {
    filter: FilterType;
    counts: {
        toAssign: string;
        completed: string;
    };
    businessUnits: SelectionType[];
    calendar: InertiaPagination<BuType>;
    cheques: InertiaPagination<ChequeType>;
    pending: InertiaPagination<Borrower>;
    company: SelectionType[];
    manageChecks: InertiaPagination<ManageChecks>;
    auth: Auth;
}) {
    const [openProgress, setOpenProgress] = useState(false);
    const [openInputDetails, setOpenInputDetails] = useState(false);
    const [scannedDetailsModal, setScannedDetailsModal] = useState(false);
    const [scannedId, setScannedId] = useState<number>();
    const [checkRecords, setCheckRecords] = useState({});
    const [currentTab, setCurrentTab] = useState(filter.tab);
    // const [pendingId, setPendingId] = useState<number>();
    // const [pendingModal, setPendingModal] = useState(false);

    const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
        if (newValue === null) return;
        if (newValue !== 'calendar') {
            router.reload({
                data: {
                    tab: newValue,
                    page: 1,
                },
                replace: false,
            });
        }

        setCurrentTab(newValue);
    };
    const handleSyncScanned = () => {
        // router.get(
        //     scan(),
        //     {},
        //     {
        //         preserveState: true,
        //         preserveScroll: true,
        //         onStart: () => {
        //             setOpenProgress(true);
        //         },
        //         onSuccess: () => {
        //             setOpenProgress(false);
        //         },
        //     },
        // );
    };

    const handleUpdateScanned = (details) => {
        setOpenInputDetails(true);

        if (details) setCheckRecords(details);
    };

    const handleClickCalendar = () => {
        setCurrentTab('cheques');
    };

    const handleScanDetails = (id: number) => {
        setScannedDetailsModal(true);
        setScannedId(id);
    };

    const handleDetails = (id: number, type: 'cv' | 'crf') => {
        if (type === 'cv') router.visit(details(id));
        else router.visit(detailsCrf(id));
    };

    // const handleOnView = (id: number) => {
    //     setPendingModal(true);
    //     setPendingId(id);
    // };

    // const pendingColumns = createPendingChequeColumns(handleOnView);
    const manageCvColumns = createManageColumns(
        handleDetails,
        handleUpdateScanned,
        handleScanDetails,
    );
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <PageContainer title="Retrieved CV/CRF">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <ToggleButtonGroup
                        color="primary"
                        value={currentTab}
                        exclusive
                        onChange={handleChangeTab}
                        aria-label="Platform"
                    >
                        <ToggleButton value="calendar">
                            <CalendarToday sx={{ mr: 1, fontSize: 18 }} />
                            Calendar View
                        </ToggleButton>
                        <ToggleButton value="cheques">
                            <ViewCompact sx={{ mr: 1, fontSize: 18 }} />
                            Table View
                        </ToggleButton>
                        <ToggleButton value="borrowed">
                            <SwipeVertical sx={{ mr: 1, fontSize: 18 }} />
                            Borrowed Cheques
                        </ToggleButton>
                        <ToggleButton value="manageChecks">
                            <AdfScannerOutlined sx={{ mr: 1, fontSize: 18 }} />
                            Manage Cheques
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <Box sx={{ mt: 5 }}>
                        {currentTab === 'calendar' && (
                            <Calendar
                                userId={auth.user.id}
                                data={calendar}
                                company={company}
                                onChangeTab={handleClickCalendar}
                            ></Calendar>
                        )}
                        {currentTab === 'cheques' && (
                            <TableView
                                cheques={cheques}
                                company={company}
                                businessUnits={businessUnits}
                                filter={filter}
                                counts={counts}
                            />
                        )}
                        {currentTab === 'borrowed' && (
                                <BorrowedTableGrid data={pending} />
                        )}
                        {currentTab === 'manageChecks' && (
                            <>
                                <TableFilter
                                    handleChangeCheck={() => null}
                                    company={company}
                                    filters={filter}
                                    resetFilterRouter={retrievedRecords()}
                                    businessUnits={businessUnits}
                                />
                                <TableDataGrid
                                    data={manageChecks}
                                    filter={filter.search}
                                    pagination={handlePagination}
                                    handleSearchFilter={handleSearch}
                                    handleSortFilter={handleSort}
                                    columns={manageCvColumns}
                                />

                                <Box
                                    display="flex"
                                    justifyContent="flex-end"
                                    mt={3}
                                >
                                    <Button
                                        variant="outlined"
                                        startIcon={<DocumentScanner />}
                                        onClick={handleSyncScanned}
                                    >
                                        Sync Check Scanned
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </PageContainer>

            {/* scannedDetailsModal */}
            {scannedId && (
                <ScanDetails
                    id={scannedId}
                    title="Scanned Check Details"
                    open={scannedDetailsModal}
                    onClose={() => setScannedDetailsModal(false)}
                />
            )}
            {/* 
            {pendingId && (
                <PendingDetails
                    id={pendingId}
                    title="Check Details"
                    open={pendingModal}
                    onClose={() => setPendingModal(false)}
                />
            )} */}

            {checkRecords && (
                <AssignScanDetailsModal
                    borrowedCheckId={checkRecords}
                    title="Input Check Details"
                    open={openInputDetails}
                    onClose={() => setOpenInputDetails(false)}
                />
            )}

            <ProgressModal
                userId={auth.user.id}
                open={openProgress}
                handleClose={() => setOpenProgress(false)}
            />
        </AppLayout>
    );
}
