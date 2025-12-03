import PageContainer from '@/components/pageContainer';
import TableFilter from '@/components/tableFilter';
import AppLayout from '@/layouts/app-layout';
import { checkStatus } from '@/routes';
import {
    Crf,
    Cv,
    DateFilterType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import { Box, Grid, SelectChangeEvent, Stack, Typography } from '@mui/material';
import {
    GridFilterModel,
    GridPaginationModel,
    GridSortModel,
} from '@mui/x-data-grid';
import { useState } from 'react';
import CrfStatusDataGrid from './dashboard/components/CrfStatusDataGrid';
import CvStatusDataGrid from './dashboard/components/CvStatusDataGrid';
import Search from './dashboard/components/Search';
import SelectItem from './dashboard/components/SelectItem';
import TableDataGrid from './dashboard/components/TableDataGrid';
import Copyright from './dashboard/internals/components/Copyright';

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
    const [check, setCheck] = useState('1');
    const [tableLoading, setTableLoading] = useState(false);

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

    const cvColumns = createReleasingCvColumns(handleStatusChange);
    const crfColumns = createReleasingCrfColumns(handleStatusChange);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Check Status">
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

            {/* <Box id="hero" sx={{ px: 3 }}>
                <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                    Check Status
                </Typography>
                <Stack direction="row" sx={{ gap: 3 }}>
                    <Search onSearch={handleSearch} value={search} />
                     <SelectItem
                        handleChange={handleChange}
                        value={bu.value}
                        title="BU"
                        items={permissions}
                    /> *
                    <SelectItem
                        handleChange={handleChangeCheck}
                        value={check}
                        title="Check"
                        items={checks}
                    />
                </Stack>
                <Grid container spacing={2} columns={12} sx={{ mt: 3 }}>
                    {check === '1' && (
                        <CvStatusDataGrid
                            cvs={cv}
                            pagination={handlePagination}
                        />
                    )}

                    {check === '2' && (
                        <CrfStatusDataGrid
                            crf={crf}
                            pagination={handlePagination}
                        />
                    )}
                </Grid>
                <Copyright sx={{ my: 4 }} />
            </Box> */}
        </AppLayout>
    );
}
