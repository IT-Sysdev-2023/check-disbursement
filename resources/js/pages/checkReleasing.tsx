import PageContainer from '@/components/pageContainer';
import PdfReader from '@/components/pdf-reader';
import ReasonCancellationModal from '@/components/reason-cancellation-modal';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
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
import { SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react';
import TableFilter from '../components/tableFilter';
import { createReleasingCvColumns } from './checkReleasing/components/columns';
import TableDataGrid from './dashboard/components/TableDataGrid';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Releasing',
        href: '#',
    },
];

export default function CheckReleasing({
    cheques,
    company,
    // defaultCheck,
    filter,
}: {
    cheques: InertiaPagination<Cv | Crf>;
    // defaultCheck: string;
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
    company: SelectionType[];
}) {
    const [check, setCheck] = useState('cv');
    const [tableLoading, setTableLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [id, setId] = useState<number | undefined>(undefined);
    const [stream, setStream] = useState('');
    const [openModalPdf, setOpenModalPdf] = useState(false);

    const { flash } = usePage().props as {
        flash?: { status?: boolean; message?: string; stream?: string };
    };

    useEffect(() => {
        if (flash?.status && flash?.stream) {
            setStream(flash.stream);
            setOpenModalPdf(true);
        }
    }, [flash]);

    const handleStatusChange = (id: number, value: string) => {
        if (value === 'cancel') {
            setId(id);
            setOpen(true);
            return;
        }

        router.push({
            url: releaseCheck([id, value]).url,
            component: 'checkReleasing/releaseCheck',
            props: (curr) => ({
                ...curr,
                id: id,
                status: value,
                label: value + ' Check',
            }),
        });
    };

    const handleCheck = (event: SelectChangeEvent) => {
        // setCheck(event.target.value);
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

    const cvColumns = createReleasingCvColumns(handleStatusChange);
    // const crfColumns = createReleasingCrfColumns(handleStatusChange);

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
                    columns={cvColumns}
                    isLoading={tableLoading}
                />
                {/* <Copyright sx={{ my: 4 }} /> */}

                {id && (
                    <ReasonCancellationModal
                        id={id}
                        open={open}
                        handleClose={() => {
                            setOpen(false);
                        }}
                    />
                )}
            </PageContainer>

            <PdfReader
                open={openModalPdf}
                handleClose={() => setOpenModalPdf(false)}
                stream={stream}
            />
        </AppLayout>
    );
}
