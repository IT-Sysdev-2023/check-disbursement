import PageContainer from '@/components/pageContainer';
import TableFilter from '@/components/tableFilter';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { chequeStatus, detailsCrf, dsImages, signatureDetails } from '@/routes';
import {
    Auth,
    ChequeType,
    FilterType,
    IdType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    AccessAlarmsOutlined,
    AccountBalanceOutlined,
    AssignmentReturnedOutlined,
    CancelPresentationOutlined,
    DownloadDoneOutlined,
    EventOutlined,
    SwipeRightOutlined,
} from '@mui/icons-material';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import {
    Box,
    Card,
    CardContent,
    SelectChangeEvent,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { SyntheticEvent, useState } from 'react';
import {
    chequeStatusColumns,
    pdcColumn,
} from './checkStatus/components/columns';
import SelectItem from './dashboard/components/SelectItem';
import TableDataGrid from './dashboard/components/TableDataGrid';
import ImageViewing from './imageViewing';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Status',
        href: '#',
    },
];

export default function ChequeStatus({
    cheques,
    company,
    businessUnits,
    filter,
    banks,
    bankAccounts,
    auth,
}: {
    cheques: InertiaPagination<ChequeType>;
    businessUnits: SelectionType[];
    company: SelectionType[];
    filter: FilterType;
    banks: SelectionType[];
    bankAccounts: SelectionType[];
    auth: Auth;
}) {
    const [loading, setLoading] = useState(false);
    const [viewDoc, setViewDoc] = useState(false);
    const [images, setImages] = useState([]);

    const handleStatusChange = (value: string, record: IdType) => {
        if (value === 'details') {
            if (record.type === 'cv')
                router.get(signatureDetails(), {
                    id: record.id,
                    type: record.type,
                });
            else router.visit(detailsCrf(record.id));
        } else {
            handleAction(record.borrowedId);
        }
    };

    const handleAction = async (id: number) => {
        const { data } = await axios.get(dsImages(id).url);
        setImages(data.images);
        setViewDoc(true);
    };

    const [tab, setTab] = useState(filter.tab);

    const defaultBank = banks.find((bank) => bank.label === filter.bank);
    const defaultBankAccount = bankAccounts.find(
        (bankAccount) => bankAccount.label === filter.bankAccount,
    );
    const [selectedBank, setSelectedBank] = useState(
        defaultBank ? defaultBank.value : 'all',
    );
    const [selectedBankAccount, setSelectedBankAccount] = useState(
        defaultBankAccount ? defaultBankAccount.value : 'all',
    );

    const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
        router.reload({
            only: ['cheques'],
            data: {
                tab: newValue,
            },
            onBefore: () => setLoading(true),
            onFinish: () => setLoading(false),
            onSuccess: () => setTab(newValue),
        });
    };

    const handleChange = async (event: SelectChangeEvent) => {
        const val = event.target.value;
        setSelectedBank(val);

        const selected = banks.find((bank) => bank.value === val);
        router.reload({
            data: {
                bank: selected?.label,
                bankAccount: null,
            },
        });
    };

    const handleChangeBa = async (event: SelectChangeEvent) => {
        const val = event.target.value;
        setSelectedBankAccount(val);

        const selected = bankAccounts.find((bank) => bank.value === val);
        router.reload({
            data: {
                bankAccount: selected?.label,
            },
        });
    };

    const isRegional = auth.user.roles.some(
        (role) =>
            role.name === 'corporate_disbursing_clerk(forwarded_releasing)',
    );

    const columns =
        tab === 'pdc' || tab == 'staled'
            ? pdcColumn()
            : chequeStatusColumns(handleStatusChange);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Cheque Status">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <ToggleButtonGroup
                        color="primary"
                        value={tab}
                        exclusive
                        onChange={handleChangeTab}
                        aria-label="Platform"
                    >
                        <ToggleButton value="for_releasing">
                            <AssignmentReturnedOutlined
                                sx={{ mr: 1, fontSize: 18 }}
                            />
                            For Releasing
                        </ToggleButton>
                        <ToggleButton value="deposited">
                            <AccountBalanceOutlined
                                sx={{ mr: 1, fontSize: 18 }}
                            />
                            Deposited
                        </ToggleButton>
                        <ToggleButton value="released">
                            <DownloadDoneOutlined
                                sx={{ mr: 1, fontSize: 18 }}
                            />
                            Released
                        </ToggleButton>
                        <ToggleButton value="pdc">
                            <EventOutlined sx={{ mr: 1, fontSize: 18 }} />
                            Post Dated
                        </ToggleButton>
                        <ToggleButton value="cancelled">
                            <CancelPresentationOutlined
                                sx={{ mr: 1, fontSize: 18 }}
                            />
                            {isRegional ? 'Returned' : 'Cancelled'}
                        </ToggleButton>
                        {!isRegional && (
                            <ToggleButton value="forwarded">
                                <SwipeRightOutlined
                                    sx={{ mr: 1, fontSize: 18 }}
                                />
                                Forwarded
                            </ToggleButton>
                        )}
                        <ToggleButton value="staled">
                            <AccessAlarmsOutlined
                                sx={{ mr: 1, fontSize: 18 }}
                            />
                            Staled
                        </ToggleButton>
                    </ToggleButtonGroup>

                    {(tab === 'staled' || tab === 'pdc') && (
                        <Card sx={{ mt: '20px' }}>
                            <CardContent>
                                <InsightsRoundedIcon />
                                <Typography
                                    component="h2"
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{ fontWeight: '600' }}
                                >
                                    {tab == 'pdc'
                                        ? 'Post-Dated Cheque Notice'
                                        : 'Stale Cheque Notice'}
                                </Typography>
                                <Typography
                                    sx={{ color: 'text.secondary', mb: '8px' }}
                                >
                                    {tab == 'pdc'
                                        ? 'A cheque is considered post-dated when its Cheque date is later than the Cv/Crf date.'
                                        : 'This cheque is considered stale based on its cheque date, which exceeds six months from today.'}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}

                    <TableFilter
                        company={company}
                        filters={filter}
                        businessUnits={businessUnits}
                        resetFilterRouter={chequeStatus()}
                    >
                       
                        <SelectItem
                            handleChange={handleChange}
                            value={selectedBank}
                            title="Bank"
                            items={banks}
                        />
                        <SelectItem
                            handleChange={handleChangeBa}
                            value={selectedBankAccount}
                            title="Bank Accounts"
                            items={bankAccounts}
                        />
                    </TableFilter>
                    <TableDataGrid
                        data={cheques}
                        isLoading={loading}
                        filter={filter.search}
                        pagination={handlePagination}
                        handleSearchFilter={handleSearch}
                        handleSortFilter={handleSort}
                        columns={columns}
                    />

                    {/* {scannedRecord && (
                        <ScannedDetails
                            record={scannedRecord}
                            title="Cheque Details"
                            open={openModal}
                            onClose={() => setOpenModal(false)}
                        />
                    )} */}
                </Box>
                <ImageViewing
                    title="Uploaded Deposit Slips"
                    open={viewDoc}
                    handleClose={() => setViewDoc(false)}
                    images={images}
                ></ImageViewing>
            </PageContainer>
        </AppLayout>
    );
}
