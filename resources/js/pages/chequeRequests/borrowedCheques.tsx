import CancellationBorrowedModal from '@/components/cancellation-borrowed-modal';
import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { approveCheck, chequeRequests } from '@/routes';
import {
    Borrower,
    DateFilterType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
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
type FormData = {
    borrowedNo: (string | number)[];
    type: 'include' | 'exclude';
};

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

    const { data, setData, put, transform } = useForm<FormData>({
        type: 'include',
        borrowedNo: [],
    });

    const handleSelectionChange = (model: GridRowSelectionModel) => {
        const id = Array.from(model.ids);
        setData({
            borrowedNo: id,
            type: model.type,
        });
    };

    const handleChangeApprover = (e) => {
        transform((data) => ({
            ...data,
            borrowerId: borrowerId,
        }));

        put(approveCheck().url, {
            onError: (e) => {
                console.log(e);
            },
        });
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
                        disabled={
                            data.borrowedNo.length === 0 &&
                            data.type === 'include'
                        }
                        variant="outlined"
                        startIcon={<Handshake />}
                        // onClick={handleSubmit}
                        onClick={() => setOpenApproval(true)}
                    >
                        Approve
                    </Button>
                    <Button
                        disabled={
                            data.borrowedNo.length === 0 &&
                            data.type === 'include'
                        }
                        color="error"
                        variant="outlined"
                        startIcon={<X />}
                        onClick={() => setOpenCancel(true)}
                    >
                        Cancel
                    </Button>

                    <CancellationBorrowedModal
                        borrowerId={borrowerId}
                        id={data.borrowedNo}
                        type={data.type}
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
                {/* <OnlySelectionModal
                    title="Set Approver"
                    open={openApproval}
                    onClose={() => setOpenApproval(false)}
                    handleSubmit={handleChangeApprover}
                    handleSelectedItem={(event) =>
                        setSelectedApprover(event.target.value)
                    }
                    selectedItem={selectedApprover}
                    item={approvers}
                    loading={onSaveLoading}
                ></OnlySelectionModal> */}
            </PageContainer>
        </AppLayout>
    );
}
