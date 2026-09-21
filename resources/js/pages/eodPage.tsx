import useNotifications from '@/components/notifications/useNotifications';
import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { generateEod } from '@/routes';
import {
    BreadcrumbItem,
    ChequeStatus,
    FilterType,
    InertiaPagination,
} from '@/types';
import { router } from '@inertiajs/react';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import { Sunset } from 'lucide-react';
import { useState } from 'react';
import SelectItem from './dashboard/components/SelectItem';
import TableDataGrid from './dashboard/components/TableDataGrid';
import { eodColumns } from './eod/columns';

// type NotificationType = 'info' | 'success' | 'warning' | 'error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'End of Day',
        href: '#',
    },
];

export default function EodPage({
    records,
    filter,
    statuses,
}: {
    records: InertiaPagination<ChequeStatus>;
    filter: FilterType;
    statuses: any;
}) {
    const notifications = useNotifications();
    const [defaultFilter, setDefaultFilter] = useState(filter.default);

    const extractEod = async () => {
        try {
            const response = await axios.post(
                generateEod().url,
                {
                    filterStatus: defaultFilter,
                },
                {
                    responseType: 'blob',
                },
            );

            const disposition = response.headers['content-disposition'];

            let filename = 'report.xlsx';

            if (disposition) {
                const match = disposition.match(/filename="?([^"]+)"?/);
                if (match) {
                    filename = match[1];
                }
            }

            const url = window.URL.createObjectURL(response.data);

            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            if (error.response?.status === 404) {
                const blob = error.response.data;

                const text = await blob.text();
                const data = JSON.parse(text);
                notifications.show(data.message, {
                    severity: 'error',
                    autoHideDuration: 3000,
                });
            } else {
                notifications.show('Something went wrong.', {
                    severity: 'error',
                    autoHideDuration: 3000,
                });
            }
        }
    };

    const handleChange = (e) => {
        router.reload({
            data: {
                default: e.target.value,
            },
            // only: [check === 'cv' ? 'cv' : 'crf'],
            replace: true,
        });
        setDefaultFilter(e.target.value);
    };

    const chequeColumn = eodColumns();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <PageContainer title="End of Day">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    {/* <TableFilter
                        company={company}
                        filters={filter}
                        businessUnits={businessUnits}
                        resetFilterRouter={chequeStatus()}
                    /> */}
                    {/* <Stack direction="row" sx={{ gap: 1 }} alignItems="center"> */}
                    <SelectItem
                        handleChange={handleChange}
                        value={defaultFilter}
                        title="Status"
                        items={statuses}
                    />

                    <TableDataGrid
                        data={records}
                        filter={filter.search}
                        pagination={handlePagination}
                        handleSearchFilter={handleSearch}
                        handleSortFilter={handleSort}
                        columns={chequeColumn}
                    />
                    <Box display="flex" justifyContent="flex-end" mt={3}>
                        <Button
                            variant="outlined"
                            startIcon={<Sunset />}
                            onClick={extractEod}
                        >
                            Generate EOD
                        </Button>
                    </Box>
                </Box>
            </PageContainer>
        </AppLayout>
    );
}
