import BorrowedCheckModal from '@/components/borrowed-check-modal';
import AppLayout from '@/layouts/app-layout';
import {
    details,
    detailsCrf,
    getLocation,
    scan,
    scanCheck,
    unassignCheck,
    updateLocation,
} from '@/routes';
import {
    ActionHandler,
    ActionType,
    Auth,
    BorrowerName,
    Crf,
    Cv,
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
import { Box, Button, SelectChangeEvent, Tab } from '@mui/material';
import {
    GridFilterModel,
    GridPaginationModel,
    GridSortModel,
} from '@mui/x-data-grid';
import { FormEvent, SyntheticEvent, useEffect, useState } from 'react';

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
import CalendarView from './retrievedRecords/components/calendarView';
import {
    createCrfColumns,
    createCvColumns,
    createManageChecksColumns,
} from './retrievedRecords/components/columns';
import ProgressModal from './retrievedRecords/components/progressModal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retrieved CV/CRF',
        href: '#',
    },
];

export default function RetrievedRecords({
    cv,
    crf,
    defaultCheck,
    filter,
    company,
    distinctMonths,
    borrowed,
    hasEmptyCheckNumber,
    manageChecks,
    auth,
}: {
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
        tab: string;
    };
    cv: InertiaPagination<Cv>;
    crf: InertiaPagination<Crf>;
    borrowed: InertiaPagination<BorrowerName>;
    defaultCheck: string;
    distinctMonths: DistinctMonths;
    company: SelectionType[];
    manageChecks: InertiaPagination<ManageChecks>;
    hasEmptyCheckNumber: boolean;
    auth: Auth;
}) {
    const [check, setCheck] = useState(defaultCheck);
    const [open, setOpen] = useState(false);
    const [openProgress, setOpenProgress] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [openTagModal, setOpenTagModal] = useState(false);
    const notifications = useNotifications();
    const [value, setValue] = useState(filter.tab);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [location, setLocation] = useState<
        { label: string; value: string }[]
    >([]);

    const [checkId, setCheckId] = useState<number | undefined>();

    const [selectionModel, setSelectionModel] = useState<SelectionModelType>({
        type: 'include',
        ids: new Set(),
        meta: {},
    });

    const { flash } = usePage().props as {
        flash?: { status?: boolean; message?: string };
    };
    useEffect(() => {
        if (flash?.message) {
            notifications.show(flash.message, {
                severity: flash?.status ? 'success' : 'error',
                autoHideDuration: 3000,
            });
            setCheck('cv');
        }
    }, [flash, notifications]);

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

    const actionHandlers: Record<string, ActionHandler> = {
        details: (id) => {
            if (check === 'cv') router.visit(details(id));
            else router.visit(detailsCrf(id));
        },
        // borrow: (id, bu) => {
        // if (!bu) return;
        // setBuBorrow(bu);
        // setCheckId(id);
        // setOpen(true);
        // },
        scan: (id) => {
            router.post(
                scanCheck(),
                { check, status: null, id },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: (page) => {
                        const m = page.props.flash as FlashReponse;

                        notifications.show(m.message, {
                            severity: 'success',
                            autoHideDuration: 3000,
                        });
                    },
                },
            );
        },
        assign: (id) => {
            router.get(unassignCheck(id));
        },
        tag: async (id) => {
            setCheckId(id);
            setOpenTagModal(true);
            const { data } = await axios.get(getLocation().url);
            setLocation(data);
        },
    };

    const handleStatusChange = (id: number, value: ActionType, bu: string) => {
        const handler = actionHandlers[value];
        if (handler) handler(id, bu);
    };

    const handlePagination = (model: GridPaginationModel, param: string[]) => {
        const page = model.page + 1;
        const per_page = model.pageSize;

        router.reload({
            only: param,
            data: {
                page: page,
                per_page: per_page,
            },
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

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        if (newValue !== 'calendar') {
            router.reload({
                data: {
                    page: 1,
                    tab: newValue,
                },
            });
        }
        setValue(newValue);
    };

    const handleRowSelection = (id: number, taggedAt: string | null) => {
        setSelectionModel((prev) => {
            const ids = new Set(prev.ids);
            const meta = { ...prev.meta };

            if (ids.has(id)) {
                ids.delete(id);
                delete meta[id];
            } else {
                ids.add(id);
                meta[id] = { taggedAt };
            }

            return { ...prev, ids, meta };
        });
    };
    const hasMissingTaggedAt = Array.from(selectionModel.ids).some(
        (id) => selectionModel.meta[id]?.taggedAt == null,
    );

    // const hasSelection =
    //     selectionModel.type === 'include' ? selectionModel.ids.size > 0 : true;
    const cvColumns = createCvColumns(handleStatusChange);
    const crfColumns = createCrfColumns(handleStatusChange);
    const manageChecksColumns = createManageChecksColumns();

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
        if (!checkId) return;
        router.put(
            updateLocation(),
            {
                checkId: checkId,
                locationId: selectedLocation,
                check: check,
            },
            {
                onError: (e) => {
                    console.log(e);
                },
                onSuccess: () => {
                    setOpenTagModal(false);
                },
            },
        );
    };

    const openBorrowModal = () => {
        setOpen(true);
        console.log(selectionModel);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <PageContainer title="Retrieved CV/CRF">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="tabs">
                                <Tab
                                    label="CV Calendar View"
                                    value="calendar"
                                />
                                <Tab label="Table View" value="tableView" />
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
                        <TabPanel value="tableView">
                            <TableFilter
                                isCrf={check === 'crf'}
                                handleChangeCheck={handleCheck}
                                company={company}
                                filters={filter}
                                check={check}
                            />

                            <TableDataGrid
                                data={check === 'cv' ? cv : crf}
                                filter={filter.search}
                                hasSelection={!hasEmptyCheckNumber} //remove selection if there is no check number
                                selectionModel={selectionModel}
                                handleSelectionChange={(model) =>
                                    setSelectionModel(
                                        model as SelectionModelType,
                                    )
                                }
                                handleRowClickSelection={handleRowSelection}
                                pagination={(model) =>
                                    handlePagination(model, ['cv', 'crf'])
                                }
                                handleSearchFilter={handleSearch}
                                handleSortFilter={handleSort}
                                columns={
                                    check === 'cv' ? cvColumns : crfColumns
                                }
                                isLoading={tableLoading}
                            />

                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                mt={3}
                            >
                                <Button
                                    disabled={
                                        hasEmptyCheckNumber ||
                                        hasMissingTaggedAt ||
                                        selectionModel.ids.size === 0
                                    } // !hasSelection &&
                                    variant="outlined"
                                    startIcon={<HandCoins />}
                                    onClick={openBorrowModal}
                                >
                                    Borrow
                                </Button>
                            </Box>
                        </TabPanel>
                        <TabPanel value="borrowed">
                            <BorrowedTableGrid data={borrowed} />
                            {/* <TableFilter
                                isCrf={check === 'crf'}
                                handleChangeCheck={handleCheck}
                                company={company}
                                filters={filter}
                                check={check}
                            />

                            <TableDataGrid
                                data={check === 'cv' ? borrowed : crf}
                                filter={filter.search}
                                selectionModel={selectionModel}
                                handleSelectionChange={(model) =>
                                    setSelectionModel(
                                        model as SelectionModelType,
                                    )
                                }
                                handleRowClickSelection={handleRowSelection}
                                pagination={(model) =>
                                    handlePagination(model, ['cv', 'crf'])
                                }
                                handleSearchFilter={handleSearch}
                                handleSortFilter={handleSort}
                                columns={
                                    check === 'cv' ? cvColumns : crfColumns
                                }
                                isLoading={tableLoading}
                            />

                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                mt={3}
                            >
                                <Button
                                    variant="outlined"
                                    startIcon={<Cloud />}
                                    onClick={handleSyncScanned}
                                >
                                    Sync Check Scanned
                                </Button>
                            </Box> */}
                        </TabPanel>

                        <TabPanel value="manageChecks">
                            <TableDataGrid
                                data={manageChecks}
                                filter={filter.search}
                                hasSelection={false} //remove selection if there is no check number
                                pagination={(model) =>
                                    handlePagination(model, ['cv', 'crf'])
                                }
                                handleSearchFilter={handleSearch}
                                handleSortFilter={handleSort}
                                columns={manageChecksColumns
                                }
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
                whichCheck={check}
                checkId={selectionModel}
                open={open}
                handleClose={handleClose}
            />

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
