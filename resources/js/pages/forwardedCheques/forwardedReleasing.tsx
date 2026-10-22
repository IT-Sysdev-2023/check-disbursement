import PageContainer from '@/components/pageContainer';
import PdfReader from '@/components/pdf-reader';
import ReleasingModalLocation from '@/components/releasing-modal_location';
import TableFilter from '@/components/tableFilter';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { checkReleasing } from '@/routes';
import {
    FilterType,
    InertiaPagination,
    Option,
    SelectionType,
    SharedData,
    type BreadcrumbItem,
} from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Box, Button } from '@mui/material';
import { FileDown, FileOutput } from 'lucide-react';
import { useEffect, useState } from 'react';
import TableDataGrid from '../dashboard/components/TableDataGrid';
import { forwardColumns } from './components/forwardColumn';

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
    // const [generating, setGenerating] = useState(false);
    const [location, setLocation] = useState('');
    const [openReleasing, setOpenReleasing] = useState(false);

    const uPage = usePage<SharedData>();

    const permissions = uPage.props.auth.user.permissions.map((p) => p.name);
    const flash = uPage.props.flash;
    useEffect(() => {
        if (flash?.status && flash?.stream) {
            setStream(flash.stream);
            setOpenModalPdf(true);
        }
    }, [flash]);

    const exportRecord = async (location: string) => {
        setOpenReleasing(true);
        setLocation(location);
    };

    const column = forwardColumns();
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
                    {permissions.includes('access cebu') && <Button
                        variant="outlined"
                        startIcon={<FileDown />}
                        onClick={() => exportRecord('cebu')}
                        // disabled={generating}
                    >
                        Release to Cebu
                    </Button>}
                    {permissions.includes('access manila') && <Button
                        variant="outlined"
                        startIcon={<FileOutput />}
                        onClick={() => exportRecord('manila')}
                        // disabled={generating}
                    >
                        Release to Manila
                    </Button>}
                </Box>

                <TableDataGrid
                    data={cheques}
                    filter={filter.search}
                    pagination={handlePagination}
                    handleSearchFilter={handleSearch}
                    handleSortFilter={handleSort}
                    columns={column}
                />
            </PageContainer>

            <PdfReader
                open={openModalPdf}
                handleClose={() => setOpenModalPdf(false)}
                stream={stream}
            />

            <ReleasingModalLocation
                location={location}
                receiverNames={receiverNames}
                open={openReleasing}
                handleClose={() => {
                    setOpenReleasing(false);
                }}
            />
        </AppLayout>
    );
}
