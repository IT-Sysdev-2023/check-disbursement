import { useAppearance } from '@/hooks/use-appearance';
import SelectItem from '@/pages/dashboard/components/SelectItem';
import { syncMissingData } from '@/routes';
import { EventType, MonthType, ProgressState, SelectionType } from '@/types';
import { router } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import {
    Alert,
    Button,
    CircularProgress,
    SelectChangeEvent,
    Stack,
    Switch,
} from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import CalendarLegend from './calendarLegend';

const Calendar = ({
    userId,
    data,
    onChangeTab,
    company,
}: {
    userId: number;
    onChangeTab: () => void;
    data: MonthType[];
    company: SelectionType[];
}) => {
    const [selectedCompany, setSelectedCompany] = useState<string>('all');
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [progress, setProgress] = useState<ProgressState>({});
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);
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
    }, [selectedDate, onChangeTab]);

    useEcho(`cv-progress.${userId}`, 'CvProgress', (e: EventType) => {
        const { percentage, message, status, key } = e;

        setLoadingMap((prev) => ({ ...prev, [key]: true }));

        const buffer = percentage + 10 > 100 ? 100 : percentage + 10;
        setProgress((prev) => ({
            ...prev,
            [key]: {
                progress: percentage,
                buffer,
                message,
                status,
            },
        }));

        if (e.status === 'finished') {
            setLoadingMap((prev) => ({ ...prev, [key]: false }));
            router.reload();
        }
    });

    const handleChange = async (event: SelectChangeEvent) => {
        const val = event.target.value;
        setSelectedCompany(val);

        router.reload({
            data: {
                company: event.target.value,
            },
        });
    };

    const handleCheckChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        month: {
            month: number;
            year: number;
            businessUnit: string | undefined;
        },
    ) => {
        const key = `${month.businessUnit}-${month.year}-${month.month}`;
        const value = e.target.checked;

        setChecked(() => {
            let updated;

            if (value) {
                //CHECK CURRENT ITEM
                updated = {
                    [key]: true,
                };
            } else {
                // UNCHECK PREVIOUS ITEM
                updated = {};
            }

            router.reload({
                data: {
                    isNavSelected: value,
                    monthDetails: value ? month : null,
                },
                onBefore: () => {
                    setLoadingMap((prev) => ({ ...prev, [key]: true }));
                },
                onFinish: () => {
                    setLoadingMap((prev) => ({ ...prev, [key]: false }));
                },
            });

            return updated;
        });
    };
    const onSyncData = async (month: {
        year: number;
        month: number;
        businessUnit: string | undefined;
    }) => {
        setLoading(true);
        await axios.post(syncMissingData().url, {
            month: month.month,
            year: month.year,
            bu: month.businessUnit,
        });
    };
    return (
        <Box>
            {/* LEGENDS */}
            <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                sx={{ width: '100%' }}
            >
                <SelectItem
                    handleChange={handleChange}
                    value={selectedCompany}
                    title="Filter Company"
                    items={company}
                />

                <Stack direction="row" spacing={1}>
                    <CalendarLegend color="blue" label="With Records" />
                    <CalendarLegend color="darkRed" label="No Records" />
                    <CalendarLegend color="darkGreen" label="Weekend" />
                    <CalendarLegend color="green" label="Total CRF" />
                    <CalendarLegend color="orange" label="Total CV" />
                </Stack>
            </Stack>

            {/* CALENDAR */}
            {data.length === 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        minHeight: 200,
                    }}
                >
                    NO DATA{' '}
                </Box>
            ) : (
                data.map((month, monthIndex) => (
                    <Box key={monthIndex} sx={{ mb: 4, position: 'relative' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'end',
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    fontSize: '3rem',
                                    fontWeight: 'bold',
                                    color:
                                        month.totalMonthly !==
                                        month.totalNavRecords
                                            ? 'red'
                                            : 'inherit',
                                }}
                            >
                                {month.month}{' '}
                                <Box
                                    component="span"
                                    sx={{
                                        fontSize: '1.5rem',
                                        fontWeight: 'normal',
                                    }}
                                >
                                    {month.businessUnit} - {month.totalMonthly}{' '}
                                    Records
                                </Box>
                            </Box>
                            <Box
                                component="span"
                                sx={{
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    opacity: 0.7,
                                }}
                            >
                                {month.totalNavRecords !==
                                month.totalMonthly ? (
                                    <>
                                        {month.totalNavRecords} in Navision
                                        <Switch
                                            checked={
                                                checked[
                                                    `${month.businessUnit}-${month.y}-${month.m}`
                                                ] || false
                                            }
                                            onChange={(e) =>
                                                handleCheckChange(e, {
                                                    month: month.m,
                                                    year: month.y,
                                                    businessUnit:
                                                        month.businessUnit,
                                                })
                                            }
                                        />
                                        <Button
                                            loading={loading}
                                            variant="outlined"
                                            startIcon={<RefreshCcw />}
                                            onClick={() =>
                                                onSyncData({
                                                    month: month.m,
                                                    year: month.y,
                                                    businessUnit:
                                                        month.businessUnit,
                                                })
                                            }
                                        >
                                            Sync Data
                                        </Button>
                                    </>
                                ) : (
                                    <Alert severity="success">
                                        Navision Data Matches
                                    </Alert>
                                )}
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
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {loadingMap[
                                `${month.businessUnit}-${month.y}-${month.m}`
                            ] && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        gap: 2,
                                        bgcolor: 'rgba(0,0,0,0.6)',
                                        zIndex: 10,
                                    }}
                                >
                                    <CircularProgress />

                                    {progress[
                                        `${month.businessUnit}-${month.y}-${month.m}`
                                    ] && (
                                        <Box
                                            component="span"
                                            sx={{
                                                color: '#fff',
                                                fontSize: '0.95rem',
                                                fontWeight: 500,
                                            }}
                                        >
                                            Loading{' '}
                                            {
                                                progress[
                                                    `${month.businessUnit}-${month.y}-${month.m}`
                                                ].progress
                                            }
                                            %
                                        </Box>
                                    )}
                                </Box>
                            )}
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
                                            gridTemplateColumns:
                                                'repeat(7, 1fr)',
                                            background: checked[
                                                `${month.businessUnit}-${month.y}-${month.m}`
                                            ]
                                                ? theme.palette.secondary.main
                                                : theme.palette.primary.main,
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

                                                        setSelectedDate(
                                                            fullDate,
                                                        );
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
                                                            color: '#fff',
                                                        }}
                                                    >
                                                        {dayObj.day}
                                                    </span>

                                                    {/* LABEL */}
                                                    {(dayObj.crf !==
                                                        undefined ||
                                                        dayObj.cv !==
                                                            undefined) && (
                                                        <div
                                                            style={{
                                                                position:
                                                                    'absolute',
                                                                top: '4px',
                                                                right: '6px',
                                                                fontSize:
                                                                    '0.65rem',
                                                                textAlign:
                                                                    'right',
                                                                lineHeight:
                                                                    '1.2',
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
                                                                    CV:{' '}
                                                                    {dayObj.cv}
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
                                                                fontSize:
                                                                    '0.75rem',
                                                                fontWeight: 800,

                                                                textAlign:
                                                                    'center',
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
                ))
            )}
        </Box>
    );
};

export default Calendar;
