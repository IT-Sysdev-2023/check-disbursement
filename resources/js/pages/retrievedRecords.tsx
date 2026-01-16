import BorrowedCheckModal from '@/components/borrowed-check-modal';
import AppLayout from '@/layouts/app-layout';
import { details, detailsCrf, getLocation, scan, tagLocation } from '@/routes';
import {
    ActionHandler,
    ActionType,
    Auth,
    Borrower,
    ChequeType,
    DateFilterType,
    DistinctMonths,
    FlashReponse,
    InertiaPagination,
    ManageChecks,
    SelectionModelType,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Box, Button, Tab } from '@mui/material';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { FormEvent, SyntheticEvent, useEffect, useState } from 'react';

import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import axios from 'axios';
import { HandCoins } from 'lucide-react';
import useNotifications from '../components/notifications/useNotifications';
import PageContainer from '../components/pageContainer';
import TableFilter from '../components/tableFilter';
import BorrowedTableGrid from './dashboard/components/borrowedTableGrid';
import OnlySelectionModal from './dashboard/components/onlySelectionModal';
import TableDataGrid from './dashboard/components/TableDataGrid';
import AssignCdModal from './retrievedRecords/components/assignCdModal';
import AssignCnModal from './retrievedRecords/components/assignCnModal';
import CalendarView from './retrievedRecords/components/calendarView';
import {
    createChequeColumns,
    createManageCvColumns,
} from './retrievedRecords/components/columns';
import ProgressModal from './retrievedRecords/components/progressModal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retrieved CV/CRF',
        href: '#',
    },
];

export default function RetrievedRecords({
    cheques,
    filter,
    company,
    distinctMonths,
    borrowed,
    manageChecks,
    auth,
}: {
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
        tab: string;
    };
    cheques: InertiaPagination<ChequeType>;
    borrowed: InertiaPagination<Borrower>;
    distinctMonths: DistinctMonths;
    company: SelectionType[];
    manageChecks: InertiaPagination<ManageChecks>;
    auth: Auth;
}) {
    const [open, setOpen] = useState(false);
    const [openProgress, setOpenProgress] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [openTagModal, setOpenTagModal] = useState(false);
    const [openAssignCnModal, setOpenAssignCnModal] = useState(false);
    const [openAssignCdModal, setOpenAssignCdModal] = useState(false);
    const [currentTab, setCurrentTab] = useState(filter.tab);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [location, setLocation] = useState<
        { label: string; value: string }[]
    >([]);
    const [chequeData, setChequeData] = useState<ChequeType | null>(null);
    const [selectionModel, setSelectionModel] = useState<SelectionModelType>({
        type: 'include',
        ids: new Set(),
        meta: {},
    });

    const notifications = useNotifications();
    const { flash } = usePage().props as {
        flash?: { status?: boolean; message?: string };
    };
    useEffect(() => {
        if (flash?.message) {
            notifications.show(flash.message, {
                severity: flash?.status ? 'success' : 'error',
                autoHideDuration: 3000,
            });
        }
    }, [flash, notifications]);

    const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
        if (newValue !== 'calendar') {
            router.reload({
                data: {
                    page: 1,
                    tab: newValue,
                },
                only: [newValue],
            });
        }
        setCurrentTab(newValue);
    };

    const handleRowSelection = (id: number) => {
        setSelectionModel((prev) => {
            const ids = new Set(prev.ids);
            if (ids.has(id)) {
                ids.delete(id);
            } else {
                ids.add(id);
            }
            return { ...prev, ids };
        });
    };

    const enableButton =
        selectionModel.ids.size > 0 &&
        cheques.data
            .filter((row) => selectionModel.ids.has(row.id))
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

    const chequeColumns = createChequeColumns(handleStatusChange);
    const manageCvColumns = createManageCvColumns();

    const handleClose = () => {
        setOpen(false);
        setSelectionModel({
            type: 'include',
            ids: new Set(),
            meta: {},
        });
    };

    const handleSyncScanned = () => {
        router.get(
            scan(),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onStart: () => {
                    setOpenProgress(true);
                },
                onSuccess: ({ props }) => {
                    const m = props.flash as FlashReponse;

                    setOpenProgress(false);
                    notifications.show(m.message, {
                        severity: 'error',
                        autoHideDuration: 3000,
                    });
                },
            },
        );
    };

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
                onError: (e) => {
                    console.log(e);
                },
                onSuccess: () => {
                    setOpenTagModal(false);
                },
            },
        );
    };

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
                                <Tab label="Borrowed Checks" value="borrowed" />
                                <Tab
                                    label="Manage Checks"
                                    value="manageChecks"
                                />
                            </TabList>
                        </Box>
                        <TabPanel value="calendar">
                            <CalendarView distinctMonths={distinctMonths} />
                        </TabPanel>
                        <TabPanel value="cheques">
                            <TableFilter
                                currentTab={currentTab}
                                handleChangeCheck={() => null}
                                company={company}
                                filters={filter}
                            />

                            <TableDataGrid
                                data={cheques}
                                filter={filter.search}
                                hasSelection={true}
                                // hasSelection={!hasEmptyCheckNumber} //remove selection if there is no check number
                                selectionModel={selectionModel}
                                handleSelectionChange={(model) =>
                                    setSelectionModel(
                                        model as SelectionModelType,
                                    )
                                }
                                handleRowClickSelection={handleRowSelection}
                                pagination={handlePagination}
                                handleSearchFilter={handleSearch}
                                handleSortFilter={handleSort}
                                columns={chequeColumns}
                                isLoading={tableLoading}
                            />

                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                mt={3}
                            >
                                <Button
                                    disabled={
                                        // hasEmptyCheckNumber ||
                                        !enableButton
                                    } // !hasSelection &&
                                    variant="outlined"
                                    startIcon={<HandCoins />}
                                    onClick={() => setOpen(true)}
                                >
                                    Borrow
                                </Button>
                            </Box>
                        </TabPanel>
                        <TabPanel value="borrowed">
                            {/* DATE PICKER ONLY FOR FILTERING*/}
                            <BorrowedTableGrid data={borrowed} />
                        </TabPanel>

                        <TabPanel value="manageChecks">
                            <TableFilter
                                currentTab={currentTab}
                                handleChangeCheck={() => null}
                                company={company}
                                filters={filter}
                            />
                            <TableDataGrid
                                data={manageChecks}
                                filter={filter.search}
                                hasSelection={false} //remove selection if there is no check number
                                pagination={handlePagination}
                                handleSearchFilter={handleSearch}
                                handleSortFilter={handleSort}
                                columns={manageCvColumns}
                                isLoading={tableLoading}
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
                        </TabPanel>
                    </TabContext>
                </Box>
            </PageContainer>

            <BorrowedCheckModal
                whichCheck={'cv'} // check
                checkId={selectionModel}
                open={open}
                handleClose={handleClose}
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
