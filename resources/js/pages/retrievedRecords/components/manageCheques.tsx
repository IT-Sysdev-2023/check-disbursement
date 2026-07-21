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
import {
    Alert,
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import { useState } from 'react';
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
        // setSync(true);
        router.get(scan());
    };

    const handleUpdateScanned = (details: any) => {
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

    const notScannedCheques = cheques.data.filter(
        (cheque) => !cheque.scannedId,
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
            {cheques.data.some((item) => item.scannedId) && (
                <Alert sx={{ width: '100%' }}>
                    <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        gutterBottom
                    >
                        The following cheque numbers have not been scanned:
                    </Typography>

                    <List dense disablePadding>
                        {notScannedCheques.map((item) => (
                            <ListItem key={item.id} sx={{ py: 0 }}>
                                <ListItemText primary={item.chequeNumber} />
                            </ListItem>
                        ))}
                    </List>
                </Alert>
            )}
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
