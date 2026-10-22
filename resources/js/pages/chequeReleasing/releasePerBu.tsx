import PageContainer from '@/components/pageContainer';
import PdfReader from '@/components/pdf-reader';
import ReleasingModalLocation from '@/components/releasing-modal_location';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import {
    FilterType,
    InertiaPagination,
    Option,
    SelectionType,
    SharedData,
    type BreadcrumbItem,
} from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Box, Button, SelectChangeEvent } from '@mui/material';
import { FileDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import SelectItem from '../dashboard/components/SelectItem';
import TableDataGrid from '../dashboard/components/TableDataGrid';
import { perBuColumn } from './components/columns';
import ReleasingModalBu from '@/components/releasing-modal-bu';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cheque Releasing',
        href: '#',
    },
];

export default function ReleasePerBu({
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
    const [openReleasing, setOpenReleasing] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<string>(
        filter.selectedCompany ?? 'all',
    );
    const [selectedBu, setSelectedBu] = useState<string>(filter.selectedBu);

    const uPage = usePage<SharedData>();

    const flash = uPage.props.flash;
    useEffect(() => {
        if (flash?.status && flash?.stream) {
            setStream(flash.stream);
            setOpenModalPdf(true);
        }
    }, [flash]);

    const releaseRecords = () => {
        setOpenReleasing(true);
    };

    const handleChange = async (event: SelectChangeEvent) => {
        const val = event.target.value;
        setSelectedCompany(val);

        router.reload({
            data: {
                company: event.target.value,
            },
            // onStart: () => onLoading?.(true),
            // onFinish: () => onLoading?.(false),
        });
    };

    const handleChangeBu = (event: SelectChangeEvent) => {
        setSelectedBu(event.target.value);

        router.reload({
            data: {
                bu: event.target.value,
            },
            // onStart: () => onLoading?.(true),
            // onFinish: () => onLoading?.(false),
        });
    };

    const column = perBuColumn();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Cheque Releasing">
                {/* <TableFilter
                    company={company}
                    filters={filter}
                    handleChangeCheck={() => null}
                    businessUnits={businessUnits}
                    resetFilterRouter={checkReleasing()}
                /> */}

                <Box
                    display="flex"
                    justifyContent="flex-end"
                    mt={3}
                    mb={3}
                    gap={2}
                >
                    <SelectItem
                        handleChange={handleChange}
                        value={selectedCompany}
                        title="Company"
                        items={company}
                    />

                    {businessUnits && (
                        <SelectItem
                            handleChange={handleChangeBu}
                            value={selectedBu}
                            title="Business Unit"
                            items={businessUnits}
                        />
                    )}
                    <Button
                        variant="outlined"
                        startIcon={<FileDown />}
                        onClick={releaseRecords}
                        // disabled={generating}
                    >
                        Release Business Unit
                    </Button>
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

            <ReleasingModalBu
                selectedBu={selectedBu}
                selectedCompany={selectedCompany}
                receiverNames={receiverNames}
                open={openReleasing}
                handleClose={() => {
                    setOpenReleasing(false);
                }}
            />
        </AppLayout>
    );
}
