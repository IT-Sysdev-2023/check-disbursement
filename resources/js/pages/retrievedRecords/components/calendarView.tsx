import { DistinctMonths } from '@/types';
import { Badge, Box, styled } from '@mui/material';
import { DateCalendar, LocalizationProvider, PickersDay } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const HighlightedDay = styled(PickersDay)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: '50%',
}));

export default function CalendarView({
    distinctMonths,
}: {
    distinctMonths: DistinctMonths;
    }) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ width: '100%', p: 2 }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 2,
                    }}
                >
                    {Object.entries(distinctMonths).map(([key, monthGroup]) => {
                        const [year, month] = key.split('-');
                        console.log(monthGroup);
                        return (
                            <DateCalendar
                                key={key}
                                readOnly
                                referenceDate={dayjs(`${year}-${month}-01`)}
                                onMonthChange={() => {}}
                                onYearChange={() => {}}
                                slots={{
                                    previousIconButton: () => null,
                                    nextIconButton: () => null,
                                    day: (props) => {
                                        const { day, ...other } = props;

                                        const recordForDay = monthGroup.find(
                                            (dateObj: {
                                                cv_date: string;
                                                total: number;
                                            }) =>
                                                day.isSame(
                                                    dayjs(dateObj.cv_date),
                                                    'day',
                                                ),
                                        );

                                        if (recordForDay) {
                                            return (
                                                <Badge
                                                    overlap="circular"
                                                    badgeContent={
                                                        recordForDay.total
                                                    }
                                                    color="secondary"
                                                    sx={{
                                                        [`& .MuiBadge-badge`]: {
                                                            fontSize: '0.65rem',
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
                                            <PickersDay day={day} {...other} />
                                        );
                                    },
                                }}
                            />
                        );
                    })}
                </Box>
            </Box>
        </LocalizationProvider>
    );
}
