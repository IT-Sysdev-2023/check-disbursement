import PageContainer from '@/components/pageContainer';
import ReasonCancellationModal from '@/components/reason-cancellation-modal';
import AppLayout from '@/layouts/app-layout';
import { releaseCheck } from '@/routes';
import {
    Crf,
    Cv,
    DateFilterType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import { SelectChangeEvent } from '@mui/material';
import {
    GridFilterModel,
    GridPaginationModel,
    GridSortModel,
} from '@mui/x-data-grid';
import { useState } from 'react';
import TableFilter from '../components/tableFilter';
import {
    createReleasingCrfColumns,
    createReleasingCvColumns,
} from './checkReleasing/components/columns';
import TableDataGrid from './dashboard/components/TableDataGrid';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Releasing',
        href: '#',
    },
];

export default function CheckReleasing({
    cv,
    crf,
    company,
    defaultCheck,
    filter,
}: {
    cv: InertiaPagination<Cv>;
    crf: InertiaPagination<Crf>;
    defaultCheck: string;
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
    company: SelectionType[];
}) {
    const [check, setCheck] = useState(defaultCheck);
    const [tableLoading, setTableLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [checkId, setCheckId] = useState<number | undefined>(undefined);
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

    const handleStatusChange = (id: number, value: string) => {
        if (value === 'cancel') {
            setCheckId(id);
            setOpen(true);
            return;
        }

        router.push({
            url: releaseCheck([id, value]).url,
            component: 'checkReleasing/releaseCheck',
            props: (curr) => ({
                ...curr,
                id: id,
                status: value,
                label:
                    value.charAt(0).toUpperCase() + value.slice(1) + ' Check',
            }),
        });
    };

    const cvColumns = createReleasingCvColumns(handleStatusChange);
    const crfColumns = createReleasingCrfColumns(handleStatusChange);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Check Releasing">
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
                {/* <Copyright sx={{ my: 4 }} /> */}

                <ReasonCancellationModal
                    checkId={checkId ?? 0}
                    open={open}
                    handleClose={() => {
                        setOpen(false);
                    }}
                />
            </PageContainer>
        </AppLayout>
    );
}
