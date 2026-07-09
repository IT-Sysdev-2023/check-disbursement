import PageContainer from '@/components/pageContainer';
import PdfReader from '@/components/pdf-reader';
import ReasonCancellationModal from '@/components/reason-cancellation-modal';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import CallMissedOutgoingOutlinedIcon from '@mui/icons-material/CallMissedOutgoingOutlined';
import { checkReleasing, releaseCheck } from '@/routes';
import {
    ChequeResourceType,
    FilterType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import TableFilter from '../components/tableFilter';
import { createReleasingColumns } from './chequeReleasing/components/columns';
import TableDataGrid from './dashboard/components/TableDataGrid';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cheque Releasing',
        href: '#',
    },
];

export default function CheckReleasing({
    cheques,
    company,
    filter,
    businessUnits,
}: {
    cheques: InertiaPagination<ChequeResourceType>;
    filter: FilterType;
    company: SelectionType[];
    businessUnits: SelectionType[];
}) {
    const [open, setOpen] = useState(false);
    const [id, setId] = useState<number | undefined>(undefined);
    const [stream, setStream] = useState('');
    const [openModalPdf, setOpenModalPdf] = useState(false);

    const { flash } = usePage().props as {
        flash?: { status?: boolean; message?: string; stream?: string };
    };

    useEffect(() => {
        if (flash?.status && flash?.stream) {
            setStream(flash.stream);
            setOpenModalPdf(true);
        }
    }, [flash]);

    const handleStatusChange = (id: number, value: string) => {

        if (value === 'cancel') {
            setId(id);
            setOpen(true);
            return;
        }

        proceed([id], value);
    };

    const multipleRelease = () => {
        const ids = selectedRows.map(item => item.id);
        proceed(ids, 'Release');
    }

    const proceed = (ids: number[], status: string) => {
        console.log(ids);
        router.get(releaseCheck().url, {
            ids: ids,
            status: status,
        });
    }


    const [selectedRows, setSelectedRows] = useState<
            { id: number }[]
        >([]);
        const handleSelectionChange = (model: GridRowSelectionModel) => {
                const selectedR = cheques.data
                    .filter((row) => model.ids.has(row.id))
                    .map((row) => ({
                        id: row.borrowedCheckId,
                        // chequeId: row.chequeId,
                        // type: row.type,
                    }));
        
                setSelectedRows(selectedR);
        };

     const enableButton =
        selectedRows.length > 0 &&
        cheques.data
            .filter((row) => selectedRows.some((r) => r.id === row.id))
            .every((row) => row.scannedId !== null);
    
    const columns = createReleasingColumns(handleStatusChange);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Cheque Releasing">
                <TableFilter
                    company={company}
                    filters={filter}
                    handleChangeCheck={() => null}
                    businessUnits={businessUnits}
                    resetFilterRouter={checkReleasing()}
                />

                <TableDataGrid
                    data={cheques}
                    filter={filter.search}
                    hasSelection
                    handleSelectionChange={handleSelectionChange}
                    pagination={handlePagination}
                    handleSearchFilter={handleSearch}
                    handleSortFilter={handleSort}
                    columns={columns}
                />
                <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
                <Button
                    disabled={!enableButton}
                    variant="outlined"
                    startIcon={<CallMissedOutgoingOutlinedIcon />}
                    onClick={multipleRelease}
                >
                    Release
                </Button>
            </Box>

                {id && (
                    <ReasonCancellationModal
                        id={[id]}
                        open={open}
                        handleClose={() => {
                            setOpen(false);
                        }}
                    />
                )}
            </PageContainer>

            <PdfReader
                open={openModalPdf}
                handleClose={() => setOpenModalPdf(false)}
                stream={stream}
            />
        </AppLayout>
    );
}
