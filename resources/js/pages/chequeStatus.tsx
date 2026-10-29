import PageContainer from '@/components/pageContainer';
import TableFilter from '@/components/tableFilter';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { chequeStatus, detailsCrf, signatureDetails } from '@/routes';
import {
    Auth,
    ChequeType,
    FilterType,
    IdType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    AccessAlarmsOutlined,
    AccountBalanceOutlined,
    AssignmentReturnedOutlined,
    CancelPresentationOutlined,
    DownloadDoneOutlined,
    EventOutlined,
    SwipeRightOutlined,
} from '@mui/icons-material';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import {
    Box,
    Card,
    CardContent,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import {
    chequeStatusColumns,
    pdcColumn,
} from './checkStatus/components/columns';
import TableDataGrid from './dashboard/components/TableDataGrid';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Status',
        href: '#',
    },
];

export default function ChequeStatus({
    cheques,
    company,
    businessUnits,
    filter,
    auth,
}: {
    cheques: InertiaPagination<ChequeType>;
    businessUnits: SelectionType[];
    company: SelectionType[];
    filter: FilterType;
    auth: Auth;
}) {
    const [loading, setLoading] = useState(false);

    const handleStatusChange = (value: string, record: IdType) => {
        console.log(record);
        if (record.type === 'cv')
            router.get(
                signatureDetails(),
                {
                    id: record.id,
                    type: record.type
                },
            );
        else router.visit(detailsCrf(record.id));
    };

    const [tab, setTab] = useState(filter.tab);

    const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
        router.reload({
            only: ['cheques'],
            data: {
                tab: newValue,
            },
            onBefore: () => setLoading(true),
            onFinish: () => setLoading(false),
            onSuccess: () => setTab(newValue),
        });
    };

    const isRegional = auth.user.roles.some(
        (role) =>
            role.name === 'corporate_disbursing_clerk(forwarded_releasing)',
    );

    const columns =
        tab === 'pdc' || tab == 'staled'
            ? pdcColumn()
            : chequeStatusColumns(handleStatusChange);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Cheque Status">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <ToggleButtonGroup
                        color="primary"
                        value={tab}
                        exclusive
                        onChange={handleChangeTab}
                        aria-label="Platform"
                    >
                        <ToggleButton value="for_releasing">
                            <AssignmentReturnedOutlined
                                sx={{ mr: 1, fontSize: 18 }}
                            />
                            For Releasing
                        </ToggleButton>
                        <ToggleButton value="deposited">
                            <AccountBalanceOutlined
                                sx={{ mr: 1, fontSize: 18 }}
                            />
                            Deposited
                        </ToggleButton>
                        <ToggleButton value="released">
                            <DownloadDoneOutlined
                                sx={{ mr: 1, fontSize: 18 }}
                            />
                            Released
                        </ToggleButton>
                        <ToggleButton value="pdc">
                            <EventOutlined sx={{ mr: 1, fontSize: 18 }} />
                            Post Dated
                        </ToggleButton>
                        <ToggleButton value="cancelled">
                            <CancelPresentationOutlined
                                sx={{ mr: 1, fontSize: 18 }}
                            />
                            Cancelled
                        </ToggleButton>
                        {!isRegional && (
                            <ToggleButton value="forwarded">
                                <SwipeRightOutlined
                                    sx={{ mr: 1, fontSize: 18 }}
                                />
                                Forwarded
                            </ToggleButton>
                        )}
                        <ToggleButton value="staled">
                            <AccessAlarmsOutlined
                                sx={{ mr: 1, fontSize: 18 }}
                            />
                            Staled
                        </ToggleButton>
                    </ToggleButtonGroup>

                    {(tab === 'staled' || tab === 'pdc') && (
                        <Card sx={{ mt: '20px' }}>
                            <CardContent>
                                <InsightsRoundedIcon />
                                <Typography
                                    component="h2"
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{ fontWeight: '600' }}
                                >
                                    {tab == 'pdc'
                                        ? 'Post-Dated Cheque Notice'
                                        : 'Stale Cheque Notice'}
                                </Typography>
                                <Typography
                                    sx={{ color: 'text.secondary', mb: '8px' }}
                                >
                                    {tab == 'pdc'
                                        ? 'A cheque is considered post-dated when its Cheque date is later than the Cv/Crf date.'
                                        : 'This cheque is considered stale based on its cheque date, which exceeds six months from today.'}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}

                    <TableFilter
                        company={company}
                        filters={filter}
                        businessUnits={businessUnits}
                        resetFilterRouter={chequeStatus()}
                    />
                    <TableDataGrid
                        data={cheques}
                        isLoading={loading}
                        filter={filter.search}
                        pagination={handlePagination}
                        handleSearchFilter={handleSearch}
                        handleSortFilter={handleSort}
                        columns={columns}
                    />

                    {/* {scannedRecord && (
                        <ScannedDetails
                            record={scannedRecord}
                            title="Cheque Details"
                            open={openModal}
                            onClose={() => setOpenModal(false)}
                        />
                    )} */}
                </Box>
            </PageContainer>
        </AppLayout>
    );
}
