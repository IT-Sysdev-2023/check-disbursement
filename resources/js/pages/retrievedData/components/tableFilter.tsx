import SelectItem from '@/pages/dashboard/components/SelectItem';
import { retrievedRecords } from '@/routes';
import { DistinctMonths } from '@/types';
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

export default function ({
    distinctMonths,
    company,
    bu,
    setBu
}: {
    distinctMonths: DistinctMonths;
    company: { label: string; value: number }[];
        bu: { label: string; value: string };
        setBu: (value: { label: string; value: number }) => void;
    }) {
    
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);

    const [check, setCheck] = useState('1');

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
        const selectedItem: {label: string; value: number} | undefined = company.find(
            (item) => item.value == Number(event.target.value),
        );

        if (selectedItem) {
            setBu(selectedItem);
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
        </>
    );
}
