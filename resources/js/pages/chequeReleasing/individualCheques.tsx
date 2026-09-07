import PageContainer from '@/components/pageContainer';
import ReasonCancellationModal from '@/components/reason-cancellation-modal';
import ReleasingModal from '@/components/releasing-modal';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { checkReleasing } from '@/routes';
import {
    DateFilterType,
    InertiaPagination,
    ListSelectedChequeType,
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
    cheques: InertiaPagination<any>;
    receiversName: Option[];
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
    }) {
    
    const [ids, setIds] = useState<number[]>([]);
    const [openCancel, setOpenCancel] = useState(false);
    const [selectedCheques, setSelectedCheques] = useState<
        SelectedChequeType[]
    >([]);
    const [openReleasing, setOpenReleasing] = useState(false);
    const [selectedRows, setSelectedRows] = useState<ListSelectedChequeType[]>(
        [],
    );

    const handleSelectionChange = (model: GridRowSelectionModel) => {
        const currentPageIds = new Set(cheques.data.map((row) => row.id));
        // Keep selections that aren't on the current page/filter
        const previousSelections = selectedRows.filter(
            (row) => !currentPageIds.has(row.id),
        );
        // Current selections from the visible rows
        const currentSelections = cheques.data
            .filter((row) => model.ids.has(row.id))
            .map((row) => ({
                id: row.id,
                borrowedChequeId: row.id,
                chequeNo: row.checkable.chequeNumber,
                amount: row.checkable.amount,
                chequeDate: row.checkable.chequeDate,
                status: row.location,
            }));
        setSelectedRows([...previousSelections, ...currentSelections]);
    };

    const multipleRelease = () => {
        const selectedItems = selectedRows.map((item) => ({
            id: item.id,
            status:
                item.status == 'Manila' || item.status == 'Cebu'
                    ? 'Forward'
                    : item.status == 'Deposit'
                      ? 'Deposit'
                      : 'Release',
        }));

        setSelectedCheques(selectedItems);
        setOpenReleasing(true);
    };

    const cancelCheque = () => {
        const selectedItems = selectedRows.map((item) => item.borrowedChequeId);
        setIds(selectedItems);
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
                        onClick={multipleRelease}
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
                cheques={selectedCheques}
                receiverNames={receiversName}
                open={openReleasing}
                handleClose={() => setOpenReleasing(false)}
                handleSuccess={() => {
                    setSelectedRows([]);
                }}
            />

            {ids && (
                <ReasonCancellationModal
                    id={ids}
                    open={openCancel}
                    handleClose={() => {
                        setSelectedRows([]);
                        setOpenCancel(false);
                    }}
                />
            )}
        </AppLayout>
    );
}
