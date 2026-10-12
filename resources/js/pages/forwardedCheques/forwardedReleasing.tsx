import PageContainer from '@/components/pageContainer';
import PdfReader from '@/components/pdf-reader';
import TableFilter from '@/components/tableFilter';
import AppLayout from '@/layouts/app-layout';
import { checkReleasing, generateCebu } from '@/routes';
import {
    FilterType,
    InertiaPagination,
    Option,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import ForwardedChequeBatch from './components/forwardedChequeBatch';
import { LocationOnOutlined } from '@mui/icons-material';
import { FileDown, FileOutput } from 'lucide-react';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cheque Releasing',
        href: '#',
    },
];

export default function ForwardedReleasing({
    cheques,
    company,
    filter,
    businessUnits,
    receiverNames,
}: {
    cheques: InertiaPagination<any>;
    filter: FilterType;
    company: SelectionType[];
    businessUnits: SelectionType[];
    receiverNames: Option[];
}) {
    const [stream, setStream] = useState('');
    const [openModalPdf, setOpenModalPdf] = useState(false);
const [generatingCebu, setGeneratingCebu] = useState(false);
    const { flash } = usePage().props as {
        flash?: { status?: boolean; message?: string; stream?: string };
    };

    useEffect(() => {
        if (flash?.status && flash?.stream) {
            setStream(flash.stream);
            setOpenModalPdf(true);
        }
    }, [flash]);

    const exportCebu = async()=> {
         try {
        setGeneratingCebu(true);

        const response = await axios.post(
            generateCebu('cebu').url
        );
        window.location.href = response.data.download_url;
        } catch (error) {
            console.error('Failed to generate Excel file', error);
        } finally {
            setGeneratingCebu(false);
        }
    }
    const exportManila = () => {
        router.post(generateCebu('manila'));
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Forwarded Cheque Releasing">
                <TableFilter
                    company={company}
                    filters={filter}
                    handleChangeCheck={() => null}
                    businessUnits={businessUnits}
                    resetFilterRouter={checkReleasing()}
                />
                <Box
                        display="flex"
                        justifyContent="flex-end"
                    mt={3}
                    mb={3}
                        gap={2}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<FileDown />}
                        onClick={exportCebu}
                        disabled={generatingCebu}
                        >
                            Export Cebu Record
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<FileOutput />}
                            onClick={exportManila}
                        >
                            Export Manila Record
                        </Button>
                </Box>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Batch Reference</TableCell>
                                <TableCell>Supplier</TableCell>
                                <TableCell>Scan Method</TableCell>
                                <TableCell>Total Cheques</TableCell>
                                <TableCell align='center'>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cheques?.data?.length ? (
                                cheques.data.map((row) => (
                                    <ForwardedChequeBatch
                                        receiverNames= {receiverNames}
                                        key={row.borrowerNo}
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

            <PdfReader
                open={openModalPdf}
                handleClose={() => setOpenModalPdf(false)}
                stream={stream}
            />
        </AppLayout>
    );
}
