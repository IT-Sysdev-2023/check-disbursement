import { useAppearance } from '@/hooks/use-appearance';
import { MonthType } from '@/types';
import { router } from '@inertiajs/react';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import CalendarLegend from './calendarLegend';

const Calendar = ({
    data,
    onChangeTab,
}: {
    onChangeTab: () => void;
    data: MonthType[];
}) => {
    const { appearance } = useAppearance();

    const theme = useTheme(); // Get the MUI theme
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (appearance === 'system') {
            setIsDarkMode(
                window.matchMedia('(prefers-color-scheme: dark)').matches,
            );
        } else {
            setIsDarkMode(appearance === 'dark');
        }
    }, [appearance]);

    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

    useEffect(() => {
        if (!selectedDate) return;

        const formattedDate = selectedDate.format('YYYY-MM-DD');

        router.reload({
            data: {
                date: {
                    start: formattedDate,
                    end: formattedDate,
                },
                tab: 'cheques',
            },
            replace: true,
            onSuccess: () => {
                onChangeTab();
            },
        });
    }, [selectedDate]);

    return (
        <Box>
            {/* LEGENDS */}
            <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                sx={{ width: '100%' }}
            >
                <CalendarLegend color="blue" label="With Records" />
                <CalendarLegend color="darkRed" label="No Records" />
                <CalendarLegend color="darkGreen" label="Weekend" />
                <CalendarLegend color="green" label="Total CRF" />
                <CalendarLegend color="orange" label="Total CV" />
            </Stack>

            {/* CALENDAR */}
            {data.map((month, monthIndex) => (
                <Box key={monthIndex} sx={{ mb: 4 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'end',
                        }}
                    >
                        <Box
                            component="span"
                            sx={{ fontSize: '3rem', fontWeight: 'bold' }}
                        >
                            {month.month}
                        </Box>
                        <Box
                            component="span"
                            sx={{
                                fontSize: '1rem',
                                fontWeight: 500,
                                opacity: 0.7,
                            }}
                        >
                            {month.totalMonthly} TOTAL
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: '100%',
                            mt: 4,
                            borderRadius: 1,
                            border: `1px solid ${isDarkMode ? '#444' : '#ccc'}`,
                            bgcolor: isDarkMode ? '#121212' : '#fff',
                            boxShadow: 1,
                            overflow: 'hidden',
                        }}
                    >
                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                            }}
                        >
                            <thead>
                                <tr
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(7, 1fr)',
                                        background: theme.palette.primary.main,
                                        color: '#fff',
                                    }}
                                >
                                    {[
                                        'Sun',
                                        'Mon',
                                        'Tue',
                                        'Wed',
                                        'Thu',
                                        'Fri',
                                        'Sat',
                                    ].map((d) => (
                                        <th
                                            key={d}
                                            style={{
                                                textAlign: 'center',
                                                padding: '0.75rem',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {d}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {month.days.map((week, weekIndex) => (
                                    <tr
                                        key={`month-${monthIndex}-week-${weekIndex}`}
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns:
                                                'repeat(7, 1fr)',
                                        }}
                                    >
                                        {week.map((dayObj, dayIndex) => (
                                            <td
                                                key={`month-${monthIndex}-week-${weekIndex}-day-${dayIndex}`}
                                                onClick={() => {
                                                    if (!dayObj.day) return; // ignore empty cells

                                                    const fullDate = dayjs(
                                                        `${month.y}-${month.m}-${dayObj.day}`,
                                                        'YYYY-M-D',
                                                    );

                                                    setSelectedDate(fullDate);
                                                }}
                                                style={{
                                                    position: 'relative',
                                                    height: '5rem',
                                                    padding: '0.5rem',
                                                    border: `1px solid ${isDarkMode ? '#444' : '#eee'}`,
                                                    cursor: 'pointer',
                                                    backgroundColor:
                                                        dayObj.totalRecord
                                                            ? '#052770'
                                                            : dayObj.isWeekend
                                                              ? '#014421'
                                                              : dayObj.totalRecord ==
                                                                  0
                                                                ? '#440E03'
                                                                : dayObj.isCurrent
                                                                  ? isDarkMode
                                                                      ? '#333'
                                                                      : '#cfe3ff'
                                                                  : 'transparent',
                                                    color: isDarkMode
                                                        ? '#fff'
                                                        : '#000',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontWeight:
                                                            dayObj.isCurrent
                                                                ? 600
                                                                : 500,
                                                    }}
                                                >
                                                    {dayObj.day}
                                                </span>

                                                {/* LABEL */}
                                                {(dayObj.crf !== undefined ||
                                                    dayObj.cv !==
                                                        undefined) && (
                                                    <div
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            top: '4px',
                                                            right: '6px',
                                                            fontSize: '0.65rem',
                                                            textAlign: 'right',
                                                            lineHeight: '1.2',
                                                        }}
                                                    >
                                                        {dayObj.crf !==
                                                            undefined && (
                                                            <div
                                                                style={{
                                                                    color: '#4caf50',
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                CRF:{' '}
                                                                {dayObj.crf}
                                                            </div>
                                                        )}
                                                        {dayObj.cv !==
                                                            undefined && (
                                                            <div
                                                                style={{
                                                                    color: '#ff9800',
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                CV: {dayObj.cv}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {/* Total Record Below Date */}
                                                {dayObj.totalRecord !==
                                                    undefined && (
                                                    <div
                                                        style={{
                                                            marginTop:
                                                                '0.25rem',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 800,

                                                            textAlign: 'center',
                                                            color:
                                                                dayObj.totalRecord ===
                                                                0
                                                                    ? '#9e9e9e' // gray when zero
                                                                    : isDarkMode
                                                                      ? theme
                                                                            .palette
                                                                            .warning
                                                                            .main
                                                                      : theme
                                                                            .palette
                                                                            .info
                                                                            .main,
                                                        }}
                                                    >
                                                        {dayObj.totalRecord}
                                                    </div>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default Calendar;
