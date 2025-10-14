import AppLayout from '@/layouts/app-layout';
import { checkVoucher, retrieveCheckVoucher } from '@/routes';
import { Auth, SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Voucher',
        href: checkVoucher().url,
    },
];
interface ProgressState {
    [message: string]: {
        progress: number;
        buffer: number;
        message: string;
    };
}
export default function CheckVoucher({auth}: {auth: Auth}) {
    const [progress, setProgress] = useState<ProgressState>({});

    useEcho(`cv-progress.${auth.user.id}`, 'CvProgress', (e: any) => {
        const { percentage, total, message } = e;

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
        const { url, method } = retrieveCheckVoucher();
        await axios({ url, method });
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
                        {Object.keys(progress).length === 0 && (
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    sx={{ minWidth: 'fit-content' }}
                                    onClick={simulateDataRetrieval}
                                >
                                    Get Data
                                </Button>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ textAlign: 'center' }}
                                >
                                    Click the &quot;Get Data&quot; to start
                                    generate&nbsp;
                                </Typography>
                            </>
                        )}
                    </Stack>
                    <Box sx={{ width: '100%', p: 2 }}>
                        {Object.keys(progress).length === 0 && (
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
