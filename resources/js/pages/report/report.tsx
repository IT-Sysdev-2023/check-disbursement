import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    LinearProgress,
    SelectChangeEvent,
    Stack,
    Typography,
} from '@mui/material';

import AppLayout from '@/layouts/app-layout';
import { generateReport } from '@/routes';
import {
    Auth,
    BreadcrumbItem,
    EventType,
    ProgressState,
    SelectionType,
} from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneIcon from '@mui/icons-material/Tune';
import ViewListIcon from '@mui/icons-material/ViewList';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickerValue } from '@mui/x-date-pickers/internals';
import axios from 'axios';
import { Dayjs } from 'dayjs';
import { ChangeEvent, ReactNode, useState } from 'react';
import PermissionSelection from '../admin/components/permissionSelection';
import HorizontalLinearAlternativeLabelStepper from '../extract/components/stepProgress';

const steps = [
    'Validating Requests...',
    'Connecting to Servers...',
    'Retreiving...',
];

const SectionCard = ({
    title,
    color,
    icon,
    children,
    height = 520,
}: {
    title: string;
    color: string;
    icon?: ReactNode;
    children: ReactNode;
    height?: number;
}) => (
    <Card sx={{ borderRadius: 2, height }}>
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                bgcolor: color,
                color: '#fff',
                fontWeight: 600,
            }}
        >
            {icon}
            <Typography variant="subtitle2">{title}</Typography>
        </Box>

        <CardContent sx={{ overflowY: 'auto', height: height - 52 }}>
            {children}
        </CardContent>
    </Card>
);
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Report',
        href: '#',
    },
];

