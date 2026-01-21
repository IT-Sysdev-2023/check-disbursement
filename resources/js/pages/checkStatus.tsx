import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { detailsCrf, signatureDetails } from '@/routes';
import {
    CheckScannedDetails,
    ChequeType,
    DateFilterType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { createStatusChequeColumns } from './checkStatus/components/columns';
import ScannedDetails from './checkStatus/components/scannedDetails';
import TableDataGrid from './dashboard/components/TableDataGrid';
import TableFilter from '@/components/tableFilter';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Status',
        href: '#',
    },
];

export default function CheckStatus({
    cheques,
    company,
    filter,
}: {
    cheques: InertiaPagination<ChequeType>;
    company: SelectionType[];
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
}) {
    const [openModal, setOpenModal] = useState(false);
    const [scannedRecord, setScannedRecord] = useState<CheckScannedDetails>();

    const handleStatusChange = (
        value: string,
        record: CheckScannedDetails
    ) => {
        if (value === 'details') {
            if (record.type === 'cv') router.visit(signatureDetails(record.id));
            else router.visit(detailsCrf(record.id));
        } else {
            setOpenModal(true);
            setScannedRecord(record);
        }
    };

    const chequeColumn = createStatusChequeColumns(handleStatusChange);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Check Status">
                <TableFilter
                    company={company}
                    filters={filter}
                />

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
                        title="Check Details"
                        open={openModal}
                        onClose={() => setOpenModal(false)}
                    />
                )}
            </PageContainer>
        </AppLayout>
    );
}
