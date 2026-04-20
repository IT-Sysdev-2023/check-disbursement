import { useAppearance } from '@/hooks/use-appearance';
import { syncMissingData } from '@/routes';
import { EventType, MonthType, ProgressState } from '@/types';
import { router } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { Alert, Box, Button, CircularProgress, Switch } from '@mui/material';
import axios from 'axios';
import { RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import Days from './days';

export default function Months({
    userId,
    months,
    onChangeTab,
}: {
    months: Record<string, MonthType>;
    onChangeTab: () => void;
    userId: number;
}) {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState<ProgressState>({});
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
    const [checked, setChecked] = useState<Record<string, boolean>>({});

    const { appearance } = useAppearance();

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

    useEcho(`cv-progress.${userId}`, 'CvProgress', (e: EventType) => {
        const { percentage, message, status, key } = e;

        setLoadingMap((prev) => ({ ...prev, [key]: true }));
        setProgress((prev) => ({
            ...prev,
            [key]: {
                progress: percentage,
                message,
                status,
            },
        }));
        if (e.status === 'finished') {
            setLoadingMap((prev) => ({ ...prev, [key]: false }));
            router.reload();
        }
    });

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
    const key = (month: MonthType) =>
        `${month.businessUnit}-${month.y}-${month.m}`;
    
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
    return (
        <>
            {Object.entries(months).map(([value, month], monthIndex) => (
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
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color:
                                    month.totalMonthly !== month.totalNavRecords
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
                                - {month.totalMonthly} Records
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
                            {month.totalNavRecords !== month.totalMonthly ? (
                                <>
                                    {month.totalNavRecords} in Navision
                                    <Switch
                                        disabled={
                                            loading || loadingMap[key(month)]
                                        }
                                        checked={checked[key(month)] || false}
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
                                        loading={
                                            loading || loadingMap[key(month)]
                                        }
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
                        {loadingMap[key(month)] && (
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

                                {progress[key(month)] && (
                                    <Box
                                        component="span"
                                        sx={{
                                            color: '#fff',
                                            fontSize: '0.95rem',
                                            fontWeight: 500,
                                        }}
                                    >
                                        Loading {progress[key(month)].progress}%
                                    </Box>
                                )}
                            </Box>
                        )}
                        <Days
                            checked={checked}
                            month={month}
                            onChangeTab={onChangeTab}
                            isDarkMode={isDarkMode}
                        />
                    </Box>
                </Box>
            ))}
        </>
    );
}
