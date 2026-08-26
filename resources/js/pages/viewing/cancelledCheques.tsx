import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import {
    detailsCrf,
    signatureDetails,
} from '@/routes';
import {
    CheckScannedDetails,
    ChequeType,
    FilterType,
    InertiaPagination,
    type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import { Box } from '@mui/material';
import {  useState } from 'react';
import { createCancelledChequeColumns } from '../checkStatus/components/columns';
import TableDataGrid from '../dashboard/components/TableDataGrid';
import ScannedDetails from '../checkStatus/components/scannedDetails';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cancelled Cheques',
        href: '#',
    },
];

export default function CancelledCheques({
    cheques,
    filter,
}: {
    cheques: InertiaPagination<ChequeType>;
    filter: FilterType;
}) {
    const [openModal, setOpenModal] = useState(false);
    const [scannedRecord, setScannedRecord] = useState<CheckScannedDetails>();

    const handleStatusChange = (value: string, record: CheckScannedDetails) => {
         if (value === 'details') {
            if (record.type === 'cv') router.visit(signatureDetails(record.id));
            else router.visit(detailsCrf(record.id));
        } else {
            setOpenModal(true);
            setScannedRecord(record);
        }
    };

    const chequeColumn = createCancelledChequeColumns(handleStatusChange);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Cancelled Cheques">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                   
                    <TableDataGrid
                        data={cheques}
                        filter={filter.search}
                        pagination={handlePagination}
                        handleSearchFilter={handleSearch}
                        handleSortFilter={handleSort}
                        columns={chequeColumn}
                    />

                    {scannedRecord && (
                        <ScannedDetails
                            record={scannedRecord}
                            title="Cheque Details"
                            open={openModal}
                            onClose={() => setOpenModal(false)}
                        />
                    )}
                </Box>
            </PageContainer>
        </AppLayout>
    );
}
