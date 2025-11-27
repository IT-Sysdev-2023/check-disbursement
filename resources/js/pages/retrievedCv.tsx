import BorrowedCheckModal from '@/components/borrowed-check-modal';
import AppLayout from '@/layouts/app-layout';
import { details, retrievedRecords, scanCheck } from '@/routes';
import {
    Auth,
    Crf,
    Cv,
    DistinctMonths,
    FlashReponse,
    InertiaPagination,
    type BreadcrumbItem,
} from '@/types';
import { router } from '@inertiajs/react';
import {
    Alert,
    Box,
    Chip,
    MenuItem,
    Select,
    SelectChangeEvent,
    Snackbar,
    Stack,
    styled,
} from '@mui/material';
import {
    GridColDef,
    GridFilterModel,
    GridPaginationModel,
    GridSortModel,
} from '@mui/x-data-grid';
import {
    DateCalendar,
    DatePicker,
    LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import CvDataGrid from './dashboard/components/CvDataGrid';
import SelectItem from './dashboard/components/SelectItem';
import PageContainer from './retrievedData/components/pageContainer';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retrieved CV/CRF',
        href: '#',
    },
];
const HighlightedDay = styled(PickersDay)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: '50%',
}));

const renderStatus = (status: 'Releasing' | 'Borrowed' | 'Signature') => {
    const colors: { [index: string]: 'success' | 'error' | 'info' } = {
        Signature: 'info',
        Releasing: 'success',
        Borrowed: 'error',
    };

    const label = ['Signature', 'Releasing'].includes(status)
        ? 'For ' + status
        : status;

    return <Chip label={label} color={colors[status]} size="small" />;
};

