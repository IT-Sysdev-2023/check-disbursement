import { requestNotificationPermission } from '@/components/notification';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import {
    ChequeType,
    FilterType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import { SelectChangeEvent, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import CustomizedDataGrid from './dashboard/components/dashboardTable';
import PageViewsBarChart from './dashboard/components/PageViewsBarChart';
import SelectItem from './dashboard/components/SelectItem';
import SessionsChart from './dashboard/components/SessionsChart';
import StatCard, { StatCardProps } from './dashboard/components/StatCard';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({
    cheques,
    totals,
    chart,
    bu,
    company,
    businessUnits,
    bankAccounts,
    filters,
    banks,
}: {
    cheques: InertiaPagination<ChequeType>;
    businessUnits: SelectionType[];
    filters: FilterType;
    totals: {
        cv: string;
        crf: string;
        total: string;
    };
    bu: SelectionType[];
    chart: {
        cvChart: { labels: string[]; data: number[]; borrowedChecks: number[] };
        crfChart: { labels: string[]; data: number[] };
        countCv: string;
        countCrf: string;
    };
    company: SelectionType[];
    banks: SelectionType[];
    bankAccounts: SelectionType[];
    }) {
    useEffect(() => {
        requestNotificationPermission();
    }, []);
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
    const defaultBank = banks.find((bank) => bank.label === filters.bank);
    const defaultBankAccount = bankAccounts.find((bankAccount) => bankAccount.label === filters.bankAccount);
    const [selectedBank, setSelectedBank] = useState(defaultBank ? defaultBank.value : 'all');
    const [selectedBankAccount, setSelectedBankAccount] = useState(defaultBankAccount ? defaultBankAccount.value : 'all');
    const handleChange = async (event: SelectChangeEvent) => {
        const val = event.target.value;
        setSelectedBank(val);

        const selected = banks.find((bank) => bank.value === val);
        router.reload({
            data: {
                bank: selected?.label,
                bankAccount: null
            },
        });
    };
    const handleChangeBa = async (event: SelectChangeEvent) => {
        const val = event.target.value;
        setSelectedBankAccount(val);

        const selected = bankAccounts.find((bank) => bank.value === val);
        router.reload({
            data: {
                bankAccount: selected?.label,
            },
        });
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
                        <Grid size={{ xs: 12, md: 6 }}>
                            <SessionsChart crf={chart} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <PageViewsBarChart
                                bu={bu}
                                data={chart}
                                label="Cheque Voucher"
                            />
                        </Grid>
                    </Grid>

                    <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                        Details
                    </Typography>
                    {/* <TableFilter
                        company={company}
                        filters={filters}
                        handleChangeCheck={() => null}
                        businessUnits={businessUnits}
                        resetFilterRouter={dashboard()}
                    > */}
                    <Stack
                        direction="row"
                        sx={{
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 4,
                            marginBottom: 2,
                        }}
                    >
                        <SelectItem
                            handleChange={handleChange}
                            value={selectedBank}
                            title="Bank"
                            items={banks}
                        />
                        <SelectItem
                            handleChange={handleChangeBa}
                            value={selectedBankAccount}
                            title="Bank Accounts"
                            items={bankAccounts}
                        />
                    </Stack>
                    {/* </TableFilter> */}
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <CustomizedDataGrid cheques={cheques} />
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </AppLayout>
    );
}
