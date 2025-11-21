import AppLayout from '@/layouts/app-layout';
import { checkRequestForm, extractCrf } from '@/routes';
import {
    Auth,
    EventType,
    FlashReponse,
    ProgressState,
    type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
    Alert,
    Box,
    Button,
    Container,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    SelectChangeEvent,
    Stack,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import SelectBu from './components/selectBu';

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

export default function CheckVoucher({
    auth,
    bu,
}: {
    auth: Auth;
    bu: { label: string; value: number }[];
}) {
    const [progress, setProgress] = useState<ProgressState>({});
    // const [loading, setLoading] = useState(false);
    const [uploadResponse, setUploadResponse] = useState<FlashReponse>({
        status: false,
        message: '',
        duplicates: [],
    });
    const [files, setFiles] = useState<File[]>([]);
    const [permissionList, setPermissionList] = useState<string[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        setFiles(Array.from(event.target.files));
    };

    useEcho(`cv-progress.${auth.user.id}`, 'CvProgress', (e: EventType) => {
        const { percentage, message } = e;

        // setLoading(false);
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

    const simulateDataRetrieval = () => {
        if (permissionList.length <= 0) {
            alert('Please select Business Unit');
            return;
        }

        router.post(
            extractCrf(),
            {
                files,
                bu: permissionList,
            },
            {
                onSuccess: (page) => {
                    const flash = page.props.flash as {
                        message?: string;
                        status?: boolean;
                        duplicates?: string[];
                    };
                    setUploadResponse({
                        status: flash.status ?? false,
                        message: flash?.message ?? '',
                        duplicates: flash?.duplicates ?? [],
                    });
                    setFiles([]);
                },
            },
        );
    };

    const handleChange = (event: SelectChangeEvent<typeof permissionList>) => {
        const {
            target: { value },
        } = event;

        setPermissionList(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
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
                        <SelectBu
                            permissions={bu}
                            selectedPermission={permissionList}
                            handleChange={handleChange}
                        />
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
                        {files.length > 0 && (
                            <>
                                <List
                                    sx={{ mt: 2, width: '100%', maxWidth: 360 }}
                                >
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
