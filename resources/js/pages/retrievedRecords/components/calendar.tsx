import { useAppearance } from '@/hooks/use-appearance';
import { router } from '@inertiajs/react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

const Calendar = ({
    data,
    onChangeTab,
}: {
    onChangeTab: () => void;
    data: any;
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

    // const [day, setDay] = useState<{
    //     month: string;
    //     days: { day: number; holiday?: string; isCurrent?: boolean }[][];
    // }>({
    //     month: data.month,
    //     days: data.days,
    // });

    return (
        <Box>
            {data.map((day, monthIndex) => (
                <Box key={monthIndex} sx={{ mb: 4 }}>
                    <Box
                        component="span"
                        sx={{ fontSize: '3rem', fontWeight: 'bold' }}
                    >
                        {day.month}
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
                                {day.days.map((week, weekIndex) => (
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
                                                        `${day.y}-${day.m}-${dayObj.day}`,
                                                        'YYYY-M-D',
                                                    );

                                                    setSelectedDate(fullDate);
                                                    // const fullDate = `${day.y}-${day.m}-${day.days[weekIndex][dayIndex].day}`;
                                                    // setSelectedDate(dayjs(fullDate));
                                                }}
                                                style={{
                                                    position: 'relative',
                                                    height: '5rem',
                                                    padding: '0.5rem',
                                                    border: `1px solid ${isDarkMode ? '#444' : '#eee'}`,
                                                    cursor: 'pointer',
                                                    backgroundColor:
                                                        dayObj.isCurrent
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
                                                            color: isDarkMode
                                                                ? theme.palette
                                                                      .warning
                                                                      .main
                                                                : theme.palette
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
