import PageContainer from '@/components/pageContainer';
import TableFilter from '@/components/tableFilter';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import {
    chequeStatus,
} from '@/routes';
import {
    Auth,
    ChequeType,
    FilterType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import { AssignmentReturnedOutlined, CreditScoreOutlined, DownloadDoneOutlined } from '@mui/icons-material';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import TableDataGrid from '../dashboard/components/TableDataGrid';
import { forwardedChequeStatusColumns } from './components/forwardColumn';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Status',
        href: '#',
    },
];

export default function ForwardedChequeStatus({
    cheques,
    company,
    businessUnits,
    filter,
}: {
    cheques: InertiaPagination<ChequeType>;
    businessUnits: SelectionType[];
    company: SelectionType[];
    filter: FilterType;
}) {
    const [loading, setLoading] = useState(false);
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

    const columns = forwardedChequeStatusColumns();
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
                        <ToggleButton value="receiving">
                            <CreditScoreOutlined sx={{ mr: 1, fontSize: 18 }} />
                            Receiving
                        </ToggleButton>
                        <ToggleButton value="received">
                            <CreditScoreOutlined sx={{ mr: 1, fontSize: 18 }} />
                            Received
                        </ToggleButton>
                        <ToggleButton value="released">
                            <DownloadDoneOutlined
                                sx={{ mr: 1, fontSize: 18 }}
                            />
                            Released
                        </ToggleButton>
                        <ToggleButton value="returned">
                            <AssignmentReturnedOutlined
                                sx={{ mr: 1, fontSize: 18 }}
                            />
                            Returned
                        </ToggleButton>
                    </ToggleButtonGroup>
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
                </Box>
            </PageContainer>
        </AppLayout>
    );
}
