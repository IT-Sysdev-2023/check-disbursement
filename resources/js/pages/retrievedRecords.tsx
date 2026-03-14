import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { details, detailsCrf, retrievedRecords } from '@/routes';
import {
    Auth,
    Borrower,
    ChequeType,
    DateFilterType,
    InertiaPagination,
    ManageChecks,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { router } from '@inertiajs/react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Tab } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import PageContainer from '../components/pageContainer';
import TableFilter from '../components/tableFilter';
import TableDataGrid from './dashboard/components/TableDataGrid';
import AssignScanDetailsModal from './retrievedRecords/components/assignScanDetailsModal';
import Calendar from './retrievedRecords/components/calendar';
import {
    createManageColumns,
    createPendingChequeColumns,
} from './retrievedRecords/components/columns';
import PendingDetails from './retrievedRecords/components/pendingDetails';
import ProgressModal from './retrievedRecords/components/progressModal';
import ScanDetails from './retrievedRecords/components/scanDetails';
import TableView from './retrievedRecords/components/tableView';

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
    filter: {
        selectedCompany: string;
        selectedBu: string;
        search: string;
        date: DateFilterType;
        tab: string;
    };
    counts: {
        toAssign: string;
        completed: string;
    };
    businessUnits: SelectionType[];
    calendar: any;
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
    const [checkRecords, setCheckRecords] = useState<number>();
    const [currentTab, setCurrentTab] = useState(filter.tab);
    const [pendingId, setPendingId] = useState<number>();
    const [pendingModal, setPendingModal] = useState(false);

    const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
        if (newValue !== 'calendar') {
            router.get(
                retrievedRecords(),
                {
                    tab: newValue,
                    page: 1,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: false,
                },
            );
        }
        setCurrentTab(newValue);
    };
    // const handleSyncScanned = () => {
    //     router.get(
    //         scan(),
    //         {},
    //         {
    //             preserveState: true,
    //             preserveScroll: true,
    //             onStart: () => {
    //                 setOpenProgress(true);
    //             },
    //             onSuccess: () => {

    //                 setOpenProgress(false);
    //             },
    //         },
    //     );
    // };

    const handleUpdateScanned = (borrowedCheckId: number) => {
        setOpenInputDetails(true);

        if (borrowedCheckId) setCheckRecords(borrowedCheckId);
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

    const handleOnView = (id: number) => {
        setPendingModal(true);
        setPendingId(id);
    };

    const pendingColumns = createPendingChequeColumns(handleOnView);
    const manageCvColumns = createManageColumns(
        handleDetails,
        handleUpdateScanned,
        handleScanDetails,
    );
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <PageContainer title="Retrieved CV/CRF">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={currentTab}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList
                                onChange={handleChangeTab}
                                aria-label="tabs"
                            >
                                <Tab
                                    label="CV Calendar View"
                                    value="calendar"
                                />
                                <Tab label="Table View" value="cheques" />
                                <Tab label="Borrowed Checks" value="pending" />
                                <Tab
                                    label="Manage Checks"
                                    value="manageChecks"
                                />
                            </TabList>
                        </Box>
                        <TabPanel value="calendar">
                            <Calendar
                                data={calendar}
                                onChangeTab={handleClickCalendar}
                            ></Calendar>
                        </TabPanel>
                        <TabPanel value="cheques">
                            <TableView
                                cheques={cheques}
                                company={company}
                                businessUnits={businessUnits}
                                filter={filter}
                                counts={counts}
                            />
                        </TabPanel>

                        <TabPanel value="pending">
                            <TableDataGrid
                                data={pending}
                                filter={filter.search}
                                pagination={handlePagination}
                                handleSearchFilter={handleSearch}
                                handleSortFilter={handleSort}
                                columns={pendingColumns}
                            />
                        </TabPanel>

                        <TabPanel value="manageChecks">
                            <TableFilter
                                handleChangeCheck={() => null}
                                company={company}
                                filters={filter}
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

                            {/* <Box
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
                            </Box> */}
                        </TabPanel>
                    </TabContext>
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

            {pendingId && (
                <PendingDetails
                    id={pendingId}
                    title="Check Details"
                    open={pendingModal}
                    onClose={() => setPendingModal(false)}
                />
            )}

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
