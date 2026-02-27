import AppLayout from '@/layouts/app-layout';
import {
    details,
    detailsCrf,
    getLocation,
    retrievedRecords,
    tagLocation,
} from '@/routes';
import {
    ActionHandler,
    ActionType,
    Auth,
    Borrower,
    ChequeType,
    DateFilterType,
    DistinctMonths,
    InertiaPagination,
    ManageChecks,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { router } from '@inertiajs/react';
import { Badge, Box, Button, Tab } from '@mui/material';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { FormEvent, SyntheticEvent, useState } from 'react';

import BorrowedCheckModal from '@/components/borrowed-check-modal';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import axios from 'axios';
import { HandCoins } from 'lucide-react';
import PageContainer from '../components/pageContainer';
import TableFilter from '../components/tableFilter';
import OnlySelectionModal from './dashboard/components/onlySelectionModal';
import TableDataGrid from './dashboard/components/TableDataGrid';
import AssignCdModal from './retrievedRecords/components/assignCdModal';
import AssignCnModal from './retrievedRecords/components/assignCnModal';
import AssignScanDetailsModal from './retrievedRecords/components/assignScanDetailsModal';
import {
    createChequeColumns,
    createManageColumns,
    createPendingChequeColumns,
} from './retrievedRecords/components/columns';
import PendingDetails from './retrievedRecords/components/pendingDetails';
import ProgressModal from './retrievedRecords/components/progressModal';
import ScanDetails from './retrievedRecords/components/scanDetails';
import Calendar from './retrievedRecords/components/calendar';

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
    // hasMissingFields,
    auth,
}: {
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
        tab: string;
    };
    counts: {
        toAssign: string;
        completed: string;
    };
    calendar: any,
    cheques: InertiaPagination<ChequeType>;
    pending: InertiaPagination<Borrower>;
    company: SelectionType[];
    manageChecks: InertiaPagination<ManageChecks>;
    auth: Auth;
}) {
    const [open, setOpen] = useState(false);
    const [openProgress, setOpenProgress] = useState(false);
    const [openTagModal, setOpenTagModal] = useState(false);
    const [openAssignCnModal, setOpenAssignCnModal] = useState(false);
    const [openAssignCdModal, setOpenAssignCdModal] = useState(false);
    const [openInputDetails, setOpenInputDetails] = useState(false);
    const [scannedDetailsModal, setScannedDetailsModal] = useState(false);
    const [scannedId, setScannedId] = useState<number>();
    const [checkRecords, setCheckRecords] = useState<number>();
    const [currentTab, setCurrentTab] = useState(filter.tab);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [location, setLocation] = useState<
        { label: string; value: string }[]
    >([]);
    const [chequeData, setChequeData] = useState<ChequeType | null>(null);
    // const [assign, setAssin] = useState(filter.assignment);
    const [pendingId, setPendingId] = useState<number>();
    const [pendingModal, setPendingModal] = useState(false);

    const [selectedRows, setSelectedRows] = useState<
        { chequeId: number; type: string; id: number }[]
    >([]);

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

    const handleSelectionChange = (model: GridRowSelectionModel) => {
        const selectedR = cheques.data
            .filter((row) => model.ids.has(row.id))
            .map((row) => ({
                id: row.id,
                chequeId: row.chequeId,
                type: row.type,
            }));

        setSelectedRows(selectedR);
    };
    const enableButton =
        selectedRows.length > 0 &&
        cheques.data
            .filter((row) => selectedRows.some((r) => r.id === row.id))
            .every((row) => row.taggedAt !== null);

    const actionHandlers: Record<string, ActionHandler> = {
        details: (record) => {
            if (!record) return;
            if (record.type === 'cv') router.visit(details(record.chequeId));
            else router.visit(detailsCrf(record.chequeId));
        },
        assignCn: (record) => {
            setChequeData(record || null);
            setOpenAssignCnModal(true);
        },
        assignCd: (record) => {
            setChequeData(record || null);
            setOpenAssignCdModal(true);
        },
        tag: async (record) => {
            setChequeData(record || null);
            setOpenTagModal(true);
            const { data } = await axios.get(getLocation().url);
            setLocation(data);
        },
    };

    const handleStatusChange = (value: ActionType, data: ChequeType) => {
        const handler = actionHandlers[value];
        if (handler) handler(data);
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
    //             onSuccess: ({ props }) => {
    //                 const m = props.flash as FlashReponse;

    //                 setOpenProgress(false);
    //                 notifications.show(m.message, {
    //                     severity: 'error',
    //                     autoHideDuration: 3000,
    //                 });
    //             },
    //         },
    //     );
    // };

    const handleTagSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!chequeData) return;

        router.put(
            tagLocation(),
            {
                id: chequeData.chequeId,
                locationId: selectedLocation,
                type: chequeData.type,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedLocation('');
                    setOpenTagModal(false);
                },
            },
        );
    };

    const handleUpdateScanned = (borrowedCheckId: number) => {
        setOpenInputDetails(true);

        if (borrowedCheckId) setCheckRecords(borrowedCheckId);
    };

    const handleAssignment = (value: 'completed' | 'toAssign') => {
        router.reload({
            only: ['cheques'],
            data: {
                assignment: value,
            },
        });
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

    const chequeColumns = createChequeColumns(handleStatusChange);
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
                            <Calendar data={calendar} onChangeTab={() => setCurrentTab('cheques')}></Calendar>
                        </TabPanel>
                        <TabPanel value="cheques">
                            <TableFilter
                                handleChangeCheck={() => null}
                                company={company}
                                filters={filter}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={() => handleAssignment('toAssign')}
                                >
                                    <Badge
                                        badgeContent={counts.toAssign}
                                        color="error"
                                    >
                                        Assignment
                                    </Badge>
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        handleAssignment('completed')
                                    }
                                >
                                    <Badge
                                        badgeContent={counts.completed}
                                        color="error"
                                    >
                                        Completed
                                    </Badge>
                                </Button>
                            </TableFilter>
                            <TableDataGrid
                                data={cheques}
                                filter={filter.search}
                                hasSelection
                                handleSelectionChange={handleSelectionChange}
                                pagination={handlePagination}
                                handleSearchFilter={handleSearch}
                                handleSortFilter={handleSort}
                                columns={chequeColumns}
                            />
                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                mt={3}
                            >
                                <Button
                                    disabled={!enableButton}
                                    variant="outlined"
                                    startIcon={<HandCoins />}
                                    onClick={() => setOpen(true)}
                                >
                                    Borrow
                                </Button>
                            </Box>
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

            <BorrowedCheckModal
                cheque={selectedRows}
                open={open}
                handleClose={() => setOpen(false)}
            />

            {chequeData && (
                <AssignCnModal
                    title="Assign Check Number"
                    open={openAssignCnModal}
                    chequeData={chequeData}
                    onClose={() => setOpenAssignCnModal(false)}
                />
            )}

            {chequeData && (
                <AssignCdModal
                    title="Assign Check Date"
                    open={openAssignCdModal}
                    chequeData={chequeData}
                    onClose={() => setOpenAssignCdModal(false)}
                />
            )}
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

            <OnlySelectionModal
                title="Tag Location"
                open={openTagModal}
                onClose={() => setOpenTagModal(false)}
                handleSubmit={handleTagSubmit}
                handleSelectedItem={(event) =>
                    setSelectedLocation(event.target.value)
                }
                selectedItem={selectedLocation}
                item={location}
            />

            <ProgressModal
                userId={auth.user.id}
                open={openProgress}
                handleClose={() => setOpenProgress(false)}
            />
        </AppLayout>
    );
}
