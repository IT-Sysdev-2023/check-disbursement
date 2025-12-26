import PageContainer from '@/components/pageContainer';
import TableFilter from '@/components/tableFilter';
import AppLayout from '@/layouts/app-layout';
import { details, detailsCrf } from '@/routes';
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
import {
    createStatusCrfColumns,
    createStatusCvColumns,
} from './checkStatus/components/columns';
import TableDataGrid from './dashboard/components/TableDataGrid';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Status',
        href: '#',
    },
];

export default function CheckStatus({
    cv,
    crf,
    company,
    filter,
    defaultCheck,
}: {
    cv: InertiaPagination<Cv>;
    crf: InertiaPagination<Crf>;
    company: SelectionType[];
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
    defaultCheck: string;
}) {
    const [check, setCheck] = useState(defaultCheck);
    const [tableLoading, setTableLoading] = useState(false);

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
        if (value === 'details') {
            if (check === 'cv') router.visit(details(id));
            else router.visit(detailsCrf(id));
        }
    };

    const cvColumns = createStatusCvColumns(handleStatusChange);
    const crfColumns = createStatusCrfColumns(handleStatusChange);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Check Status">
                <TableFilter
                    // current
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
        </AppLayout>
    );
}
