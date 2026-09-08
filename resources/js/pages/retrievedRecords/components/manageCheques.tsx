import TableFilter from '@/components/tableFilter';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import TableDataGrid from '@/pages/dashboard/components/TableDataGrid';
import { details, detailsCrf, retrievedRecords, scan } from '@/routes';
import {
    FilterType,
    InertiaPagination,
    ManageChecks,
    SelectionType,
} from '@/types';
import { router } from '@inertiajs/react';
import { DocumentScanner } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { createManageColumns } from './columns';
import ScanDetails from './scanDetails';

export default function ManageCheques({
    cheques,
    notScan,
    company,
    businessUnits,
    filter,
}: {
    cheques: InertiaPagination<ManageChecks>;
    notScan: string;
    company: SelectionType[];
    businessUnits: SelectionType[];
    filter: FilterType;
}) {
    const [scannedId, setScannedId] = useState<number>();
    const [scannedDetailsModal, setScannedDetailsModal] = useState(false);

    const handleSyncScanned = () => {
        router.get(scan());
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
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`1-panel1-content`}
                    id={`1-panel1-header`}
                >
                    <Typography component="span">
                        Expand to view cheque numbers that have not been scanned:
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>{notScan}</AccordionDetails>
            </Accordion>
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
                >
                    Sync Cheque Scanned
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
            {/* {checkRecords && (
                <AssignScanDetailsModal
                    borrowedCheckId={checkRecords}
                    title="Input Check Details"
                    open={openInputDetails}
                    onClose={() => setOpenInputDetails(false)}
                />
            )} */}
        </>
    );
}
