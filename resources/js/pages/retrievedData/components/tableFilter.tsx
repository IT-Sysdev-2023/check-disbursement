import SelectItem from '@/pages/dashboard/components/SelectItem';
import { DateFilterType, DistinctMonths, SelectionType } from '@/types';
import { router } from '@inertiajs/react';
import { Badge, Box, SelectChangeEvent, Stack, styled } from '@mui/material';
import {
    DateCalendar,
    DatePicker,
    LocalizationProvider,
    PickersDay,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickerValue } from '@mui/x-date-pickers/internals';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

const HighlightedDay = styled(PickersDay)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: '50%',
}));

const checks = [
    { value: 'cv', label: 'CV' },
    { value: 'crf', label: 'CRF' },
];

export default function ({
    distinctMonths,
    company,
    check,
    handleChangeCheck,
    filters,
    isCrf,
}: {
    distinctMonths: DistinctMonths;
    company: SelectionType[];
    filters: {
        selectedBu: string;
        date: DateFilterType;
    };
    check: string;
    isCrf: boolean;
    handleChangeCheck: (value: SelectChangeEvent) => void;
}) {
    const [bu, setBu] = useState<string>(filters.selectedBu);
    const [startDate, setStartDate] = useState<Dayjs | null>(
        filters.date.start ? dayjs(filters.date.start) : null,
    );
    const [endDate, setEndDate] = useState<Dayjs | null>(
        filters.date.end ? dayjs(filters.date.end) : null,
    );

    const handleChange = (event: SelectChangeEvent) => {
        setBu(event.target.value);
        router.reload({
            only: ['cv'],
            data: {
                bu: event.target.value,
            },
        });
    };
    const handleStartDateChange = (value: PickerValue) => {
        setStartDate(value);
        filterDate(value, endDate);
    };

    const handleEndDateChange = (value: PickerValue) => {
        setEndDate(value);
        filterDate(startDate, value);
    };

    const filterDate = (startDate: Dayjs | null, endDate: Dayjs | null) => {
        if (startDate && endDate) {
            router.reload({
                data: {
                    date: {
                        start: startDate.format('YYYY-MM-DD'),
                        end: endDate.format('YYYY-MM-DD'),
                    },
                },
                only: ['cv'],
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    };

    return (
        <>
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
                                                const { day, ...other } = props;

                                                const recordForDay =
                                                    monthGroup.find(
                                                        (dateObj: {
                                                            check_date: string;
                                                            total: number;
                                                        }) =>
                                                            day.isSame(
                                                                dayjs(
                                                                    dateObj.check_date,
                                                                ),
                                                                'day',
                                                            ),
                                                    );

                                                if (recordForDay) {
                                                    return (
                                                        <Badge
                                                            overlap="circular"
                                                            badgeContent={recordForDay.total} 
                                                            color="secondary" 
                                                            sx={{
                                                                [`& .MuiBadge-badge`]:
                                                                    {
                                                                        fontSize:
                                                                            '0.65rem',
                                                                        minWidth: 16,
                                                                        height: 16,
                                                                        transform:
                                                                            'translate(60%, -60%)', // adjusts badge position
                                                                    },
                                                            }}
                                                        >
                                                            <HighlightedDay
                                                                day={day}
                                                                {...other}
                                                            />
                                                        </Badge>
                                                    );
                                                }

                                                return (
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
                        isDisabled={isCrf}
                        handleChange={handleChange}
                        value={bu}
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
                            onChange={handleStartDateChange}
                            maxDate={endDate || undefined}
                            disabled={isCrf}
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
                            onChange={handleEndDateChange}
                            minDate={startDate || undefined}
                            disabled={isCrf}
                        />
                    </Box>
                </LocalizationProvider>
            </Stack>
        </>
    );
}
