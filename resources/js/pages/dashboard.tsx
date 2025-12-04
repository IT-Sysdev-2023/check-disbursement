import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { Crf, Cv, InertiaPagination, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Tab } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import PageViewsBarChart from './dashboard/components/PageViewsBarChart';
import StatCard, { StatCardProps } from './dashboard/components/StatCard';
import TableDataGrid from './dashboard/components/TableDataGrid';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const cvColumns: GridColDef[] = [
    {
        field: 'cvNumber',
        headerName: 'CV Number',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 50,
        renderCell: (params) => {
            const { row } = params;
            return row.cvHeader?.cvNo;
        },
    },
    {
        field: 'cvDate',
        headerName: 'Cv Date',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: (params) => {
            const { row } = params;
            return row.cvHeader?.cvDate;
        },
    },
    {
        field: 'payee',
        headerName: 'Payee',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
    },
    {
        field: 'company',
        headerName: 'Company',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
            const { row } = params;
            return row.company?.name;
        },
    },
];

const crfColumns: GridColDef[] = [
    {
        field: 'crf',
        headerName: 'CRF #',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
    },
    {
        field: 'company',
        headerName: 'Company',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
    },
    {
        field: 'no',
        headerName: 'No.',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
    },
    {
        field: 'ckNo',
        headerName: 'CK No.',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
    },
];

export default function Dashboard({
    cv,
    crf,
    totals,
    chart,
}: {
    cv: InertiaPagination<Cv>;
    crf: InertiaPagination<Crf>;
    totals: {
        cv: string;
        crf: string;
        total: string;
    };
    chart: {
        months: string[];
        totals: number[];
        countCv: string;
        countCrf: string;
    };
}) {
    const data: StatCardProps[] = [
        {
            title: 'Total Cheques',
            value: totals.total,
            interval: 'Last 30 days',
            trend: 'up',
            data: [
                200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320,
                360, 340, 380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480,
                460, 600, 880, 920,
            ],
        },
        {
            title: 'Total CV Generated',
            value: totals.cv,
            interval: 'Last 30 days',
            trend: 'down',
            data: [
                1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820,
                840, 600, 820, 780, 800, 760, 380, 740, 660, 620, 840, 500, 520,
                480, 400, 360, 300, 220,
            ],
        },
        {
            title: 'Total CRF Generated',
            value: totals.crf,
            interval: 'Last 30 days',
            trend: 'neutral',
            data: [
                500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530,
                620, 510, 530, 520, 410, 530, 520, 610, 530, 520, 610, 530, 420,
                510, 430, 520, 510,
            ],
        },
    ];
    const [value, setValue] = useState('cv');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: { sm: '100%', md: '1700px' },
                    }}
                >
                    {/* cards */}
                    <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                        Overview
                    </Typography>
                    <Grid
                        container
                        spacing={2}
                        columns={12}
                        sx={{ mb: (theme) => theme.spacing(2) }}
                    >
                        {data.map((card, index) => (
                            <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
                                <StatCard {...card} />
                            </Grid>
                        ))}
                        {/* <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <HighlightedCard />
                        </Grid> */}
                        <Grid size={{ xs: 12, md: 12 }}>
                            {/* <SessionsChart />
                             */}

                            <TabContext value={value}>
                                <Box
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: 'divider',
                                    }}
                                >
                                    <TabList
                                        onChange={handleChange}
                                        aria-label="lab API tabs example"
                                    >
                                        <Tab label="CV" value="cv" />
                                        <Tab label="CRF" value="crf" />
                                    </TabList>
                                </Box>
                                <TabPanel value="cv">
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <PageViewsBarChart
                                                data={chart}
                                                label="Check Voucher"
                                                count={chart.countCv}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TableDataGrid
                                                data={cv}
                                                pagination={() => null}
                                                handleSearchFilter={() => null}
                                                handleSortFilter={() => null}
                                                columns={cvColumns}
                                                isLoading={false}
                                                density="compact"
                                            />
                                        </Grid>
                                    </Grid>
                                </TabPanel>
                                <TabPanel value="crf">
                                    {' '}
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <PageViewsBarChart
                                                data={chart}
                                                label="Check Request Form"
                                                count={chart.countCrf}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TableDataGrid
                                                data={crf}
                                                pagination={() => null}
                                                handleSearchFilter={() => null}
                                                handleSortFilter={() => null}
                                                columns={crfColumns}
                                                isLoading={false}
                                                density="compact"
                                            />
                                        </Grid>
                                    </Grid>
                                </TabPanel>
                            </TabContext>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </AppLayout>
    );
}
