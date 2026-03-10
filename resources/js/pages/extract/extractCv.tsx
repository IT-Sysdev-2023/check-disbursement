import AppLayout from '@/layouts/app-layout';
import { checkVoucher, extractCv, getBusinessUnits } from '@/routes';
import {
    Auth,
    EventType,
    ProgressState,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import {
    Alert,
    Box,
    Button,
    Container,
    SelectChangeEvent,
    Stack,
    Typography,
} from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios';
import { useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';
import SelectBu from './components/selectBu';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Voucher',
        href: checkVoucher().url,
    },
];

export default function ExtractCv({
    auth,
    bu,
}: {
    auth: Auth;
    bu: { label: string; value: number }[];
}) {
    const [progress, setProgress] = useState<ProgressState>({});
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [loading, setLoading] = useState(false);
    const [businessUnits, setBusinessUnits] = useState<SelectionType[]>([]);
    const [permissionList, setPermissionList] = useState<string[]>([]);
    const [selectedBu, setSelectedBu] = useState<string[]>([]);

    useEcho(`cv-progress.${auth.user.id}`, 'CvProgress', (e: EventType) => {
        const { percentage, message, status } = e;
        setLoading(false);
        const buffer = percentage + 10 > 100 ? 100 : percentage + 10;

        setProgress((prev) => ({
            ...prev,
            [message]: {
                progress: percentage,
                buffer,
                message,
                status,
            },
        }));
    });

    const simulateDataRetrieval = async () => {
        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }
        if (permissionList.length <= 0) {
            alert('Please select Business Unit');
            return;
        }

        setLoading(true);
        const { url, method } = extractCv();
        await axios({
            url,
            method,
            params: {
                start_date: startDate.format('YYYY-MM-DD'),
                end_date: endDate.format('YYYY-MM-DD'),
                company: permissionList,
                bu: selectedBu,
            },
        });
    };

    const handleChange = async (
        event: SelectChangeEvent<typeof permissionList>,
    ) => {
        const {
            target: { value },
        } = event;
        setPermissionList(typeof value === 'string' ? value.split(',') : value);

        if (value.length < 1) return;
        const response = await axios.get(getBusinessUnits().url, {
            params: {
                companies: value,
            },
        });

        setBusinessUnits(response.data);
    };

    const handleChangeBu = async (
        event: SelectChangeEvent<typeof permissionList>,
    ) => {
        const {
            target: { value },
        } = event;
        setSelectedBu(typeof value === 'string' ? value.split(',') : value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Check Voucher" />
            <Box
                id="hero"
                sx={(theme) => ({
                    width: '100%',
                    backgroundRepeat: 'no-repeat',

                    backgroundImage:
                        'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
                    ...theme.applyStyles('dark', {
                        backgroundImage:
                            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
                    }),
                })}
            >
                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pt: { xs: 14, sm: 20 },
                        pb: { xs: 8, sm: 12 },
                    }}
                >
                    <Stack
                        spacing={2}
                        useFlexGap
                        sx={{
                            alignItems: 'center',
                            width: { xs: '100%', sm: '70%' },
                        }}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: 'center',
                                fontSize: 'clamp(3rem, 10vw, 3.5rem)',
                            }}
                        >
                            Retrieve&nbsp;Check&nbsp;
                            <Typography
                                component="span"
                                variant="h1"
                                sx={(theme) => ({
                                    fontSize: 'inherit',
                                    color: 'primary.main',
                                    ...theme.applyStyles('dark', {
                                        color: 'primary.light',
                                    }),
                                })}
                            >
                                Voucher
                            </Typography>
                        </Typography>
                        <Typography
                            sx={{
                                textAlign: 'center',
                                color: 'text.secondary',
                                width: { sm: '100%', md: '80%' },
                            }}
                        >
                            Experience a smarter way to manage payments —
                            organized, verified, and transparent with our Check
                            Voucher module
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <SelectBu
                                label=" Select Company"
                                permissions={bu}
                                selectedPermission={permissionList}
                                handleChange={handleChange}
                            />
                            <SelectBu
                                isDisabled={permissionList.length < 1}
                                isAllSelected={selectedBu.includes('All')}
                                label=" Select Business Unit"
                                permissions={businessUnits}
                                selectedPermission={selectedBu}
                                handleChange={handleChangeBu}
                            />
                        </Box>
                        {Object.keys(progress).length === 0 && (
                            <>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <Box
                                        sx={{ display: 'flex', gap: 2, mt: 2 }}
                                    >
                                        <DatePicker
                                            label="Start Date"
                                            value={startDate}
                                            onChange={(newValue) =>
                                                setStartDate(newValue)
                                            }
                                            maxDate={endDate || undefined}
                                        />
                                        <DatePicker
                                            label="End Date"
                                            value={endDate}
                                            onChange={(newValue) =>
                                                setEndDate(newValue)
                                            }
                                            minDate={startDate || undefined}
                                        />
                                    </Box>
                                </LocalizationProvider>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    sx={{ minWidth: 'fit-content' }}
                                    onClick={simulateDataRetrieval}
                                >
                                    Get Data
                                </Button>
                            </>
                        )}
                    </Stack>
                    <Box sx={{ width: '100%', p: 2 }}>
                        {loading && Object.keys(progress).length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                                Waiting for progress updates...
                            </Typography>
                        )}

                        {Object.entries(progress).map(([key, item]) => (
                            <Box key={key} sx={{ mb: 3 }}>
                                {item.status == 'no_record' ? (
                                    <Alert
                                        variant="filled"
                                        severity="warning"
                                        sx={{ mb: 2 }}
                                    >
                                        {item.message}
                                    </Alert>
                                ) : item.status == 'connection_error' ? (
                                    <Alert
                                        variant="filled"
                                        severity="error"
                                        sx={{ mb: 2 }}
                                    >
                                        {item.message}
                                    </Alert>
                                ) : item.status == 'finished' ? (
                                    <Alert
                                        variant="filled"
                                        severity="success"
                                        sx={{ mb: 2 }}
                                    >
                                        {item.message}
                                    </Alert>
                                ) : (
                                    <>
                                        <Typography
                                            variant="body2"
                                            sx={{ mb: 1 }}
                                        >
                                            {item.message}
                                        </Typography>
                                        <LinearProgress
                                            variant="buffer"
                                            value={item.progress}
                                            valueBuffer={item.buffer}
                                        />
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {item.progress}%
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>
        </AppLayout>
    );
}
