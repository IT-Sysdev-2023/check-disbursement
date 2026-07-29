import PageContainer from '@/components/pageContainer';
import PdfReader from '@/components/pdf-reader';
import ReasonCancellationModal from '@/components/reason-cancellation-modal';
import ReleasingModal from '@/components/releasing-modal';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { checkReleasing } from '@/routes';
import {
    ChequeResourceType,
    FilterType,
    InertiaPagination,
    Option,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, usePage } from '@inertiajs/react';
import CallMissedOutgoingOutlinedIcon from '@mui/icons-material/CallMissedOutgoingOutlined';
import { Box, Button } from '@mui/material';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import TableFilter from '../components/tableFilter';
import { createReleasingColumns } from './chequeReleasing/components/columns';
import TableDataGrid from './dashboard/components/TableDataGrid';

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
    receiverNames,
}: {
    cheques: InertiaPagination<ChequeResourceType>;
    filter: FilterType;
    company: SelectionType[];
    businessUnits: SelectionType[];
    receiverNames: Option[];
}) {
    const [open, setOpen] = useState(false);
    const [openReleasing, setOpenReleasing] = useState(false);
    const [id, setId] = useState<number | undefined>(undefined);
    const [stream, setStream] = useState('');
    const [selectedCheques, setSelectedCheques] = useState<
        { id: number; status: string }[]
    >([]);
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

    const handleStatusChange = (
        items: { id: number; status: string },
        value: string,
    ) => {
        if (value === 'cancel') {
            setId(items.id);
            setOpen(true);
            return;
        }

        proceed([items]);
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

        proceed(selectedItems);
    };

    const proceed = (items: { id: number; status: string }[]) => {
        setSelectedCheques(items);
        setOpenReleasing(true);
        // router.post(releaseCheck().url, {
        //     cheques: items,
        //     status: status,
        // });
    };

    const [selectedRows, setSelectedRows] = useState<
        { id: number; status: string }[]
    >([]);
    const handleSelectionChange = (model: GridRowSelectionModel) => {
        const selectedR = cheques.data
            .filter((row) => model.ids.has(row.id))
            .map((row) => ({
                id: row.borrowedCheckId,
                status: row.location,
            }));

        setSelectedRows(selectedR);
    };

    const enableButton =
        selectedRows.length > 0 &&
        cheques.data
            .filter((row) =>
                selectedRows.some((r) => r.id === row.borrowedCheckId),
            )
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

                <ReleasingModal
                    cheques={selectedCheques}
                    receiverNames={receiverNames}
                    open={openReleasing}
                    handleClose={() => {
                        setOpenReleasing(false);
                    }}
                />
            </PageContainer>

            <PdfReader
                open={openModalPdf}
                handleClose={() => setOpenModalPdf(false)}
                stream={stream}
            />
        </AppLayout>
    );
}
