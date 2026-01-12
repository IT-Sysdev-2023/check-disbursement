import useNotifications from '@/components/notifications/useNotifications';
import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { receiverForwarded, signatureDetails } from '@/routes';
import {
    Crf,
    Cv,
    DateFilterType,
    FlashReponse,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import { SelectChangeEvent } from '@mui/material';
import {
    GridFilterModel,
    GridPaginationModel,
    GridSortModel,
} from '@mui/x-data-grid';
import { useState } from 'react';
import TableFilter from '../components/tableFilter';
import {
    createForwardedCvColumns,
    createReleasingCrfColumns,
} from './checkReleasing/components/columns';
import TableDataGrid from './dashboard/components/TableDataGrid';
import OnlySelectionModal from './dashboard/components/onlySelectionModal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Releasing',
        href: '#',
    },
];

export default function ForwardedCheck({
    cheques,
    company,
    defaultCheck,
    filter,
    receiver,
}: {
    cheques: InertiaPagination<Cv | Crf>;
    defaultCheck: string;
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
    company: SelectionType[];
    receiver: SelectionType[];
}) {
    const [check, setCheck] = useState(defaultCheck);
    const [tableLoading, setTableLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedReceiver, setselectedReceiver] = useState('0');
    const [checkStatusId, setCheckStatusId] = useState<number>();
    const notifications = useNotifications();
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

    const handleStatusChange = (checkStatusId: number, value: string) => {
        if (value === 'view') {
            router.visit(signatureDetails(checkStatusId));
            return;
        }
        setCheckStatusId(checkStatusId);
        setOpenModal(true);
    };

    const handleReceiveSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (checkStatusId)
            router.put(
                receiverForwarded(checkStatusId),
                {},
                {
                    preserveScroll: true,
                    onSuccess: ({ props }) => {
                        const m = props.flash as FlashReponse;

                        setOpenModal(false);
                        notifications.show(m.message, {
                            severity: 'error',
                            autoHideDuration: 3000,
                        });
                    },
                },
            );
    };

    const cvColumns = createForwardedCvColumns(handleStatusChange);
    const crfColumns = createReleasingCrfColumns(handleStatusChange);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Receiving">
                <TableFilter
                    isCheckDisabled
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
                <OnlySelectionModal
                    title="Received By :"
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    handleSubmit={handleReceiveSubmit}
                    handleSelectedItem={(e) =>
                        setselectedReceiver(e.target.value)
                    }
                    selectedItem={selectedReceiver}
                    item={receiver}
                />
            </PageContainer>
        </AppLayout>
    );
}
