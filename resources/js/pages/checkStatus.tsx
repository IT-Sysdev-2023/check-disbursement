import PageContainer from '@/components/pageContainer';
import TableFilter from '@/components/tableFilter';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { detailsCrf, signatureDetails } from '@/routes';
import {
    CheckScannedDetails,
    ChequeType,
    DateFilterType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Box, Tab } from '@mui/material';
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
}: {
    cheques: InertiaPagination<ChequeType>;
    company: SelectionType[];
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
        tab: string;
    };
}) {
    const [openModal, setOpenModal] = useState(false);
    const [scannedRecord, setScannedRecord] = useState<CheckScannedDetails>();

    const handleStatusChange = (value: string, record: CheckScannedDetails) => {
        if (value === 'details') {
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
    const chequeColumn = createStatusChequeColumns(handleStatusChange);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Check Status">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={tab}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList
                                onChange={handleChangeTab}
                                aria-label="tabs"
                            >
                                <Tab label="All" value="all" />
                                <Tab label="Forwarded" value="forward" />
                                <Tab label="Deposited" value="deposit" />
                                <Tab label="Released" value="release" />
                            </TabList>
                        </Box>
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
                    </TabContext>
                </Box>
            </PageContainer>
        </AppLayout>
    );
}
