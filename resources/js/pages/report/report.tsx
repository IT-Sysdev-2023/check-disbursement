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
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from '@mui/material';

import AppLayout from '@/layouts/app-layout';
import { generateReport } from '@/routes';
import { BreadcrumbItem, SelectionType } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneIcon from '@mui/icons-material/Tune';
import ViewListIcon from '@mui/icons-material/ViewList';
import { ChangeEvent, ReactNode, useEffect } from 'react';
import SelectItem from '../dashboard/components/SelectItem';

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

const CHECK_OPTIONS = {
    cv: 'Check Voucher (CV)',
    crf: 'Check Request Form (CRF)',
};
export default function EmployeeReportFilters({
    columns,
    cvColumns,
    crfColumns,
    statuses,
    borrower,
    location,
}: {
    columns: string[];
    cvColumns: string[];
    crfColumns: string[];
    statuses: string[];
    borrower: SelectionType[];
    location: SelectionType[];
}) {
    const { data, setData, post, processing, errors, transform, reset } =
        useForm({
            borrower: '',
            status: '',
            location: '',
            selectedChecks: [] as string[],
            columns: [] as string[],
        });
    const handleChange =
        (field: keyof typeof data) =>
        (key: string) =>
        (event: ChangeEvent<HTMLInputElement>) => {
            const current = data[field] as string[];
            if (event.target.checked) {
                setData(field, [...current, key]);
            } else {
                setData(
                    field,
                    current.filter((v) => v !== key),
                );
            }
        };

    const CV_COLUMNS = new Set(cvColumns);
    const CRF_COLUMNS = new Set(crfColumns);

    const getLabelColor = (label: string) => {
        if (CV_COLUMNS.has(label)) return 'info.main';
        if (CRF_COLUMNS.has(label)) return 'success.main';
        return 'text.primary';
    };

    useEffect(() => {
        router.reload({
            data: {
                check: data.selectedChecks,
            },
        });
    }, [data.selectedChecks]);

    const handleSelectionChange = (
        event: SelectChangeEvent,
        filter: 'borrower' | 'location' | 'status',
    ) => {
        setData(filter, event.target.value);
    };

    const onGenerate = () => {
        post(generateReport().url, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                const m = page.props.flash as FlashReponse;

                reset();
            },
            onError: (e) => {
                console.log(e);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Report" />

            <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    {/* DISPLAY FIELDS */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <SectionCard
                            title="SELECT CHECK"
                            color="#1e88e5"
                            icon={<ViewListIcon fontSize="small" />}
                        >
                            <FormControl
                                error={Boolean(errors.selectedChecks)}
                                component="fieldset"
                            >
                                {Object.entries(CHECK_OPTIONS).map(
                                    ([key, label]) => (
                                        <FormControlLabel
                                            key={key}
                                            control={
                                                <Checkbox
                                                    size="small"
                                                    onChange={handleChange(
                                                        'selectedChecks',
                                                    )(key)}
                                                />
                                            }
                                            label={label}
                                        />
                                    ),
                                )}

                                {errors.selectedChecks && (
                                    <FormHelperText>
                                        {errors.selectedChecks}
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
                                                onChange={handleChange(
                                                    'columns',
                                                )(label)}
                                            />
                                        }
                                        label={label}
                                        sx={{
                                            '& .MuiFormControlLabel-label': {
                                                color: getLabelColor(label),
                                                fontWeight: 500,
                                            },
                                        }}
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
                                sx={{ mb: 2, mt: 3 }}
                            >
                                <InputLabel>Status</InputLabel>
                                <Select
                                    label="Current Status"
                                    value={data.status}
                                    onChange={(e) =>
                                        handleSelectionChange(e, 'status')
                                    }
                                >
                                    {statuses.map((status) => (
                                        <MenuItem
                                            key={status}
                                            value={status}
                                            sx={{ width: '100%' }} // full clickable row
                                        >
                                            {status.charAt(0).toUpperCase() +
                                                status.slice(1)}{' '}
                                            {/* optional capitalization */}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                <SelectItem
                                    handleChange={(e) =>
                                        handleSelectionChange(e, 'borrower')
                                    }
                                    value={data.borrower}
                                    title="Borrower Name"
                                    items={borrower}
                                />
                            </FormControl>

                            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                                <SelectItem
                                    handleChange={(e) =>
                                        handleSelectionChange(e, 'location')
                                    }
                                    value={data.location}
                                    title="Tag location"
                                    items={location}
                                />
                            </FormControl>

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
                        </SectionCard>
                    </Grid>
                </Grid>
            </Box>
        </AppLayout>
    );
}
