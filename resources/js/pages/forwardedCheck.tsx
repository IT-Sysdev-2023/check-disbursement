import useNotifications from '@/components/notifications/useNotifications';
import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
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
import { useState } from 'react';
import TableFilter from '../components/tableFilter';
import { createForwardedCvColumns } from './chequeReleasing/components/columns';
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
    filter,
    receiver,
}: {
    cheques: InertiaPagination<Cv | Crf>;
    filter: {
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
    company: SelectionType[];
    receiver: SelectionType[];
}) {
    const [openModal, setOpenModal] = useState(false);
    const [selectedReceiver, setselectedReceiver] = useState('0');
    const [checkStatusId, setCheckStatusId] = useState<number>();
    const notifications = useNotifications();

    const handleStatusChange = (
        checkStatusId: number,
        value: string,
        checkId: number,
    ) => {
        if (value === 'view') {
            router.visit(signatureDetails(checkId));
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
    
    const columns = createForwardedCvColumns(handleStatusChange);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cheques" />
            <PageContainer title="Receiving">
                <TableFilter company={company} filters={filter} />

                <TableDataGrid
                    data={cheques}
                    filter={filter.search}
                    pagination={handlePagination}
                    handleSearchFilter={handleSearch}
                    handleSortFilter={handleSort}
                    columns={columns}
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
