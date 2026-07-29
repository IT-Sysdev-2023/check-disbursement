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
import { Box, Button } from '@mui/material';
import axios from 'axios';
import { Sunset } from 'lucide-react';
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
}: {
    records: InertiaPagination<ChequeStatus>;
    filter: FilterType;
}) {
    const extractEod = async () => {
        const response = await axios.post(
            generateEod().url,
            {},
            {
                responseType: 'blob',
            },
        );

        console.log(response);

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
