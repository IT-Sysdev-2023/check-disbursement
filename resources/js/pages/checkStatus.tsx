import PageContainer from '@/components/pageContainer';
import TableFilter from '@/components/tableFilter';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { cancelStaleCheck, detailsCrf, signatureDetails } from '@/routes';
import {
    Auth,
    CheckScannedDetails,
    ChequeType,
    DateFilterType,
    FilterType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import AccessAlarmsOutlinedIcon from '@mui/icons-material/AccessAlarmsOutlined';
import CancelPresentationOutlinedIcon from '@mui/icons-material/CancelPresentationOutlined';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import DownloadDoneOutlinedIcon from '@mui/icons-material/DownloadDoneOutlined';
import SwipeRightOutlinedIcon from '@mui/icons-material/SwipeRightOutlined';
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
    filter,
    auth,
}: {
    cheques: InertiaPagination<ChequeType>;
    company: SelectionType[];
    filter: FilterType;
    auth: Auth;
}) {
    const [openModal, setOpenModal] = useState(false);
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

    const [tab, setTab] = useState(filter.tab);

    const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
        setTab(newValue);
        router.reload({
            only: ['cheques'],
            data: {
                tab: newValue,
            },
        });
    };

    const isRegional = auth.user.roles.some(
        (role) => role.name === 'regional_officer',
    );
    const chequeColumn = createStatusChequeColumns(handleStatusChange);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Check Status">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <ToggleButtonGroup
                        color="primary"
                        value={tab}
                        exclusive
                        onChange={handleChangeTab}
                        aria-label="Platform"
                    >
                        <ToggleButton value="deposited">
                            <CreditScoreOutlinedIcon
                                sx={{ mr: 1, fontSize: 18 }}
                            />
                            Deposited
                        </ToggleButton>
                        <ToggleButton value="released">
                            <DownloadDoneOutlinedIcon
                                sx={{ mr: 1, fontSize: 18 }}
                            />
                            Released
                        </ToggleButton>
                        <ToggleButton value="cancelled">
                            <CancelPresentationOutlinedIcon
                                sx={{ mr: 1, fontSize: 18 }}
                            />
                            Cancelled
                        </ToggleButton>
                        {!isRegional && (
                            <ToggleButton value="forwarded">
                                <SwipeRightOutlinedIcon
                                    sx={{ mr: 1, fontSize: 18 }}
                                />
                                Forwarded
                            </ToggleButton>
                        )}
                        <ToggleButton value="staled">
                            <AccessAlarmsOutlinedIcon
                                sx={{ mr: 1, fontSize: 18 }}
                            />
                            Staled
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <TableFilter company={company} filters={filter} />

                    <TableDataGrid
                        data={cheques}
                        filter={filter.search}
                        pagination={handlePagination}
                        handleSearchFilter={handleSearch}
                        handleSortFilter={handleSort}
                        columns={chequeColumn}
                    />

                    {scannedRecord && (
                        <ScannedDetails
                            record={scannedRecord}
                            title="Check Details"
                            open={openModal}
                            onClose={() => setOpenModal(false)}
                        />
                    )}
                </Box>
            </PageContainer>
        </AppLayout>
    );
}
