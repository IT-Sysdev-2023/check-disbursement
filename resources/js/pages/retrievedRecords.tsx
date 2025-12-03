import BorrowedCheckModal from '@/components/borrowed-check-modal';
import AppLayout from '@/layouts/app-layout';
import { details, detailsCrf, scanCheck } from '@/routes';
import {
    ActionHandler,
    ActionType,
    Crf,
    Cv,
    DateFilterType,
    DistinctMonths,
    FlashReponse,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { router } from '@inertiajs/react';
import { Box, SelectChangeEvent, Tab } from '@mui/material';
import {
    GridFilterModel,
    GridPaginationModel,
    GridSortModel,
} from '@mui/x-data-grid';
import { useState } from 'react';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
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
}: {
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
    cv: InertiaPagination<Cv>;
    crf: InertiaPagination<Crf>;
    defaultCheck: string;
    distinctMonths: DistinctMonths;
    company: SelectionType[];
}) {
    const [check, setCheck] = useState(defaultCheck);
    const [checkId, setCheckId] = useState<number | undefined>();
    const [open, setOpen] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [buBorrow, setBuBorrow] = useState('');
    const handleClose = () => setOpen(false);

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
    const notifications = useNotifications();
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
            if (!bu) return;
            setBuBorrow(bu);
            setCheckId(id);
            setOpen(true);
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
    };

    const handleStatusChange = (id: number, value: ActionType, bu: string) => {
        const handler = actionHandlers[value];
        if (handler) handler(id, bu);
    };

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

    const cvColumns = createCvColumns(handleStatusChange);
    const crfColumns = createCrfColumns(handleStatusChange);

    const [value, setValue] = useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const pageTitle = 'Retrieved CV/CRF';
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <PageContainer title={pageTitle}>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="tabs">
                                <Tab label="CV Calendar View" value="1" />
                                <Tab label="Table View" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <CalendarView distinctMonths={distinctMonths} />
                        </TabPanel>
                        <TabPanel value="2">
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
                                pagination={handlePagination}
                                handleSearchFilter={handleSearch}
                                handleSortFilter={handleSort}
                                columns={
                                    check === 'cv' ? cvColumns : crfColumns
                                }
                                isLoading={tableLoading}
                            />
                        </TabPanel>
                    </TabContext>
                </Box>
            </PageContainer>

            <BorrowedCheckModal
                whichCheck={check}
                checkId={checkId}
                open={open}
                bu={buBorrow}
                handleClose={handleClose}
            />
        </AppLayout>
    );
}
