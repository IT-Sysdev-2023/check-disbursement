import PageContainer from '@/components/pageContainer';
import TableFilter from '@/components/tableFilter';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import {
    cancelStaleCheck,
    checkStatus,
    detailsCrf,
    signatureDetails,
} from '@/routes';
import {
    Auth,
    CheckScannedDetails,
    ChequeType,
    FilterType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    AccessAlarmsOutlined,
    CancelPresentationOutlined,
    CreditScoreOutlined,
    DownloadDoneOutlined,
    SwipeRightOutlined,
} from '@mui/icons-material';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { createStatusChequeColumns } from './checkStatus/components/columns';
import ScannedDetails from './checkStatus/components/scannedDetails';
import TableDataGrid from './dashboard/components/TableDataGrid';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Status',
        href: '#',
    },
];

export default function CheckStatus({
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
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [scannedRecord, setScannedRecord] = useState<CheckScannedDetails>();

    const handleStatusChange = (value: string, record: CheckScannedDetails) => {
        if (value === 'cancel') {
            //borrowedId
            router.post(cancelStaleCheck(record.borrowedId));
        } else if (value === 'details') {
            if (record.type === 'cv') router.visit(signatureDetails(record.id));
            else router.visit(detailsCrf(record.id));
        } else {
            setOpenModal(true);
            setScannedRecord(record);
        }
    };
    console.log(company);

    const [tab, setTab] = useState(filter.tab);

    const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
        setTab(newValue);
        router.reload({
            only: ['cheques'],
            data: {
                tab: newValue,
            },
            onBefore: () => setLoading(true),
            onFinish: () => setLoading(false),
        });
    };

    const isRegional = auth.user.roles.some(
        (role) => role.name === 'regional_officer',
    );
    const chequeColumn = createStatusChequeColumns(handleStatusChange);
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
                        <ToggleButton value="deposited">
                            <CreditScoreOutlined sx={{ mr: 1, fontSize: 18 }} />
                            Deposited
                        </ToggleButton>
                        <ToggleButton value="released">
                            <DownloadDoneOutlined
                                sx={{ mr: 1, fontSize: 18 }}
                            />
                            Released
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
                    <TableFilter
                        company={company}
                        filters={filter}
                        businessUnits={businessUnits}
                        resetFilterRouter={checkStatus()}
                    />
                    <TableDataGrid
                        data={cheques}
                        isLoading={loading}
                        filter={filter.search}
                        pagination={handlePagination}
                        handleSearchFilter={handleSearch}
                        handleSortFilter={handleSort}
                        columns={chequeColumn}
                    />

                    {scannedRecord && (
                        <ScannedDetails
                            record={scannedRecord}
                            title="Cheque Details"
                            open={openModal}
                            onClose={() => setOpenModal(false)}
                        />
                    )}
                </Box>
            </PageContainer>
        </AppLayout>
    );
}