export default function RetrievedCv({
    cv,
    crf,
    company,
    distinctMonths,
}: {
    cv: InertiaPagination<Cv>;
    crf: InertiaPagination<Crf>;
    auth: Auth;
    distinctMonths: DistinctMonths;
    company: { label: string; value: number }[];
}) {
    const [bu, setBu] = useState<{ label: string; value: string }>({
        label: '',
        value: '',
    });
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);

    const [check, setCheck] = useState('1');

    const checks = [
        { value: '1', label: 'CV' },
        { value: '2', label: 'CRF' },
    ];

    const [checkId, setCheckId] = useState<number | undefined>();
    const [open, setOpen] = useState(false);
    const [buBorrow, setBuBorrow] = useState('');
    const [message, setMessage] = useState('');
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const handleClose = () => setOpen(false);

    const handleChangeCheck = (event: SelectChangeEvent) => {
        setCheck(event.target.value);

        router.get(
            retrievedRecords(),
            { bu: bu.label },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleChange = (event: SelectChangeEvent) => {
        const selectedItem = company.find(
            (item) => item.value == Number(event.target.value),
        );

        if (selectedItem) {
            setBu({
                label: selectedItem?.label,
                value: String(selectedItem?.value),
            });
        }

        router.get(
            retrievedRecords(),
            { bu: selectedItem?.label },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const handlePagination = (model: GridPaginationModel) => {
        const page = model.page + 1;
        const per_page = model.pageSize;

        router.get(
            retrievedRecords(),
            { page, per_page, bu: bu.label },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleSearch = (model: GridFilterModel) => {
        router.get(
            retrievedRecords(),
            { search: model.quickFilterValues?.[0], bu: bu.label },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleSort = (model: GridSortModel) => {
        if (model.length > 0) {
            router.get(
                retrievedRecords(),
                {
                    sort: {
                        field: model[0].field,
                        sort: model[0].sort,
                    },
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'cvNo',
            headerName: 'CV Number',
            minWidth: 150,
            renderCell: (params) => {
                return params.row.cvHeader?.cvNo;
            },
        },
        {
            field: 'checkAmount',
            headerName: 'Check Amount',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'payee',
            headerName: 'Payee',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
        },
        {
            field: 'name',
            headerName: 'Business Unit',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            renderCell: (params) => {
                return params.row.company?.name;
            },
        },
        {
            field: 'checkDate',
            headerName: 'Check Date',
            headerAlign: 'right',
            align: 'right',
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 120,
            renderCell: (params) => {
                return renderStatus(
                    params.row?.borrowedCheck ? 'Borrowed' : 'Signature',
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Action',
            width: 130,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            renderCell: (params) => {
                const { status } = params.row;
                return (
                    <Select
                        size="small"
                        value={status ?? ''}
                        onChange={(e) =>
                            handleStatusChange(
                                params.row.id,
                                e.target.value,
                                params.row.company.name,
                            )
                        }
                    >
                        <MenuItem value="details">Check Details</MenuItem>
                        {params.row.borrowedCheck == null && (
                            <MenuItem value="borrow">Borrow Check</MenuItem>
                        )}
                        <MenuItem value="scan">Scan</MenuItem>
                    </Select>
                );
            },
        },
    ];

    const handleStatusChange = (id: number, value: string, bu: string) => {
        if (value === 'details') {
            router.visit(details(id));
        }

        if (value === 'borrow') {
            setBuBorrow(bu);
            setCheckId(id);
            setOpen(true);
        }

        if (value === 'scan') {
            router.post(
                scanCheck(),
                {
                    check: 'cv',
                    status: null,
                    id: id,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: (page) => {
                        setOpenSnackBar(true);
                        const m = page.props.flash as FlashReponse;
                        setMessage(m.message);
                    },
                },
            );
        }
    };

    const pageTitle = 'Retrieved CV/CRF';
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <PageContainer
                title={pageTitle}
                breadcrumbs={[{ title: pageTitle }]}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ width: '100%', p: 2 }}>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 2,
                            }}
                        >
                            {Object.entries(distinctMonths).map(
                                ([key, monthGroup]) => {
                                    const [year, month] = key.split('-');

                                    const highlightedDates = monthGroup.map(
                                        (dateObj: { check_date: string }) => {
                                            const date = dayjs(
                                                dateObj.check_date,
                                            );
                                            return date;
                                        },
                                    );
                                    return (
                                        <DateCalendar
                                            key={key}
                                            readOnly
                                            referenceDate={dayjs(
                                                `${year}-${month}-01`,
                                            )}
                                            onMonthChange={() => {}}
                                            onYearChange={() => {}}
                                            slots={{
                                                previousIconButton: () => null,
                                                nextIconButton: () => null,
                                                day: (props) => {
                                                    const { day, ...other } =
                                                        props;
                                                    const isHighlighted =
                                                        highlightedDates.some(
                                                            (d: Dayjs) =>
                                                                day.isSame(
                                                                    d,
                                                                    'day',
                                                                ),
                                                        );
                                                    return isHighlighted ? (
                                                        <HighlightedDay
                                                            day={day}
                                                            {...other}
                                                        />
                                                    ) : (
                                                        <PickersDay
                                                            day={day}
                                                            {...other}
                                                        />
                                                    );
                                                },
                                            }}
                                        />
                                    );
                                },
                            )}
                        </Box>
                    </Box>
                </LocalizationProvider>
                <Stack
                    direction="row"
                    sx={{
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 4,
                        marginBottom: 2,
                    }}
                >
                    <Stack direction="row" sx={{ gap: 3 }}>
                        <SelectItem
                            handleChange={handleChange}
                            value={bu.value}
                            title="Company"
                            items={company}
                        />
                        <SelectItem
                            handleChange={handleChangeCheck}
                            value={check}
                            title="Check"
                            items={checks}
                        />
                    </Stack>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                maxDate={endDate || undefined}
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '1.2rem',
                                    color: 'text.secondary',
                                }}
                            >
                                ➔
                            </Box>
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                minDate={startDate || undefined}
                            />
                        </Box>
                    </LocalizationProvider>
                </Stack>
                
                <Box sx={{ flex: 1, width: '100%' }}>
                    <CvDataGrid
                        cvs={cv}
                        pagination={handlePagination}
                        handleSearchFilter={handleSearch}
                        handleSortFilter={handleSort}
                        columns={columns}
                    />
                </Box>
            </PageContainer>

            <BorrowedCheckModal
                whichCheck="cv"
                checkId={checkId}
                open={open}
                bu={buBorrow}
                handleClose={handleClose}
            />

            <Snackbar
                open={openSnackBar}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </AppLayout>
    );
}
