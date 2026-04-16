import { MonthType } from "@/types";
import { router } from "@inertiajs/react";
import { useTheme } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

export default function Days({ checked, month, onChangeTab, isDarkMode }: {checked: Record<string, boolean>, month: MonthType, onChangeTab: () => void, isDarkMode: boolean}) {
    const theme = useTheme(); // Get the MUI theme
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    console.log(month);
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
                    bu: month.businessUnit
                },
                replace: true,
                onSuccess: () => {
                    onChangeTab();
                },
            });
        }, [selectedDate, onChangeTab, month.businessUnit]);
    return (
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
                        background: checked[
                            `${month.businessUnit}-${month.y}-${month.m}`
                        ]
                            ? theme.palette.secondary.main
                            : theme.palette.primary.main,
                        color: '#fff',
                    }}
                >
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                        (d) => (
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
                        ),
                    )}
                </tr>
            </thead>
            <tbody>
                {month.days.map((week, weekIndex) => (
                    <tr
                        key={`week-${weekIndex}`}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(7, 1fr)',
                        }}
                    >
                        {week.map((dayObj, dayIndex) => (
                            <td
                                key={`week-${weekIndex}-day-${dayIndex}`}
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
                                    backgroundColor: dayObj.totalRecord
                                        ? '#052770'
                                        : dayObj.isWeekend
                                          ? '#014421'
                                          : dayObj.totalRecord == 0
                                            ? '#440E03'
                                            : dayObj.isCurrent
                                              ? isDarkMode
                                                  ? '#333'
                                                  : '#cfe3ff'
                                              : 'transparent',
                                    color: isDarkMode ? '#fff' : '#000',
                                }}
                            >
                                <span
                                    style={{
                                        fontWeight: dayObj.isCurrent
                                            ? 600
                                            : 500,
                                        color: '#fff',
                                    }}
                                >
                                    {dayObj.day}
                                </span>

                                {/* LABEL */}
                                {(dayObj.crf !== undefined ||
                                    dayObj.cv !== undefined) && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '4px',
                                            right: '6px',
                                            fontSize: '0.65rem',
                                            textAlign: 'right',
                                            lineHeight: '1.2',
                                        }}
                                    >
                                        {dayObj.crf !== undefined && (
                                            <div
                                                style={{
                                                    color: '#4caf50',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                CRF: {dayObj.crf}
                                            </div>
                                        )}
                                        {dayObj.cv !== undefined && (
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
                                {dayObj.totalRecord !== undefined && (
                                    <div
                                        style={{
                                            marginTop: '0.25rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 800,

                                            textAlign: 'center',
                                            color:
                                                dayObj.totalRecord === 0
                                                    ? '#9e9e9e' // gray when zero
                                                    : isDarkMode
                                                      ? theme.palette.warning
                                                            .main
                                                      : theme.palette.info.main,
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
    );
}
