import PageContainer from '@/components/pageContainer';
import { usePdfPreview } from '@/components/PdfPreview';
import TableFilter from '@/components/tableFilter';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import {
    closingCheque,
    exportPdfBu,
} from '@/routes';
import {
    ChequeStatus,
    FilterType,
    FlashReponse,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import { SwipeVertical, ViewCompact } from '@mui/icons-material';
import {
    Button,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import { FileDown } from 'lucide-react';
import { SyntheticEvent } from 'react';
import { createClosingCvColumns } from './closing/components/columns';
import TableDataGrid from './dashboard/components/TableDataGrid';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Status',
        href: '#',
    },
];
export default function CvCrfList({
    cheques,
    company,
    filter,
    businessUnits,
}: {
    cheques: InertiaPagination<ChequeStatus>;
    company: SelectionType[];
    businessUnits: SelectionType[];
    filter: FilterType;
    }) {
    
    const { openPdf } = usePdfPreview();

    const handleGetFiles = async () => {
        // const { data } = await axios.post(submitDocuments().url, {
        //     chequeNumber: recordDetails?.checkNo,
        //     id: recordDetails?.id,
        // });

        // if (data.status === 'success') {
        //     notifications.show(data.message, {
        //         severity: 'success',
        //         autoHideDuration: 3000,
        //     });
        //     setOpenScan(false);
        // }
    };

    const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
        if (newValue === null) return;
        router.get(
            closingCheque(),
            {
                tab: newValue,
            },
            { replace: true },
        );
    };
    const generatePdf = () => {
        router.post(
            exportPdfBu(),
            {
                company: filter.selectedCompany,
                bu: filter.selectedBu,
            },
            {
                onSuccess: ({ props }) => {
                    const m = props.flash as FlashReponse;
                    if (m.status) {
                        openPdf(m.stream!);
                    }
                },
            },
        );
    };
    // const generateAll = () => {
    //     router.post(
    //         exportPdfAll(),
    //         {},
    //         {
    //             onSuccess: ({ props }) => {
    //                 const m = props.flash as FlashReponse;
    //                 if (m.status) {
    //                     openPdf(m.stream!);
    //                 }
    //             },
    //         },
    //     );
    // };
    const isDisabled = filter.selectedBu != '' && filter.selectedBu != '';

    const columns = createClosingCvColumns();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Closing Cheques">
                <ToggleButtonGroup
                    color="primary"
                    value={filter.tab}
                    exclusive
                    onChange={handleChangeTab}
                    aria-label="Platform"
                >
                    <ToggleButton value="doc_required">
                        <ViewCompact sx={{ mr: 1, fontSize: 18 }} />
                        Document Required
                    </ToggleButton>
                    <ToggleButton value="doc_uploaded">
                        <SwipeVertical sx={{ mr: 1, fontSize: 18 }} />
                        Document Uploaded
                    </ToggleButton>
                </ToggleButtonGroup>

                <TableFilter
                    company={company}
                    businessUnits={businessUnits}
                    filters={filter}
                >
                    {filter.tab == 'doc_uploaded' && (
                        <>
                            <Button
                                disabled={!isDisabled}
                                variant="outlined"
                                startIcon={<FileDown />}
                                onClick={generatePdf}
                            >
                                Export
                            </Button>
                        </>
                    )}
                </TableFilter>

                <TableDataGrid
                    data={cheques}
                    filter={filter.search}
                    pagination={handlePagination}
                    handleSearchFilter={handleSearch}
                    handleSortFilter={handleSort}
                    columns={columns}
                />
                {/* </Box> */}
            </PageContainer>
        </AppLayout>
    );
}
