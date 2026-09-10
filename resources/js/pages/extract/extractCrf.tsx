import AppLayout from '@/layouts/app-layout';
import { checkRequestForm, extractCrf } from '@/routes';
import {
    Auth,
    EventType,
    FlashReponse,
    SingleProgressState,
    type BreadcrumbItem,
} from '@/types';
import { Head } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
    Alert,
    Box,
    Button,
    Container,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Stack,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { Trash } from 'lucide-react';
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

export default function ExtractCrf({
    auth,
    bu,
}: {
    auth: Auth;
    bu: { label: string; value: number }[];
}) {
    const [progress, setProgress] = useState<SingleProgressState>();
    const [uploadResponse, setUploadResponse] = useState<FlashReponse>({
        status: false,
        message: '',
        duplicates: [],
    });
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    // const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        setFiles(Array.from(event.target.files));
    };

    useEcho(`crf-progress.${auth.user.id}`, 'CrfProgress', (e: EventType) => {
        const { percentage, message, status } = e;
        const buffer = percentage + 10 > 100 ? 100 : percentage + 10;
        setProgress({
            progress: percentage,
            buffer,
            message,
            status,
        });
    });

    const simulateDataRetrieval = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post(
                extractCrf().url,
                {
                    files: files,
                },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );
            console.log(data);
            // if (data.status && progress?.progress == 100) {
            //     setUploadResponse({
            //         status: data.status ?? false,
            //         message: data?.message ?? '',
            //         duplicates: data?.duplicates ?? [],
            //     });
            // }
        } finally {
            setFiles([]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Check Request Form" />
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
                            Retrieve&nbsp;Cheque&nbsp;Request&nbsp;
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
                        {/* <SelectBu //DISABLE BU SELECTION
                            label="Select Business Unit"
                            permissions={bu}
                            selectedPermission={permissionList}
                            handleChange={handleChange}
                        /> */}
                        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
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
                        </LocalizationProvider> */}
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
                                multiple
                            />
                        </Button>
                        <Typography
                            variant="h6" // makes it larger than "caption"
                            sx={{
                                color: 'red', // change to any color you like
                                fontWeight: 'bold', // optional: makes it stand out
                                fontSize: '1rem', // optional: fine-tune size
                            }}
                        >
                            "This File Upload is Intended for Head Office Only"
                        </Typography>
                        {loading && !progress && (
                            <Typography
                                variant="h6" // makes it larger than "caption"
                            >
                                ...Uploading Files
                            </Typography>
                        )}
                        {files.length > 0 && !loading && (
                            <>
                                <List
                                    sx={{ mt: 2, width: '100%', maxWidth: 360 }}
                                >
                                    {files.map((file, index) => (
                                        <ListItem
                                            key={index}
                                            secondaryAction={
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    color="error"
                                                    onClick={() =>
                                                        setFiles((prev) =>
                                                            prev.filter(
                                                                (_, i) =>
                                                                    i !== index,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    <Trash />
                                                </IconButton>
                                            }
                                        >
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

                                <Button
                                    variant="contained"
                                    size="large"
                                    sx={{ minWidth: 'fit-content' }}
                                    onClick={simulateDataRetrieval}
                                >
                                    Get Data
                                </Button>
                            </>
                        )}

                        {progress && (
                            <Box sx={{ mb: 3, width: '100%' }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    {progress.message}
                                </Typography>

                                <LinearProgress
                                    variant="buffer"
                                    value={progress.progress}
                                    valueBuffer={progress.buffer}
                                />

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {progress.progress}%
                                </Typography>
                            </Box>
                        )}

                        {uploadResponse.message && (
                            <>
                                <Alert
                                    variant="outlined"
                                    severity={
                                        uploadResponse.status
                                            ? 'success'
                                            : 'error'
                                    }
                                >
                                    {uploadResponse.message}
                                </Alert>

                                {/* Show duplicates if they exist */}
                                {uploadResponse.duplicates?.length > 0 && (
                                    <List
                                        dense
                                        sx={{
                                            mt: 2,
                                            width: '100%',
                                            maxWidth: 400,
                                            bgcolor: 'background.paper',
                                            borderRadius: 2,
                                            boxShadow: 1,
                                        }}
                                    >
                                        <ListSubheader disableSticky>
                                            Duplicate Records
                                        </ListSubheader>

                                        {uploadResponse.duplicates.map(
                                            (item, index) => (
                                                <ListItem key={index} divider>
                                                    <ListItemIcon>
                                                        <WarningAmberIcon color="warning" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={`File #${item}`}
                                                    />
                                                </ListItem>
                                            ),
                                        )}
                                    </List>
                                )}
                            </>
                        )}
                    </Stack>
                </Container>
            </Box>
        </AppLayout>
    );
}
