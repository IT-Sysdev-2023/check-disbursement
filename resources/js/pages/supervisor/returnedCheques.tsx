import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { cancelReturnedCheques } from '@/routes';
import {
    BorrowedCheque,
    InertiaPagination,
    type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import { Handshake } from '@mui/icons-material';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { useState } from 'react';
import TableDataGrid from '../dashboard/components/TableDataGrid';
import { returnedChequeColumns } from './components/returnedColumns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Returned Cheques',
        href: '#',
    },
];

export default function ReturnedCheques({
    cheques,
    filter,
}: {
    cheques: InertiaPagination<BorrowedCheque>;
    filter: {
        search: string;
    };
}) {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [openConfirmation, setOpenConfirmation] = useState(false);

    const handleSelectionChange = (model: GridRowSelectionModel) => {
        const currentPageIds = new Set(cheques.data.map((row) => row.id));
        // Keep selections that aren't on the current page/filter
        const previousSelections = selectedRows.filter(
            (id) => !currentPageIds.has(id),
        );
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
    const disableButton = selectedRows.length > 0;
    const multipleRelease = () => {
        router.post(
            cancelReturnedCheques(),
            {
                cheques: selectedRows,
            },
            {
                onSuccess: () => {
                    setOpenConfirmation(false);
                },
            },
        );
    };
    const columns = returnedChequeColumns();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Returned Cheques" />
            <PageContainer title="Returned Cheques">
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
                        onClick={() => setOpenConfirmation(true)}
                    >
                        Cancel Cheques
                    </Button>
                </Box>

                <Dialog
                    open={openConfirmation}
                    onClose={() => setOpenConfirmation(false)}
                    aria-labelledby="approve-dialog-title"
                    aria-describedby="approve-dialog-description"
                >
                    <DialogTitle id="approve-dialog-title">
                        Confirm Cancellation
                    </DialogTitle>

                    <DialogContent>
                        <DialogContentText id="approve-dialog-description">
                            Are you sure you want to cancel this returned
                            cheques? Please verify the details before
                            proceeding.
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={() => setOpenConfirmation(false)}
                            color="inherit"
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={multipleRelease}
                            variant="contained"
                            color="primary"
                            autoFocus
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </PageContainer>
        </AppLayout>
    );
}
