import AppLayout from '@/layouts/app-layout';
import { dashboard, details, detailsCrf } from '@/routes';
import { ChequeType, InertiaPagination, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Button,
    Chip,
    InputAdornment,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { GridColDef } from '@mui/x-data-grid';
import { SearchIcon } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import StatCard, { StatCardProps } from './dashboard/components/StatCard';
import TableDataGrid from './dashboard/components/TableDataGrid';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const crfColumns: GridColDef[] = [
    {
        field: 'checkNumber',
        headerName: 'Check Number',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => row.checkable.checkNumber,
    },
    {
        field: 'payee',
        headerName: 'Payee',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => row.checkable.payee,
    },
    {
        field: 'amount',
        headerName: 'Amount',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
        renderCell: ({ row }) => row.checkable.amount,
    },
    {
        field: 'issueDate',
        headerName: 'Issue Date',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: ({ row }) => row.checkable?.cvHeader?.cvDate,
    },
    {
        field: 'releasedDate',
        headerName: 'Released Date',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: ({ row }) => row.checkable?.checkStatus?.createdAt,
    },
    {
        field: 'Status',
        headerName: 'Status',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: ({ row }) => {
            const { checkStatus } = row.checkable;
            let status = null;

            if (row.checkable?.status) {
                status = row.checkable.status;
            }

            if (checkStatus?.status) {
                status = checkStatus.status;
            }
            if (checkStatus?.forwardedStatus?.status) {
                status = checkStatus.forwardedStatus.status;
            }

            if (checkStatus?.isClosed) {
                status = 'closed';
            }

            const statusMap: Record<
                string,
                {
                    label: string;
                    color:
                        | 'default'
                        | 'primary'
                        | 'success'
                        | 'warning'
                        | 'error';
                }
            > = {
                closed: { label: 'Closed', color: 'primary' },
                released: { label: 'Released', color: 'default' },
                forwarded: { label: 'Forwarded', color: 'warning' },
                deposited: { label: 'Deposit', color: 'success' },
                cancelled: { label: 'Cancelled', color: 'error' },
                staled: { label: 'Staled', color: 'warning' },
            };

            return (
                <Chip
                    label={statusMap[status]?.label || 'For Releasing'}
                    color={statusMap[status]?.color || 'default'}
                />
            );
        },
    },
    {
        field: 'companyName',
        headerName: 'Business Unit',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: ({ row }) => row.checkable.company,
    },
    {
        field: 'action',
        headerName: 'Action',
        headerAlign: 'right',
        align: 'right',
        renderCell: ({ row }) => {
            return (
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                        if (row.check === 'cv')
                            router.visit(details(row.checkable.id));
                        else router.visit(detailsCrf(row.checkable.id));
                    }}
                >
                    View
                </Button>
            );
        },
    },
];

export default function ViewingDashboard({
    totals,
    checks,
    checkIssued,
}: {
    checks: InertiaPagination<ChequeType>;
    checkIssued: string;
    totals: {
        amount: string;
        releasedChecks: string;
        pending: string;
    };
}) {
    const [value, setValue] = useState('all');
    const [search, setSearch] = useState('');
    const handleChange = (
        _: React.MouseEvent<HTMLElement>,
        newValue: string,
    ) => {
        if (newValue !== null) {
            setValue(newValue);
            router.reload({
                only: ['checks'],
                data: {
                    tab: newValue,
                },
            });
        }
    };
    const data: StatCardProps[] = [
        {
            title: 'Total Cheques Amount',
            value: totals.amount,
            interval: checkIssued + ' Checks Issued',
        },
        {
            title: 'Released Checks',
            value: totals.releasedChecks,
            interval: 'Checks Released',
        },
        {
            title: 'Pending Checks',
            value: totals.pending,
            interval: 'Checks for Releasing',
        },
    ];

    const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);

        router.reload({
            data: {
                search: e.target.value,
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

                        <Grid size={{ xs: 12 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 2,
                                    mb: 2,
                                    width: '100%',
                                }}
                            >
                                <TextField
                                    placeholder="Search borrower..."
                                    value={search}
                                    onChange={onSearch}
                                    size="small"
                                    sx={{ flex: 1 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <ToggleButtonGroup
                                    value={value}
                                    exclusive
                                    onChange={handleChange}
                                    size="small"
                                >
                                    <ToggleButton value="all">All</ToggleButton>
                                    <ToggleButton value="released">
                                        Released
                                    </ToggleButton>
                                    <ToggleButton value="for_releasing">
                                        For Releasing
                                    </ToggleButton>
                                    <ToggleButton value="staled">
                                        Stale Check
                                    </ToggleButton>
                                    <ToggleButton value="cancelled">
                                        Cancel
                                    </ToggleButton>
                                    <ToggleButton value="closed">
                                        Closed
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 12 }}>
                            <Box
                                sx={{
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                }}
                            ></Box>

                            <TableDataGrid
                                data={checks}
                                pagination={() => null}
                                handleSearchFilter={() => null}
                                handleSortFilter={() => null}
                                columns={crfColumns}
                                isLoading={false}
                                density="compact"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </AppLayout>
    );
}
