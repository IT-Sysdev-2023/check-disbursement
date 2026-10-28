import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { checkReleasing } from '@/routes';
import {
    BatchReleasingType,
    FilterType,
    InertiaPagination,
    Option,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head } from '@inertiajs/react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import TableFilter from '../components/tableFilter';
import ChequeReleasingBatch from './chequeReleasing/chequeReleasingBatch';

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
    cheques: InertiaPagination<BatchReleasingType>;
    filter: FilterType;
    company: SelectionType[];
    businessUnits: SelectionType[];
    receiverNames: Option[];
}) {

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

                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Batch Reference</TableCell>
                                <TableCell>Supplier</TableCell>
                                <TableCell>Scan Method</TableCell>
                                <TableCell>Total Cheques</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cheques?.data?.length ? (
                                cheques.data.map((row) => (
                                    <ChequeReleasingBatch
                                        receiverNames={receiverNames}
                                        key={row.id}
                                        row={row}
                                        isVisible
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No records found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </PageContainer>

        </AppLayout>
    );
}
