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
import { SelectChangeEvent } from '@mui/material';
import {
    GridFilterModel,
    GridPaginationModel,
    GridSortModel,
} from '@mui/x-data-grid';
import { useState } from 'react';

import useNotifications from '../components/notifications/useNotifications';
import PageContainer from '../components/pageContainer';
import TableDataGrid from './dashboard/components/TableDataGrid';
import CalendarView from './retrievedRecords/components/calendarView';
import {
    createCrfColumns,
    createCvColumns,
} from './retrievedRecords/components/columns';
import TableFilter from './retrievedRecords/components/tableFilter';

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
            preserveScroll: true,
            preserveState: true,
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
            preserveState: true,
            preserveScroll: true,
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
            preserveScroll: true, //Dont Remove( Mugana ni.. gibitok ra ang vs code)
            preserveState: true,
        });
    };

    const handleCheck = (event: SelectChangeEvent) => {
        setCheck(event.target.value);
        router.reload({
            data: {
                selectedCheck: event.target.value,
            },
            preserveScroll: true, //Dont bother with the line error( Mugana ni.. gibitok ra ang vs code)
            only: ['crf'],
            replace: true,
            onStart: () => setTableLoading(true),
            onFinish: () => setTableLoading(false),
        });
    };

    const cvColumns = createCvColumns(handleStatusChange);
    const crfColumns = createCrfColumns(handleStatusChange);

    const pageTitle = 'Retrieved CV/CRF';
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <PageContainer title={pageTitle}>
                <CalendarView distinctMonths={distinctMonths} />
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
                    columns={check === 'cv' ? cvColumns : crfColumns}
                    isLoading={tableLoading}
                />
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
