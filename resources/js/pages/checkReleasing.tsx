import PageContainer from '@/components/pageContainer';
import ReasonCancellationModal from '@/components/reason-cancellation-modal';
import AppLayout from '@/layouts/app-layout';
import { releaseCheck } from '@/routes';
import {
    Crf,
    Cv,
    DateFilterType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Box, Modal, SelectChangeEvent } from '@mui/material';
import {
    GridFilterModel,
    GridPaginationModel,
    GridSortModel,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import TableFilter from '../components/tableFilter';
import {
    createReleasingCrfColumns,
    createReleasingCvColumns,
} from './checkReleasing/components/columns';
import TableDataGrid from './dashboard/components/TableDataGrid';
import PdfReader from '@/components/pdf-reader';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Releasing',
        href: '#',
    },
];


export default function CheckReleasing({
    cheques,
    company,
    defaultCheck,
    filter,
}: {
    cheques: InertiaPagination<Cv | Crf>;
    defaultCheck: string;
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
    company: SelectionType[];
}) {
    console.log(cheques);
    const [check, setCheck] = useState(defaultCheck);
    const [tableLoading, setTableLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [checkId, setCheckId] = useState<number | undefined>(undefined);
    const [stream, setStream] = useState('');
    const [openModalPdf, setOpenModalPdf] = useState(false);
    const handlePagination = (model: GridPaginationModel) => {
        const page = model.page + 1;
        const per_page = model.pageSize;

        router.reload({
            data: {
                page: page,
                per_page: per_page,
            },
        });
    };

    const { flash } = usePage().props as {
        flash?: { status?: boolean; message?: string; stream?: string };
    };

    useEffect(() => {
        if (flash?.status && flash?.stream) {
            setStream(flash.stream);
            setOpenModalPdf(true);
        }
    }, [flash]);

    const handleSearch = (model: GridFilterModel) => {
        const query = model.quickFilterValues?.length
            ? model.quickFilterValues?.[0]
            : '';

        router.reload({
            data: {
                search: query,
            },
            only: [check === 'cv' ? 'cv' : 'crf'],
            replace: true,
        });
    };

    const handleCheck = (event: SelectChangeEvent) => {
        setCheck(event.target.value);
        router.reload({
            data: {
                selectedCheck: event.target.value,
            },
            only: ['cheques'],
            replace: true,
            onStart: () => setTableLoading(true),
            onFinish: () => setTableLoading(false),
        });
    };

    const handleSort = (model: GridSortModel) => {
        router.reload({
            data: {
                sort: {
                    field: model[0].field,
                    sort: model[0].sort,
                },
            },
            only: [check === 'cv' ? 'cv' : 'crf'],
            replace: true,
        });
    };

    const handleStatusChange = (
        checkId: number,
        value: string,
        check: string,
    ) => {
        if (value === 'cancel') {
            setCheckId(checkId);
            setOpen(true);
            return;
        }

        router.push({
            url: releaseCheck([checkId, value, check]).url,
            component: 'checkReleasing/releaseCheck',
            props: (curr) => ({
                ...curr,
                checkId: checkId,
                status: value,
                check: check,
                label: value + ' Check',
            }),
        });
    };

    const cvColumns = createReleasingCvColumns(handleStatusChange);
    const crfColumns = createReleasingCrfColumns(handleStatusChange);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Check Releasing">
                <TableFilter
                    currentTab="cheques"
                    handleChangeCheck={handleCheck}
                    company={company}
                    filters={filter}
                    check={check}
                />

                <TableDataGrid
                    data={cheques}
                    filter={filter.search}
                    pagination={handlePagination}
                    handleSearchFilter={handleSearch}
                    handleSortFilter={handleSort}
                    columns={check === 'cv' ? cvColumns : crfColumns}
                    isLoading={tableLoading}
                />
                {/* <Copyright sx={{ my: 4 }} /> */}

                <ReasonCancellationModal
                    checkId={checkId ?? 0}
                    check={check}
                    open={open}
                    handleClose={() => {
                        setOpen(false);
                    }}
                />
            </PageContainer>

            <PdfReader open={openModalPdf} handleClose={() => setOpenModalPdf(false)} stream={stream}/>
        </AppLayout>
    );
}
