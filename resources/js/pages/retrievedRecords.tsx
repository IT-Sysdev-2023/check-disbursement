import AppLayout from '@/layouts/app-layout';
import {
    Auth,
    Borrower,
    BuType,
    ChequeType,
    FilterType,
    InertiaPagination,
    ManageChecks,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { router } from '@inertiajs/react';
import {
    AdfScannerOutlined,
    CalendarToday,
    SwipeVertical,
    ViewCompact,
} from '@mui/icons-material';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import PageContainer from '../components/pageContainer';
import BorrowedTableGrid from './dashboard/components/borrowedTableGrid';
import {
    Calendar,
    ProgressModal,
    TableView,
} from './retrievedRecords/components';
import ManageCheques from './retrievedRecords/components/manageCheques';
import { retrievedRecords } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retrieved CV/CRF',
        href: '#',
    },
];

export default function RetrievedRecords({
    cheques,
    manageChecks,
    pending,
    filter,
    company,
    counts,
    calendar,
    businessUnits,
    auth,
}: {
    filter: FilterType;
    counts: {
        toAssign: string;
        completed: string;
    };
    businessUnits: SelectionType[];
    calendar: InertiaPagination<BuType>;
    cheques: InertiaPagination<ChequeType>;
    pending: InertiaPagination<Borrower>;
    company: SelectionType[];
    manageChecks: InertiaPagination<ManageChecks>;
    auth: Auth;
}) {
    const [openProgress, setOpenProgress] = useState(false);
    const [currentTab, setCurrentTab] = useState(filter.tab);
    // const [pendingId, setPendingId] = useState<number>();
    // const [pendingModal, setPendingModal] = useState(false);

    const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
        if (newValue === null) return;
        if (newValue !== 'calendar') {
            router.get(retrievedRecords(), {
                tab: newValue,
            }, {
                replace: true,
                preserveState: true
            });
        }

        setCurrentTab(newValue);
    };

    const handleClickCalendar = () => {
        setCurrentTab('cheques');
    };

    // const handleOnView = (id: number) => {
    //     setPendingModal(true);
    //     setPendingId(id);
    // };

    // const pendingColumns = createPendingChequeColumns(handleOnView);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <PageContainer title="Retrieved CV/CRF">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <ToggleButtonGroup
                        color="primary"
                        value={currentTab}
                        exclusive
                        onChange={handleChangeTab}
                        aria-label="Platform"
                    >
                        <ToggleButton value="calendar">
                            <CalendarToday sx={{ mr: 1, fontSize: 18 }} />
                            Calendar View
                        </ToggleButton>
                        <ToggleButton value="cheques">
                            <ViewCompact sx={{ mr: 1, fontSize: 18 }} />
                            Table View
                        </ToggleButton>
                        <ToggleButton value="borrowed">
                            <SwipeVertical sx={{ mr: 1, fontSize: 18 }} />
                            Borrowed Cheques
                        </ToggleButton>
                        <ToggleButton value="manageChecks">
                            <AdfScannerOutlined sx={{ mr: 1, fontSize: 18 }} />
                            Manage Cheques
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <Box sx={{ mt: 5 }}>
                        {currentTab === 'calendar' && (
                            <Calendar
                                userId={auth.user.id}
                                data={calendar}
                                company={company}
                                onChangeTab={handleClickCalendar}
                            ></Calendar>
                        )}
                        {currentTab === 'cheques' && (
                            <TableView
                                cheques={cheques}
                                company={company}
                                businessUnits={businessUnits}
                                filter={filter}
                                counts={counts}
                            />
                        )}
                        {currentTab === 'borrowed' && (
                            <BorrowedTableGrid data={pending} />
                        )}
                        {currentTab === 'manageChecks' && (
                            <ManageCheques
                                cheques={manageChecks}
                                company={company}
                                businessUnits={businessUnits}
                                filter={filter}
                            />
                        )}
                    </Box>
                </Box>
            </PageContainer>

           
            {/* 
            {pendingId && (
                <PendingDetails
                    id={pendingId}
                    title="Check Details"
                    open={pendingModal}
                    onClose={() => setPendingModal(false)}
                />
            )} */}
            <ProgressModal
                userId={auth.user.id}
                open={openProgress}
                handleClose={() => setOpenProgress(false)}
            />
        </AppLayout>
    );
}
