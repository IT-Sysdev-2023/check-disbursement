import PageContainer from '@/components/pageContainer';
import PdfReader from '@/components/pdf-reader';
import ReleasingModalAll from '@/components/releasing-modal_all';
import TableFilter from '@/components/tableFilter';
import AppLayout from '@/layouts/app-layout';
import { checkReleasing } from '@/routes';
import {
    FilterType,
    InertiaPagination,
    Option,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, usePage } from '@inertiajs/react';
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
import { FileDown, FileOutput } from 'lucide-react';
import { useEffect, useState } from 'react';
import ForwardedChequeBatch from './components/forwardedChequeBatch';
import ReleasingModalLocation from '@/components/releasing-modal_location';

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
    const [generating, setGenerating] = useState(false);
    const [location, setLocation] = useState('');
    const [openReleasing, setOpenReleasing] = useState(false);
    const { flash } = usePage().props as {
        flash?: { status?: boolean; message?: string; stream?: string };
    };

    useEffect(() => {
        if (flash?.status && flash?.stream) {
            setStream(flash.stream);
            setOpenModalPdf(true);
        }
    }, [flash]);

    const exportRecord = async (location: string) => {
        setOpenReleasing(true);
        setLocation(location);
        // setGenerating(true);
        // router.post(
        //     generateLocationPdf(location),
        //     {},
        //     {
        //         preserveScroll: true,
        //         preserveState: true,
        //         onSuccess: (page) => {
        //             const m = page.props.flash as FlashReponse;

        //             if (m.status && m.stream) {
        //                 setStream(m.stream);
        //                 setOpenModalPdf(true);
        //             }

        //             setGenerating(false);
        //         },
        //         onError: (e) => {
        //             console.log(e);
        //         },
        //     },
        // );
    };
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
                        onClick={() => exportRecord('cebu')}
                        disabled={generating}
                    >
                        Release to Cebu
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<FileOutput />}
                        onClick={() => exportRecord('manila')}
                        disabled={generating}
                    >
                        Release to Manila
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
                                {/* <TableCell align="center">Action</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cheques?.data?.length ? (
                                cheques.data.map((row) => (
                                    <ForwardedChequeBatch
                                        receiverNames={receiverNames}
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

            <ReleasingModalLocation
                location= {location}
                receiverNames={receiverNames}
                open={openReleasing}
                handleClose={() => {
                    setOpenReleasing(false);
                }}
            />
        </AppLayout>
    );
}
