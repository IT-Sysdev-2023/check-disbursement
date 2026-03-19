import CancellationBorrowedModal from '@/components/cancellation-borrowed-modal';
import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import {
    approveCheck,
    approverNames,
    changeApprover,
    chequeRequests,
} from '@/routes';
import {
    Borrower,
    DateFilterType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import axios from 'axios';
import { CheckCircle, Edit2Icon, Handshake, X } from 'lucide-react';
import { useState } from 'react';
import OnlySelectionModal from '../dashboard/components/onlySelectionModal';
import TableDataGrid from '../dashboard/components/TableDataGrid';
import { createRequestsChequeColumns } from './components/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Receiving',
        href: chequeRequests().url,
    },
    {
        title: 'Borrowed Checks',
        href: '#',
    },
];
type FormData = {
    borrowedNo: (string | number)[];
    approver: string;
    type: 'include' | 'exclude';
};

export default function BorrowedCheques({
    cheques,
    primaryApprover,
    approvers,
    filter,
    borrowerId,
}: {
    cheques: InertiaPagination<Borrower>;
    primaryApprover: string;
    approvers: SelectionType[];
    borrowerId: number;
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
}) {
    const [approverList, setApproverList] = useState<SelectionType[]>([]);
    const [selectedSignatory, setSelectedSignatory] = useState('');
    const [managersKey, setManagersKey] = useState('');
    const [confirmCheckSignatory, setConfirmCheckSignatory] = useState(false);
    const [openManagersKey, setOpenManagersKey] = useState(false);
    const [changeSignatoryModal, setChangeSignatoryModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);

    const { data, setData, put } = useForm<FormData>({
        approver: '',
        type: 'include',
        borrowedNo: [],
    });
    const handleApprove = async () => {
        const { data } = await axios.get(approverNames().url);
        setOpen(true);
        setApproverList(data);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(approveCheck().url, {
            onError: (e) => {
                console.log(e);
            },
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    const handleSelectionChange = (model: GridRowSelectionModel) => {
        const id = Array.from(model.ids);

        setData({
            borrowedNo: id,
            type: model.type,
        });
    };

    const handleChangeSignatory = (e) => {
        e.preventDefault();
        setOpenManagersKey(true);

        if (managersKey.length !== 0) {
            router.put(
                changeApprover(),
                {
                    key: managersKey,
                    approver: selectedSignatory,
                    borrower: borrowerId,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    onError: (e) => {
                        alert(e.key);
                    },
                    onSuccess: () => {
                        setChangeSignatoryModal(false)
                        setConfirmCheckSignatory(true)
                    }
                },
            );
        }
    };

    const columns = createRequestsChequeColumns();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Borrowed Checks">
                <Typography variant="h6" gutterBottom component="div">
                    Check Signatory: {primaryApprover}
                </Typography>
                <TableDataGrid
                    hasSelection={confirmCheckSignatory}
                    data={cheques}
                    filter={filter.search}
                    pagination={handlePagination}
                    handleSearchFilter={handleSearch}
                    handleSortFilter={handleSort}
                    columns={columns}
                    handleSelectionChange={handleSelectionChange}
                />

                {!confirmCheckSignatory && (
                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        mt={3}
                        gap={2}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<CheckCircle />}
                            onClick={() => setConfirmCheckSignatory(true)}
                        >
                            CONFIRM CHECK SIGNATORY
                        </Button>
                        <Button
                            color="error"
                            variant="outlined"
                            startIcon={<Edit2Icon />}
                            onClick={() => setChangeSignatoryModal(true)}
                        >
                            CHANGE CHECK SIGNATORY
                        </Button>
                    </Box>
                )}

                {confirmCheckSignatory && (
                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        mt={3}
                        gap={2}
                    >
                        <Button
                            disabled={
                                data.borrowedNo.length === 0 &&
                                data.type === 'include'
                            }
                            variant="outlined"
                            startIcon={<Handshake />}
                            onClick={handleApprove}
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
                )}

                <OnlySelectionModal
                    title="Approver Name"
                    open={open}
                    onClose={() => setOpen(false)}
                    handleSubmit={handleSubmit}
                    handleSelectedItem={(event) =>
                        setData('approver', event.target.value)
                    }
                    selectedItem={data.approver}
                    item={approverList}
                />

                <OnlySelectionModal
                    title="Change Signatory Name"
                    open={changeSignatoryModal}
                    onClose={() => setChangeSignatoryModal(false)}
                    handleSubmit={handleChangeSignatory}
                    handleSelectedItem={(event) =>
                        setSelectedSignatory(event.target.value)
                    }
                    selectedItem={selectedSignatory}
                    item={approvers}
                >
                    {openManagersKey && (
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Managers Key"
                                onChange={(e) => setManagersKey(e.target.value)}
                            />
                        </Grid>
                    )}
                </OnlySelectionModal>
            </PageContainer>
        </AppLayout>
    );
}
