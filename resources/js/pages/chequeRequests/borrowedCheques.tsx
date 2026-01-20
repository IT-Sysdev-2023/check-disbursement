import useNotifications from '@/components/notifications/useNotifications';
import PageContainer from '@/components/pageContainer';
import ReasonCancellationModal from '@/components/reason-cancellation-modal';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { approveCheck, approverNames, chequeRequests } from '@/routes';
import {
    Borrower,
    DateFilterType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Box, Button } from '@mui/material';
import { GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';
import axios from 'axios';
import { Handshake, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import OnlySelectionModal from '../dashboard/components/onlySelectionModal';
import TableDataGrid from '../dashboard/components/TableDataGrid';
import { createRequestsChequeColumns } from './components/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Releasing',
        href: chequeRequests().url,
    },
    {
        title: 'Borrowed Checks',
        href: '#',
    },
];

export default function BorrowedCheques({
    cheques,
    filter,
}: {
    cheques: InertiaPagination<Borrower>;
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
}) {
    const [approver, setApprover] = useState<SelectionType[]>([]);
    const [selectedApprover, setSelectedApprover] = useState('');
    const [selectedRows, setSelectedRows] = useState<Set<GridRowId>>(new Set());
    const [open, setOpen] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);

    const handleApprove = async () => {
        const { data } = await axios.get(approverNames().url);
        setOpen(true);
        setApprover(data);
    };

    const notifications = useNotifications();
    const { flash } = usePage().props as {
        flash?: { status?: boolean; message?: string };
    };
    useEffect(() => {
        if (flash?.message) {
            notifications.show(flash.message, {
                severity: flash?.status ? 'success' : 'error',
                autoHideDuration: 3000,
            });
        }
    }, [flash, notifications]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedRows) return;
        router.put(
            approveCheck(),
            {
                approver: selectedApprover,
                borrowedNo: Array.from(selectedRows),
            },
            {
                onError: (e) => {
                    console.log(e);
                },
                onSuccess: () => {
                    setOpen(false);
                },
            },
        );
    };

    const handleSelectionChange = (model: GridRowSelectionModel) => {
        setSelectedRows(model.ids);
    };

    const cvColumns = createRequestsChequeColumns();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Borrowed Checks">
                <TableDataGrid
                    hasSelection
                    data={cheques}
                    filter={filter.search}
                    pagination={handlePagination}
                    handleSearchFilter={handleSearch}
                    handleSortFilter={handleSort}
                    columns={cvColumns}
                    handleSelectionChange={handleSelectionChange}
                />

                <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
                    <Button
                        disabled={selectedRows.size === 0}
                        variant="outlined"
                        startIcon={<Handshake />}
                        onClick={handleApprove}
                    >
                        Approve
                    </Button>
                    <Button
                        disabled={selectedRows.size === 0}
                        color="error"
                        variant="outlined"
                        startIcon={<X />}
                        onClick={() => setOpenCancel(true)}
                    >
                        Cancel
                    </Button>

                    <ReasonCancellationModal
                        id={Array.from(selectedRows)}
                        open={openCancel}
                        handleClose={() => {
                            setOpenCancel(false);
                        }}
                    />
                </Box>

                <OnlySelectionModal
                    title="Approver Name"
                    open={open}
                    onClose={() => setOpen(false)}
                    handleSubmit={handleSubmit}
                    handleSelectedItem={(event) =>
                        setSelectedApprover(event.target.value)
                    }
                    selectedItem={selectedApprover}
                    item={approver}
                />
            </PageContainer>
        </AppLayout>
    );
}
