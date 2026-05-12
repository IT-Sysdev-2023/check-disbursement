import TableFilter from '@/components/tableFilter';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import TableDataGrid from '@/pages/dashboard/components/TableDataGrid';
import { details, detailsCrf, retrievedRecords } from '@/routes';
import {
    FilterType,
    InertiaPagination,
    ManageChecks,
    SelectionType,
} from '@/types';
import { router } from '@inertiajs/react';
import { DocumentScanner } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import AssignScanDetailsModal from './assignScanDetailsModal';
import { createManageColumns } from './columns';
import ScanDetails from './scanDetails';

export default function ManageCheques({
    cheques,
    company,
    businessUnits,
    filter,
}: {
    cheques: InertiaPagination<ManageChecks>;
    company: SelectionType[];
    businessUnits: SelectionType[];
    filter: FilterType;
}) {
    const [scannedId, setScannedId] = useState<number>();
    const [checkRecords, setCheckRecords] = useState({});
    const [scannedDetailsModal, setScannedDetailsModal] = useState(false);
    const [openInputDetails, setOpenInputDetails] = useState(false);
    const [sync, setSync] = useState(false);

    const handleSyncScanned = () => {
        setSync(true);
        localStorage.setItem('syncScanned', 'true');
        // router.get(
        //     scan(),
        //     {},
        //     {
        //         preserveState: true,
        //         preserveScroll: true,
        //         onStart: () => {
        //             setOpenProgress(true);
        //         },
        //         onSuccess: () => {
        //             setOpenProgress(false);
        //         },
        //     },
        // );
    };

    const handleUpdateScanned = (details) => {
        if (!sync) {
            alert('Please Sync Cheque Scan first');
            return;
        }
        setOpenInputDetails(true);

        if (details) setCheckRecords(details);
    };
    const handleScanDetails = (id: number) => {
        setScannedDetailsModal(true);
        setScannedId(id);
    };

    const handleDetails = (id: number, type: 'cv' | 'crf') => {
        if (type === 'cv') router.visit(details(id));
        else router.visit(detailsCrf(id));
    };
    const manageCvColumns = createManageColumns(
        handleDetails,
        handleUpdateScanned,
        handleScanDetails,
    );
    return (
        <>
            <TableFilter
                handleChangeCheck={() => null}
                company={company}
                filters={filter}
                resetFilterRouter={retrievedRecords()}
                businessUnits={businessUnits}
            />
            <TableDataGrid
                data={cheques}
                filter={filter.search}
                pagination={handlePagination}
                handleSearchFilter={handleSearch}
                handleSortFilter={handleSort}
                columns={manageCvColumns}
            />

            <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                    variant="outlined"
                    startIcon={<DocumentScanner />}
                    onClick={handleSyncScanned}
                    disabled={sync}
                >
                    Sync Check Scanned
                </Button>
            </Box>

            {/* scannedDetailsModal */}
            {scannedId && (
                <ScanDetails
                    id={scannedId}
                    title="Scanned Check Details"
                    open={scannedDetailsModal}
                    onClose={() => setScannedDetailsModal(false)}
                />
            )}
            {checkRecords && (
                <AssignScanDetailsModal
                    borrowedCheckId={checkRecords}
                    title="Input Check Details"
                    open={openInputDetails}
                    onClose={() => setOpenInputDetails(false)}
                />
            )}
        </>
    );
}
