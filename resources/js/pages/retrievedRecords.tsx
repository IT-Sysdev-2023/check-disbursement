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
    MonthType,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { router } from '@inertiajs/react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import SwipeVerticalIcon from '@mui/icons-material/SwipeVertical';
import AdfScannerOutlinedIcon from '@mui/icons-material/AdfScannerOutlined';
import { Box, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import PageContainer from '../components/pageContainer';
import TableFilter from '../components/tableFilter';
import BorrowedTableGrid from './dashboard/components/borrowedTableGrid';
import TableDataGrid from './dashboard/components/TableDataGrid';
import AssignScanDetailsModal from './retrievedRecords/components/assignScanDetailsModal';
import Calendar from './retrievedRecords/components/calendar';
import { createManageColumns } from './retrievedRecords/components/columns';
import ProgressModal from './retrievedRecords/components/progressModal';
import ScanDetails from './retrievedRecords/components/scanDetails';
import TableView from './retrievedRecords/components/tableView';
import { HandCoins } from 'lucide-react';

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
    calendar: BuType[];
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
        if(newValue === null) return;
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
                            <CalendarTodayIcon sx={{ mr: 1, fontSize: 18 }} />
                            Calendar View
                        </ToggleButton>
                        <ToggleButton value="cheques">
                            <ViewCompactIcon sx={{ mr: 1, fontSize: 18 }} />
                            Table View
                        </ToggleButton>
                        <ToggleButton value="borrowed">
                            <SwipeVerticalIcon sx={{ mr: 1, fontSize: 18 }} />
                            Borrowed Cheques
                        </ToggleButton>
                        <ToggleButton value="manageChecks">
                            <AdfScannerOutlinedIcon sx={{ mr: 1, fontSize: 18 }} />
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
                            <>
                                <BorrowedTableGrid data={pending} />
                                {/* <TableDataGrid
                                data={pending}
                                filter={filter.search}
                                pagination={handlePagination}
                                handleSearchFilter={handleSearch}
                                handleSortFilter={handleSort}
                                columns={pendingColumns}
                            /> */}
                            </>
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
                                    startIcon={<HandCoins />}
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
