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
import { Box, Button } from '@mui/material';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { Handshake, X } from 'lucide-react';
import { useState } from 'react';
import OnlySelectionModal from '../dashboard/components/onlySelectionModal';
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
    filter,
}: {
    cheques: InertiaPagination<Borrower>;
    approvers: SelectionType[];
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
}) {
    const [selectedApprover, setSelectedApprover] = useState('');
    const [openApproval, setOpenApproval] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);
    const [onSaveLoading, setOnSaveLoading] = useState(false);

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
        e.preventDefault();

        transform((data) => ({
            ...data,
            approver: selectedApprover,
        }));

        put(approveCheck().url, {
            onError: (e) => {
                console.log(e);
            },
            onBefore: () => setOnSaveLoading(true),
            onSuccess: () => {
                setOnSaveLoading(false);
                setOpenApproval(false);
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
                        id={data.borrowedNo}
                        type={data.type}
                        open={openCancel}
                        handleClose={() => {
                            setOpenCancel(false);
                        }}
                    />
                </Box>

                <OnlySelectionModal
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
                ></OnlySelectionModal>
            </PageContainer>
        </AppLayout>
    );
}
