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
    ListSelectedChequeType,
    Option,
    SelectedChequeType,
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
import SelectedChequeList from './chequeReleasing/selectedChequeList';
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
    const [selectedCheques, setSelectedCheques] = useState<
        SelectedChequeType[]
    >([]);
    const [selectedRows, setSelectedRows] = useState<ListSelectedChequeType[]>(
        [],
    );
    const [openReleasing, setOpenReleasing] = useState(false);
    const [id, setId] = useState<number | undefined>(undefined);
    const [open, setOpen] = useState(false);
    const [stream, setStream] = useState('');
    const [openModalPdf, setOpenModalPdf] = useState(false);

    const { flash } = usePage().props as {
        flash?: { status?: boolean; message?: string; stream?: string };
    };
    const rowSelectionModel: GridRowSelectionModel = {
        type: 'include',
        ids: new Set(selectedRows.map((row) => row.id)),
    };

    useEffect(() => {
        if (flash?.status && flash?.stream) {
            setStream(flash.stream);
            setOpenModalPdf(true);
        }
    }, [flash]);

    const handleStatusChange = (items: SelectedChequeType, value: string) => {
        if (value === 'cancel') {
            setId(items.id);
            setOpen(true);
            return;
        }

        proceed([items]);
    };

    const multipleRelease = () => {
        const selectedItems = selectedRows.map((item) => ({
            id: item.borrowedChequeId,
            status:
                item.status == 'Manila' || item.status == 'Cebu'
                    ? 'Forward'
                    : item.status == 'Deposit'
                      ? 'Deposit'
                      : 'Release',
        }));

        proceed(selectedItems);
    };

    const proceed = (items: SelectedChequeType[]) => {
        setSelectedCheques(items);
        setOpenReleasing(true);
    };

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
                borrowedChequeId: row.borrowedCheckId,
                chequeNo: row.chequeNumber,
                amount: row.amount,
                chequeDate: row.chequeDate,
                status: row.location,
                releasable: row.scannedId
            }));
        setSelectedRows([...previousSelections, ...currentSelections]);
    };

    const handleDelete = (borrowedCheckId: number) => {
        setSelectedRows((prev) =>
            prev.filter((row) => row.id !== borrowedCheckId),
        );
    };

    const enableButton =
        selectedRows.length > 0 &&
        cheques.data
            .filter((row) =>
                selectedRows.some((r) => r.borrowedChequeId === row.borrowedCheckId),
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
                    rowSelectionModel={rowSelectionModel}
                    handleSelectionChange={handleSelectionChange}
                    pagination={handlePagination}
                    handleSearchFilter={handleSearch}
                    handleSortFilter={handleSort}
                    columns={columns}
                />

                <SelectedChequeList
                    records={selectedRows}
                    handleDelete={handleDelete}
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
