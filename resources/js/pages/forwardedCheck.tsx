import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { receiverForwarded, signatureDetails } from '@/routes';
import {
    Crf,
    Cv,
    DateFilterType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import { Box, Button } from '@mui/material';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { Handshake } from 'lucide-react';
import { useState } from 'react';
import TableFilter from '../components/tableFilter';
import { createForwardedColumns } from './chequeReleasing/components/columns';
import TableDataGrid from './dashboard/components/TableDataGrid';
import OnlySelectionModal from './dashboard/components/onlySelectionModal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Forwarded Cheques',
        href: '#',
    },
];

export default function ForwardedCheck({
    cheques,
    company,
    filter,
    receiver,
}: {
    cheques: InertiaPagination<Cv | Crf>;
    filter: {
        selectedCompany: string;
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
    company: SelectionType[];
    receiver: SelectionType[];
}) {
    const [openModal, setOpenModal] = useState(false);
    const [selectedReceiver, setselectedReceiver] = useState('0');
    const [chequeStatusId, setChequeStatusId] = useState<number>();

    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const handleStatusChange = (checkId: number) => {
        router.visit(signatureDetails(checkId));
    };

    const handleReceiveSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.put(
            receiverForwarded().url,
            { ids: selectedRows },
            {
                onSuccess: () => {
                    setOpenModal(false);
                },
            },
        );
    };

    const handleSelectionChange = (model: GridRowSelectionModel) => {
        const currentPageIds = new Set(cheques.data.map((row) => row.id));

        const previousSelections = selectedRows.filter(
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

        setSelectedRows([...previousSelections, ...currentSelections]);
    };
    const enableButtonTag = selectedRows.length > 0;
    const columns = createForwardedColumns(handleStatusChange);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cheques" />
            <PageContainer title="Forwarded Cheques">
                <TableFilter company={company} filters={filter} />

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
                        // disabled={
                        //     data.borrowedNo.length === 0 &&
                        //     data.type === 'include'
                        // }
                        disabled={!enableButtonTag}
                        variant="outlined"
                        startIcon={<Handshake />}
                        onClick={() => setOpenModal(true)}
                    >
                        Receive
                    </Button>
                </Box>
            </PageContainer>

            <OnlySelectionModal
                title="Received By :"
                open={openModal}
                onClose={() => setOpenModal(false)}
                handleSubmit={handleReceiveSubmit}
                handleSelectedItem={(e) => setselectedReceiver(e.target.value)}
                selectedItem={selectedReceiver}
                item={receiver}
            />
        </AppLayout>
    );
}
