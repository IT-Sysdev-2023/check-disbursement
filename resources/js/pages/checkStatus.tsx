import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { checkStatus } from '@/routes';
import { Auth, Crf, Cv, InertiaPagination, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Box, Grid, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { GridPaginationModel } from '@mui/x-data-grid';
import { useState } from 'react';
import CrfStatusDataGrid from './dashboard/components/CrfStatusDataGrid';
import CvStatusDataGrid from './dashboard/components/CvStatusDataGrid';
import Search from './dashboard/components/Search';
import SelectItem from './dashboard/components/SelectItem';
import Copyright from './dashboard/internals/components/Copyright';
import TableFilter from '@/components/tableFilter';
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
    auth,
}: {
    cv: InertiaPagination<Cv>;
    crf: InertiaPagination<Crf>;
    auth: Auth;
}) {
    const [bu, setBu] = useState<{ label: string; value: string }>({
        label: '',
        value: '',
    });
    console.log(crf);

    const [check, setCheck] = useState('1');

    const [search, setSearch] = useState('');
    const permissions =
        auth.user?.permissions?.map((r) => ({ value: r.id, label: r.name })) ||
        [];

    const checks = [
        { value: '1', label: 'CV' },
        { value: '2', label: 'CRF' },
    ];

    const handleChangeCheck = (event: SelectChangeEvent) => {
        setCheck(event.target.value);

        router.get(
            checkStatus(),
            { bu: bu.label },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const handlePagination = (model: GridPaginationModel) => {
        const page = model.page + 1; // MUI DataGrid uses 0-based index
        const per_page = model.pageSize;

        router.get(
            checkStatus(),
            { page, per_page, bu: bu.label },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleSearch = (value: string) => {
        setSearch(value);

        router.get(
            checkStatus(),
            { search: value, bu: bu.label },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

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

            <Box id="hero" sx={{ px: 3 }}>
                <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                    Check Status
                </Typography>
                <Stack direction="row" sx={{ gap: 3 }}>
                    <Search onSearch={handleSearch} value={search} />
                    {/* <SelectItem
                        handleChange={handleChange}
                        value={bu.value}
                        title="BU"
                        items={permissions}
                    /> */}
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
            </Box>
        </AppLayout>
    );
}
