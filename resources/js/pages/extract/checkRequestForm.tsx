import AppLayout from '@/layouts/app-layout';
import { checkRequestForm, extractCrf } from '@/routes';
import { ProgressState, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
    Box,
    Button,
    Container,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Request Form',
        href: checkRequestForm().url,
    },
];

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function CheckVoucher() {
    // const [progress, setProgress] = useState<ProgressState>({});
    // const [startDate, setStartDate] = useState<Dayjs | null>(null);
    // const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        setFiles(Array.from(event.target.files));
    };

    const simulateDataRetrieval = async () => {
        
        console.log(files);
        setLoading(true);

        router.post(extractCrf(), {
           files
        });
        // const { url, method } = extractCrf();
        // await axios({
        //     url,
        //     method,
        //     data: files
        // });
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
                            Retrieve&nbsp;Check&nbsp;Request&nbsp;
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
                                Form
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
                            sx={{
                                mt: 5,
                            }}
                            color="secondary"
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload files
                            <VisuallyHiddenInput
                                type="file"
                                onChange={handleFileChange}
                                // onChange={(event) =>
                                //     console.log(event.target.files)
                                // }
                                multiple
                            />
                        </Button>
                        {files.length > 0 && (
                            <List sx={{ mt: 2, width: '100%', maxWidth: 360 }}>
                                {files.map((file, index) => (
                                    <ListItem key={index}>
                                        <ListItemIcon>
                                            <InsertDriveFileIcon color="action" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={file.name}
                                            secondary={`${(file.size / 1024).toFixed(1)} KB`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                        {files.length > 0 && (
                            <Button
                                variant="contained"
                                size="large"
                                sx={{ minWidth: 'fit-content' }}
                                onClick={simulateDataRetrieval}
                            >
                                Get Data
                            </Button>
                        )}

                        {/* <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textAlign: 'center' }}
                        >
                            Click the &quot;Get Data&quot; to start
                            generate&nbsp;
                            <Link href="#" color="primary">
                                Terms & Conditions
                            </Link>
                            .
                        </Typography> */}
                    </Stack>
                </Container>
            </Box>
        </AppLayout>
    );
}
