import PageContainer from '@/components/pageContainer';
import ReasonCancellationModal from '@/components/reason-cancellation-modal';
import ReleasingModal from '@/components/releasing-modal';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { checkReleasing } from '@/routes';
import {
    BorrowedCheque,
    FilterType,
    InertiaPagination,
    Option,
    SelectedChequeType,
    type BreadcrumbItem,
} from '@/types';
import { Head } from '@inertiajs/react';
import { Box, Button } from '@mui/material';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { Handshake, X } from 'lucide-react';
import { useState } from 'react';
import { createRequestsChequeColumns } from '../chequeRequests/components/columns';
import TableDataGrid from '../dashboard/components/TableDataGrid';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cheque Releasing',
        href: checkReleasing().url,
    },
    {
        title: 'Cheques to Release',
        href: '#',
    },
];

export default function IndividualCheques({
    cheques,
    receiversName,
    filter,
}: {
    cheques: InertiaPagination<BorrowedCheque>;
    receiversName: Option[];
    filter: FilterType;
}) {
    const [openCancel, setOpenCancel] = useState(false);
    const [openReleasing, setOpenReleasing] = useState(false);
    const [selectedRows, setSelectedRows] = useState<SelectedChequeType[]>([]);

    const handleSelectionChange = (model: GridRowSelectionModel) => {
        const currentPageIds = new Set(cheques.data.map((row) => row.id));

        const previousSelections = selectedRows.filter(
            (row) => !currentPageIds.has(row.id),
        );

        const currentSelections = cheques.data
            .filter((row) => {
                if (model.type === 'include') {
                    return model.ids.has(row.id);
                }
                return !model.ids.has(row.id);
            })
            .map((row) => ({
                id: row.id,
                status: row.checkable.location,
            }));

        setSelectedRows([...previousSelections, ...currentSelections]);
    };

    const releaseSubmit = () => {
        setOpenReleasing(true);
    };

    const cancelCheque = () => {
        setOpenCancel(true);
    };

    const enableButton = selectedRows.length > 0;
    const columns = createRequestsChequeColumns();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Cheques to Release">
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
                        disabled={!enableButton}
                        variant="outlined"
                        startIcon={<Handshake />}
                        onClick={releaseSubmit}
                    >
                        Release
                    </Button>
                    <Button
                        disabled={!enableButton}
                        color="error"
                        variant="outlined"
                        startIcon={<X />}
                        onClick={cancelCheque}
                    >
                        Cancel
                    </Button>
                </Box>
            </PageContainer>
            <ReleasingModal
                cheques={selectedRows}
                receiverNames={receiversName}
                open={openReleasing}
                handleClose={() => setOpenReleasing(false)}
                handleSuccess={() => {
                    setSelectedRows([]);
                }}
            />

            <ReasonCancellationModal
                cheques={selectedRows}
                open={openCancel}
                handleClose={() => {
                    setSelectedRows([]);
                    setOpenCancel(false);
                }}
            />
        </AppLayout>
    );
}
