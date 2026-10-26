import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import {
    BorrowedCheque,
    InertiaPagination,
    type BreadcrumbItem,
} from '@/types';
import { Head } from '@inertiajs/react';
import { Handshake } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { useState } from 'react';
import TableDataGrid from '../dashboard/components/TableDataGrid';
import { createDepositSlipsColumns } from './components/columns';
import UploadDepositSlipModal from './components/uploadDepositSlipModal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Deposit Slips',
        href: '#',
    },
];

export default function DepositSlips({
    cheques,
    filter,
}: {
    cheques: InertiaPagination<BorrowedCheque>;
    filter: {
        search: string;
    };
}) {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [openUploading, setOpenUploading] = useState(false);

    const handleSelectionChange = (model: GridRowSelectionModel) => {
        const currentPageIds = new Set(cheques.data.map((row) => row.id));
        // Keep selections that aren't on the current page/filter
        const previousSelections = selectedRows.filter(
            (id) => !currentPageIds.has(id),
        );

        console.log(currentPageIds);
        // Current selections from the visible rows
        const currentSelections = cheques.data
            .filter((row) => {
                if (model.type === 'include') {
                    return model.ids.has(row.id);
                }

                // everything is selected except IDs in model.ids
                return !model.ids.has(row.id);
            })
            .map((row) => row.id);

        setSelectedRows([...previousSelections, ...currentSelections]);
    };

    const multipleRelease = () => {
        setOpenUploading(true);
    };

    const disableButton = selectedRows.length > 0;
    const columns = createDepositSlipsColumns();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Deposit Slips" />
            <PageContainer title="Deposit Slips">
                <TableDataGrid
                    data={cheques}
                    filter={filter.search}
                    pagination={handlePagination}
                    handleSearchFilter={handleSearch}
                    handleSortFilter={handleSort}
                    columns={columns}
                    hasSelection
                    handleSelectionChange={handleSelectionChange}
                />

                <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
                    <Button
                        disabled={!disableButton}
                        variant="outlined"
                        startIcon={<Handshake />}
                        onClick={multipleRelease}
                    >
                        Upload Ds
                    </Button>
                </Box>

                <UploadDepositSlipModal
                    open={openUploading}
                    onClose={() => setOpenUploading(false)}
                    chequeIds={selectedRows}
                    uploadUrl="/section-head/deposit-slips/upload"
                    onSuccess={() => setSelectedRows([])}
                />
            </PageContainer>
        </AppLayout>
    );
}
