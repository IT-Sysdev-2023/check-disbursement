import SelectItem from '@/pages/dashboard/components/SelectItem';
import { DistinctMonths, SelectionType } from '@/types';
import { router } from '@inertiajs/react';
import { Box, SelectChangeEvent, Stack, styled } from '@mui/material';
import {
    DateCalendar,
    DatePicker,
    LocalizationProvider,
    PickersDay,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
    selectedBu,
    isCrf,
}: {
    distinctMonths: DistinctMonths;
    company: SelectionType[];
    selectedBu: string;
    check: string;
    isCrf: boolean;
    handleChangeCheck: (value: SelectChangeEvent) => void;
}) {
    const [bu, setBu] = useState<string>(selectedBu);
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);

    const handleChange = (event: SelectChangeEvent) => {
        setBu(event.target.value);
        router.reload({
            only: ['cv'],
            data: {
                bu: event.target.value,
            },
        });
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

                                const highlightedDates = monthGroup.map(
                                    (dateObj: { check_date: string }) => {
                                        const date = dayjs(dateObj.check_date);
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
                                                const { day, ...other } = props;
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
        </>
    );
}
