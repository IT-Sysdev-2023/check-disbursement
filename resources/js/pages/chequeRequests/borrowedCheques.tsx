import CancellationBorrowedModal from '@/components/cancellation-borrowed-modal';
import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { approveCheck, chequeRequests, setDs } from '@/routes';
import {
    Borrower,
    DateFilterType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, useForm } from '@inertiajs/react';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
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
import { Handshake, X } from 'lucide-react';
import { useState } from 'react';
import TableDataGrid from '../dashboard/components/TableDataGrid';
import { createRequestsChequeColumns } from './components/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cheque Receiving',
        href: chequeRequests().url,
    },
    {
        title: 'Borrowed Cheques',
        href: '#',
    },
];

export default function BorrowedCheques({
    cheques,
    approvers,
    borrowerId,
    filter,
}: {
    cheques: InertiaPagination<Borrower>;
    approvers: SelectionType[];
    borrowerId: number;
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
}) {
    const [openApproval, setOpenApproval] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);
    const [openDs, setOpenDs] = useState(false);

    const { data, setData, put, transform } = useForm<any>({
        borrowerNo: borrowerId,
        borrowedIds: [],
    });

    const handleSelectionChange = (model: GridRowSelectionModel) => {
        const currentPageIds = new Set(cheques.data.map((row) => row.id));

        const previousSelections = data.borrowedIds.filter(
            (id) => !currentPageIds.has(id),
        );

        const currentSelections = cheques.data
            .filter((row) => {
                if (model.type === 'include') {
                    return model.ids.has(row.id);
                }

                // everything is selected except IDs in model.ids
                return !model.ids.has(row.id);
            })
            .map((row) => row.id);

        setData('borrowedIds', [...previousSelections, ...currentSelections]);
    };

    const handleChangeApprover = (e) => {
        put(approveCheck().url);
    };
    const handleDs = (e) => {
        put(setDs().url);
    };

    const columns = createRequestsChequeColumns();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Borrowed Cheques">
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
                        disabled={data.borrowedIds.length === 0}
                        variant="outlined"
                        startIcon={<Handshake />}
                        // onClick={handleSubmit}
                        onClick={() => setOpenApproval(true)}
                    >
                        Approve
                    </Button>
                    <Button
                        disabled={data.borrowedIds.length === 0}
                        color="error"
                        variant="outlined"
                        startIcon={<X />}
                        onClick={() => setOpenCancel(true)}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={data.borrowedIds.length === 0}
                        color="error"
                        variant="outlined"
                        startIcon={<FileUploadOutlinedIcon />}
                        onClick={() => setOpenDs(true)}
                    >
                        DS Uploading
                    </Button>

                    <CancellationBorrowedModal
                        borrowerNo={borrowerId}
                        id={data.borrowedIds}
                        open={openCancel}
                        handleClose={() => {
                            setOpenCancel(false);
                        }}
                    />
                </Box>
                <Dialog
                    open={openApproval}
                    onClose={() => setOpenApproval(false)}
                    aria-labelledby="approve-dialog-title"
                    aria-describedby="approve-dialog-description"
                >
                    <DialogTitle id="approve-dialog-title">
                        Confirm Approval
                    </DialogTitle>

                    <DialogContent>
                        <DialogContentText id="approve-dialog-description">
                            Are you sure you want to approve this request?
                            Please verify the details before proceeding.
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={() => setOpenApproval(false)}
                            color="inherit"
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleChangeApprover}
                            variant="contained"
                            color="primary"
                            autoFocus
                        >
                            Confirm Approval
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={openDs}
                    onClose={() => setOpenDs(false)}
                    aria-labelledby="approve-dialog-title"
                    aria-describedby="approve-dialog-description"
                >
                    <DialogTitle id="approve-dialog-title">
                        Confirm Deposit Slip
                    </DialogTitle>

                    <DialogContent>
                        <DialogContentText id="approve-dialog-description">
                            Are you sure you want to confirm these cheques for
                            the deposit slip? Please verify that all selected
                            cheques and their details are correct before
                            proceeding.
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={() => setOpenDs(false)}
                            color="inherit"
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleDs}
                            variant="contained"
                            color="primary"
                            autoFocus
                        >
                            Confirm Cheques
                        </Button>
                    </DialogActions>
                </Dialog>
            </PageContainer>
        </AppLayout>
    );
}
