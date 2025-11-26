import AppLayout from '@/layouts/app-layout';
import { retrievedRecords } from '@/routes';
import {
    Auth,
    Crf,
    Cv,
    DistinctMonths,
    InertiaPagination,
    type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Box,
    Grid,
    SelectChangeEvent,
    Stack,
    styled,
    Typography,
} from '@mui/material';
import { GridPaginationModel } from '@mui/x-data-grid';
import {
    DateCalendar,
    DatePicker,
    LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import CrfDataGrid from './dashboard/components/CrfDataGrid';
import CvDataGrid from './dashboard/components/CvDataGrid';
import Search from './dashboard/components/Search';
import SelectItem from './dashboard/components/SelectItem';
import Copyright from './dashboard/internals/components/Copyright';

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

    const [search, setSearch] = useState('');

    const checks = [
        { value: '1', label: 'CV' },
        { value: '2', label: 'CRF' },
    ];

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

    const handleSearch = (value: string) => {
        setSearch(value);

        router.get(
            retrievedRecords(),
            { search: value, bu: bu.label },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <Box id="hero" sx={{ px: 3 }}>
                <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                    Check Vouchers/ Check Request Form
                </Typography>
                <Stack direction="row" sx={{ gap: 3 }}>
                    <Search onSearch={handleSearch} value={search} />
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                maxDate={endDate || undefined}
                            />
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                minDate={startDate || undefined}
                            />
                        </Box>
                    </LocalizationProvider>
                </Stack>
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

                <Grid container spacing={2} columns={12} sx={{ mt: 3 }}>
                    {check === '1' && (
                        <CvDataGrid cvs={cv} pagination={handlePagination} />
                    )}

                    {check === '2' && (
                        <CrfDataGrid crf={crf} pagination={handlePagination} />
                    )}
                </Grid>

                <Copyright sx={{ my: 4 }} />
            </Box>
        </AppLayout>
    );
}
