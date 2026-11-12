import {
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
    SelectChangeEvent,
    Stack,
    Typography,
} from '@mui/material';

import AppLayout from '@/layouts/app-layout';
import { generateReport } from '@/routes';
import { BreadcrumbItem, SelectionType } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneIcon from '@mui/icons-material/Tune';
import ViewListIcon from '@mui/icons-material/ViewList';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { Dayjs } from 'dayjs';
import { ChangeEvent, ReactNode, useState } from 'react';
import PermissionSelection from '../admin/components/permissionSelection';

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
}: {
    columns: string[];
    reportSelection: string[];
    bu: SelectionType[];
}) {
    const { data, setData, post, errors, transform } = useForm({
        bu: [] as string[],
        selectedReport: [] as string[],
        forwardedLocations: [] as string[],
        columns: [] as string[],
    });
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);

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

    const onGenerate = () => {
        transform((data) => ({
            ...data,
            startDate: startDate?.format('YYYY-MM-DD') ?? null,
            endDate: endDate?.format('YYYY-MM-DD') ?? null,
        }));

        post(generateReport().url, {
            preserveScroll: true,
            preserveState: true,
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
                <Grid container spacing={2}>
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

                                            {key === 'forwarded' &&
                                                data.selectedReport.includes(
                                                    'forwarded',
                                                ) && (
                                                    <Box sx={{ pl: 4 }}>
                                                        {['Cebu', 'Manila'].map(
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

                    {/* OTHER FILTER */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <SectionCard
                            title="OTHER FILTER"
                            color="#4fc3f7"
                            icon={<TuneIcon fontSize="small" />}
                        >
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

                    <Grid size={{ xs: 12 }} sx={{ mt: 3 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Stack
                                direction="column"
                                alignItems="center"
                                spacing={1.5}
                            >
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    color="text.primary"
                                >
                                    Select Date
                                </Typography>

                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="center"
                                    spacing={1}
                                >
                                    <DatePicker
                                        label="Start Date"
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                        maxDate={endDate || undefined}
                                    />

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: '1.2rem',
                                            color: 'text.secondary',
                                        }}
                                    >
                                        ➔
                                    </Box>

                                    <DatePicker
                                        label="End Date"
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                        minDate={startDate || undefined}
                                    />
                                </Stack>
                            </Stack>
                        </LocalizationProvider>
                    </Grid>

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
                </Grid>
            </Box>
        </AppLayout>
    );
}
