import SelectItem from '@/pages/dashboard/components/SelectItem';
import { DateFilterType, SelectionType } from '@/types';
import { router } from '@inertiajs/react';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    Box,
    IconButton,
    SelectChangeEvent,
    Stack,
    Tooltip,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickerValue } from '@mui/x-date-pickers/internals';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

const checks = [
    { value: 'cv', label: 'CV' },
    { value: 'crf', label: 'CRF' },
];

export default function ({
    company,
    check,
    handleChangeCheck,
    isCheckDisabled = false,
    filters,
    currentTab,
}: {
    company: SelectionType[];
    filters: {
        selectedBu: string;
        date: DateFilterType;
    };
    isCheckDisabled?: boolean;
    check: string;
    currentTab: string;
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
            only: [currentTab],
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
                only: [currentTab],
                replace: true,
            });
        }
    };

    const handleReset = () => {
        router.reload({
            only: [currentTab],
            data: {
                date: null,
            },
            replace: true,
        });
        setStartDate(null);
        setEndDate(null);
    };

    return (
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
                    isDisabled={check === 'crf'}
                    handleChange={handleChange}
                    value={bu}
                    title="Company"
                    items={company}
                />
                <SelectItem
                    handleChange={handleChangeCheck}
                    isDisabled={isCheckDisabled}
                    value={check}
                    title="Check"
                    items={checks}
                />
            </Stack>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        maxDate={endDate || undefined}
                        disabled={check === 'crf'}
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
                        disabled={check === 'crf'}
                    />

                    <Tooltip title="Reset" placement="right" enterDelay={1000}>
                        <div>
                            <IconButton
                                disabled={startDate == null || endDate == null}
                                size="small"
                                aria-label="refresh"
                                onClick={handleReset}
                            >
                                <RefreshIcon />
                            </IconButton>
                        </div>
                    </Tooltip>
                </Stack>
            </LocalizationProvider>
        </Stack>
    );
}
