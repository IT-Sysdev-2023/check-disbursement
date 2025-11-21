import AppLayout from '@/layouts/app-layout';
import { checkVoucher, extractCv } from '@/routes';
import { Auth, EventType, ProgressState, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import {
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

export default function CheckVoucher({
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
    const [permissionList, setPermissionList] = useState<string[]>([]);

    useEcho(`cv-progress.${auth.user.id}`, 'CvProgress', (e: EventType) => {
        const { percentage, message } = e;

        setLoading(false);
        const buffer = percentage + 10 > 100 ? 100 : percentage + 10;

        setProgress((prev) => ({
            ...prev,
            [message]: {
                progress: percentage,
                buffer,
                message,
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
                bu: permissionList,
            },
        });
    };

    // const permissions = auth.user?.company_permissions.map((r) => ({label: r.company.name, value: r.company.id}));

    //if Admin show all Permissions
    // const permissions = auth.user?.roles?.[0]?.name === 'admin' ? auth.user?.roles?.[0]?.permissions?.map((r) => r.name) : usersPermissions;
    // console.log(role);

    const handleChange = (event: SelectChangeEvent<typeof permissionList>) => {
        const {
            target: { value },
        } = event;
        console.log(event);
        setPermissionList(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
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
                        <SelectBu
                            permissions={bu}
                            selectedPermission={permissionList}
                            handleChange={handleChange}
                        />
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
                                <Typography variant="body2" sx={{ mb: 1 }}>
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
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>
        </AppLayout>
    );
}