export default function EmployeeReportFilters({
    columns,
    reportSelection,
    bu,
    locations,
    auth,
}: {
    columns: string[];
    locations: string[];
    reportSelection: string[];
    bu: SelectionType[];
    auth: Auth;
}) {
    const { data, setData, errors } = useForm({
        bu: [] as string[],
        selectedReport: [] as string[],
        forwardedLocations: [] as string[],
        columns: [] as string[],
    });
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [progressStep, setProgressStep] = useState(0);
    const [progress, setProgress] = useState<ProgressState>({});
    const [loading, setLoading] = useState(false);

    useEcho(
        `report-progress.${auth.user.id}`,
        'ReportProgress',
        (e: EventType) => {
            const { percentage, message, status, key } = e;

            setLoading(false);
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
        },
    );

    useEcho(
        `progress-stepper.${auth.user.id}`,
        'ProgressStepper',
        (e: { step: number }) => {
            const { step } = e;
            setProgressStep(step);
        },
    );

    const handleChange =
        (field: keyof typeof data) =>
        (key: string) =>
        (event: ChangeEvent<HTMLInputElement>) => {
            const checked = event.target.checked;
            const current = data[field] as string[];

            if (key === 'All') {
                setData(field, checked ? columns : []);
                return;
            }

            const updated = checked
                ? [...current.filter((v) => v !== 'All'), key]
                : current.filter((v) => v !== key);

            setData(field, updated);
        };

    const onGenerate = async () => {
        setLoading(true);

        await axios.post(generateReport().url, {
            startDate: startDate?.format('YYYY-MM-DD') ?? null,
            endDate: endDate?.format('YYYY-MM-DD') ?? null,
            bu: data.bu,
            selectedReport: data.selectedReport,
            forwardedLocations: data.forwardedLocations,
            columns: data.columns,
        });
    };

    const handleChangeSelection = (
        event: SelectChangeEvent<string[]>,
        filter:
            | 'borrower'
            | 'location'
            | 'settlementStatus'
            | 'chequeStatus'
            | 'bu',
    ) => {
        const {
            target: { value },
        } = event;
        setData(filter, typeof value === 'string' ? value.split(',') : value);
    };

    const handleStartDateChange = (value: PickerValue) => {
        setStartDate(value);
    };

    const handleEndDateChange = (value: PickerValue) => {
        setEndDate(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Report" />

            <Box sx={{ p: 2 }}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid size={{ xs: 12, md: 3 }}>
                        <SectionCard
                            title="Select Report"
                            color="#1e88e5"
                            icon={<ViewListIcon fontSize="small" />}
                        >
                            <FormControl
                                error={Boolean(errors.selectedReport)}
                                component="fieldset"
                            >
                                {Object.entries(reportSelection).map(
                                    ([key, label]) => (
                                        <Box key={key}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        size="small"
                                                        checked={data.selectedReport.includes(
                                                            key,
                                                        )}
                                                        onChange={handleChange(
                                                            'selectedReport',
                                                        )(key)}
                                                    />
                                                }
                                                label={label}
                                            />

                                            {key === 'fc' &&
                                                data.selectedReport.includes(
                                                    'fc',
                                                ) && (
                                                    <Box sx={{ pl: 4 }}>
                                                        {locations.map(
                                                            (location) => (
                                                                <FormControlLabel
                                                                    key={
                                                                        location
                                                                    }
                                                                    control={
                                                                        <Checkbox
                                                                            size="small"
                                                                            checked={data.forwardedLocations.includes(
                                                                                location,
                                                                            )}
                                                                            onChange={(
                                                                                e,
                                                                            ) => {
                                                                                const checked =
                                                                                    e
                                                                                        .target
                                                                                        .checked;

                                                                                setData(
                                                                                    'forwardedLocations',
                                                                                    checked
                                                                                        ? [
                                                                                              ...data.forwardedLocations,
                                                                                              location,
                                                                                          ]
                                                                                        : data.forwardedLocations.filter(
                                                                                              (
                                                                                                  item,
                                                                                              ) =>
                                                                                                  item !==
                                                                                                  location,
                                                                                          ),
                                                                                );
                                                                            }}
                                                                        />
                                                                    }
                                                                    label={
                                                                        location
                                                                    }
                                                                />
                                                            ),
                                                        )}
                                                    </Box>
                                                )}
                                        </Box>
                                    ),
                                )}

                                {errors.selectedReport && (
                                    <FormHelperText>
                                        {errors.selectedReport}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </SectionCard>
                    </Grid>

                    {/* CONDITIONS */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <SectionCard
                            title="COLUMNS"
                            color="#009688"
                            icon={<FilterListIcon fontSize="small" />}
                        >
                            <FormControl
                                error={Boolean(errors.columns)}
                                component="fieldset"
                            >
                                {columns.map((label) => (
                                    <FormControlLabel
                                        key={label}
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={
                                                    label === 'All'
                                                        ? data.columns
                                                              .length ===
                                                          columns.length
                                                        : data.columns.includes(
                                                              label,
                                                          )
                                                }
                                                onChange={handleChange(
                                                    'columns',
                                                )(label)}
                                            />
                                        }
                                        label={label}
                                    />
                                ))}
                            </FormControl>
                            {errors.columns && (
                                <FormHelperText>
                                    {errors.columns}
                                </FormHelperText>
                            )}
                        </SectionCard>
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <SectionCard
                            title="OTHER FILTER"
                            color="#4fc3f7"
                            icon={<TuneIcon fontSize="small" />}
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Stack
                                    direction="column"
                                    alignItems="center"
                                    spacing={1.5}
                                    mt={3}
                                >
                                    <Stack
                                        direction="column"
                                        alignItems="stretch"
                                        spacing={2}
                                        sx={{ width: '100%' }}
                                    >
                                        <DatePicker
                                            label="Start Date"
                                            value={startDate}
                                            onChange={handleStartDateChange}
                                            maxDate={endDate || undefined}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    size: 'small',
                                                },
                                            }}
                                        />

                                        <DatePicker
                                            label="End Date"
                                            value={endDate}
                                            onChange={handleEndDateChange}
                                            minDate={startDate || undefined}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    size: 'small',
                                                },
                                            }}
                                        />
                                    </Stack>
                                </Stack>
                            </LocalizationProvider>
                            <FormControl
                                fullWidth
                                size="small"
                                sx={{ mt: 3, mb: 3 }}
                            >
                                <InputLabel>Business Unit</InputLabel>
                                <PermissionSelection
                                    permissions={bu}
                                    selectedPermission={data.bu}
                                    handleChange={(e) =>
                                        handleChangeSelection(e, 'bu')
                                    }
                                />
                            </FormControl>
                        </SectionCard>
                    </Grid>

                    {!loading && (
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                bgcolor: '#009688',
                                '&:hover': { bgcolor: '#00796b' },
                            }}
                            onClick={onGenerate}
                        >
                            Generate Report
                        </Button>
                    )}
                    <Box sx={{ width: '100%', p: 2 }}>
                        {loading && Object.keys(progress).length === 0 && (
                            <HorizontalLinearAlternativeLabelStepper
                                step={progressStep}
                                steps={steps}
                            />
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
                                        sx={{
                                            mb: 2,
                                            '&.MuiAlert-filledError': {
                                                backgroundColor: '#D32F2F',
                                                color: '#FFFFFF',
                                            },
                                        }}
                                    >
                                        {item.message}
                                    </Alert>
                                ) : item.status == 'finished' ? (
                                    <Alert
                                        variant="filled"
                                        severity="success"
                                        sx={{
                                            mb: 2,
                                            bgcolor: 'success.light',
                                            '& .MuiAlert-icon': {
                                                color: 'success.dark', // or any color you want
                                            },
                                            borderColor: 'success.main',
                                        }}
                                    >
                                        {item.message}
                                    </Alert>
                                ) : (
                                    <>
                                        <Box>
                                            <Typography variant="body2">
                                                {item.message}
                                            </Typography>
                                        </Box>
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
                </Grid>
            </Box>
        </AppLayout>
    );
}
