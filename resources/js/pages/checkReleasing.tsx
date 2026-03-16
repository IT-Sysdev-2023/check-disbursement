import PageContainer from '@/components/pageContainer';
import PdfReader from '@/components/pdf-reader';
import ReasonCancellationModal from '@/components/reason-cancellation-modal';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { releaseCheck } from '@/routes';
import {
    Crf,
    Cv,
    FilterType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import TableFilter from '../components/tableFilter';
import { createReleasingColumns } from './chequeReleasing/components/columns';
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
    filter,
}: {
    cheques: InertiaPagination<Cv | Crf>;
    filter: FilterType;
    company: SelectionType[];
}) {
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
            component: 'chequeReleasing/releaseCheck',
            props: (curr) => ({
                ...curr,
                id: id,
                status: value,
                label: value + ' Check',
            }),
        });
    };
;
    const columns = createReleasingColumns(handleStatusChange);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Check Releasing">
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
                    columns={columns}
                />
                {/* <Copyright sx={{ my: 4 }} /> */}

                {id && (
                    <ReasonCancellationModal
                        id={[id]}
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
