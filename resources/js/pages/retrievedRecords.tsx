import BorrowedCheckModal from '@/components/borrowed-check-modal';
import AppLayout from '@/layouts/app-layout';
import { details, detailsCrf, scanCheck, unassignCheck } from '@/routes';
import {
    ActionHandler,
    ActionType,
    Crf,
    Cv,
    DateFilterType,
    DistinctMonths,
    FlashReponse,
    InertiaPagination,
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
import { SyntheticEvent, useEffect, useState } from 'react';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { HandCoins } from 'lucide-react';
import useNotifications from '../components/notifications/useNotifications';
import PageContainer from '../components/pageContainer';
import TableFilter from '../components/tableFilter';
import TableDataGrid from './dashboard/components/TableDataGrid';
import CalendarView from './retrievedRecords/components/calendarView';
import {
    createCrfColumns,
    createCvColumns,
} from './retrievedRecords/components/columns';

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
    // cvEmptyCheckNo,
}: {
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
        tab: string;
    };
    cv: InertiaPagination<Cv>;
    crf: InertiaPagination<Crf>;
    borrowed: InertiaPagination<Cv>;
    // cvEmptyCheckNo: InertiaPagination<Cv>;
    defaultCheck: string;
    distinctMonths: DistinctMonths;
    company: SelectionType[];
}) {
    const [check, setCheck] = useState(defaultCheck);
    const [open, setOpen] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const notifications = useNotifications();
    const [value, setValue] = useState(filter.tab);
    const [selectionModel, setSelectionModel] = useState<SelectionModelType>({
        type: 'include',
        ids: new Set(),
    });

    const { flash } = usePage().props as {
        flash?: { status?: boolean; message?: string };
    };
    useEffect(() => {
        if (flash?.status && flash?.message) {
            notifications.show(flash.message, {
                severity: 'success',
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
        borrow: (id, bu) => {
            // if (!bu) return;
            // setBuBorrow(bu);
            // setCheckId(id);
            // setOpen(true);
        },
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

    const handleRowSelection = (id: number) => {
        setSelectionModel((prev) => {
            const newIds = new Set(prev.ids);

            if (newIds.has(id)) {
                newIds.delete(id); // remove if already selected
            } else {
                newIds.add(id); // add if not selected
            }

            return { ...prev, ids: newIds };
        });
    };

    const hasSelection =
        selectionModel.type === 'include' ? selectionModel.ids.size > 0 : true;
    const cvColumns = createCvColumns(handleStatusChange);
    const crfColumns = createCrfColumns(handleStatusChange);
    // const cvNoCheckNoColumns = createNoCheckNumberColumns(handleStatusChange);

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
                                <Tab label="Table View" value="cv" />
                                <Tab label="Borrowed Checks" value="borrowed" />
                                <Tab label="Manage Checks" value="manage" />
                            </TabList>
                        </Box>
                        <TabPanel value="calendar">
                            <CalendarView distinctMonths={distinctMonths} />
                        </TabPanel>
                        <TabPanel value="cv">
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
                                hasSelection={true}
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
                                    disabled={!hasSelection}
                                    variant="outlined"
                                    startIcon={<HandCoins />}
                                    onClick={() => setOpen(true)}
                                >
                                    Borrow
                                </Button>
                            </Box>
                        </TabPanel>
                        <TabPanel value="borrowed">
                            <TableFilter
                                isCrf={check === 'crf'}
                                handleChangeCheck={handleCheck}
                                company={company}
                                filters={filter}
                                check={check}
                            />

                            <TableDataGrid
                                data={check === 'cv' ? borrowed : crf}
                                filter={filter.search}
                                hasSelection={true}
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
                                    disabled={!hasSelection}
                                    variant="outlined"
                                    startIcon={<HandCoins />}
                                    onClick={() => setOpen(true)}
                                >
                                    Borrow
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
                handleClose={() => setOpen(false)}
            />
        </AppLayout>
    );
}
