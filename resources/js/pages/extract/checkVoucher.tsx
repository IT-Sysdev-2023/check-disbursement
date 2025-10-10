import AppLayout from '@/layouts/app-layout';
import { checkVoucher, retrieveCheckVoucher } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Box,
    Button,
    Container,
    InputLabel,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { Link } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Voucher',
        href: checkVoucher().url,
    },
];

type Project = {
    id: number;
    name: string;
    status: string;
    value: string;
};

export default function CheckVoucher() {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<Project[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const mockData: Project[] = [
        { id: 1, name: 'Project Alpha', status: 'Completed', value: '$12,450' },
        { id: 2, name: 'Project Beta', status: 'In Progress', value: '$8,720' },
        { id: 3, name: 'Project Gamma', status: 'Pending', value: '$15,300' },
        { id: 4, name: 'Project Delta', status: 'Completed', value: '$9,850' },
    ];

    const simulateDataRetrieval = async () => {
        // setIsLoading(true);
        // setProgress(0);
        // setError(null);
        //   setData(null);

        const { url, method } = retrieveCheckVoucher();
        const response = await axios({ url, method });

        console.log(response.data);

        // const interval = setInterval(() => {
        //   setProgress(prev => {
        //     if (prev >= 100) {
        //       clearInterval(interval);
        //       setData(mockData);
        //       setIsLoading(false);
        //       return 100;
        //     }
        //     return prev + Math.random() * 15;
        //   });
        // }, 300);

        //   await axios.get();
    };

    const simulateError = () => {
        setIsLoading(true);
        setProgress(0);
        setError(null);
        setData(null);

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 60) {
                    clearInterval(interval);
                    setError('Failed to retrieve data. Please try again.');
                    setIsLoading(false);
                    return 60;
                }
                return prev + Math.random() * 12;
            });
        }, 300);
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
                            Explore our cutting-edge dashboard, delivering
                            high-quality solutions tailored to your needs.
                            Elevate your experience with top-tier features and
                            services.
                        </Typography>
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
                            Click the &quot;Get Data&quot; to start generate&nbsp;
                            <Link href="#" color="primary">
                                Terms & Conditions
                            </Link>
                            .
                        </Typography>
                    </Stack>
                </Container>
            </Box>
        </AppLayout>
    );
}
