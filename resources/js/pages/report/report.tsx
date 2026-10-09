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
    Typography,
} from '@mui/material';

import AppLayout from '@/layouts/app-layout';
import { generateReport } from '@/routes';
import { BreadcrumbItem, SelectionType } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneIcon from '@mui/icons-material/Tune';
import ViewListIcon from '@mui/icons-material/ViewList';
import { ChangeEvent, ReactNode } from 'react';
import PermissionSelection from '../admin/components/permissionSelection';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

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
const REPORT_OPTIONS = {
    pdc: 'PDC Cheques',
    vss: 'Voucher Status Summary',
};
export default function EmployeeReportFilters({
    columns,
    chequeStatuses,
    settlementStatuses,
    // borrower,
    location,
    bu,
}: {
    columns: string[];
    chequeStatuses: SelectionType[];
    settlementStatuses: SelectionType[];
    // borrower: SelectionType[];
    location: SelectionType[];
    bu: SelectionType[];
}) {
    const { data, setData, post, errors, transform } =
        useForm({
            bu: [] as string[],
            borrower: [] as string[],
            settlementStatus: [] as string[],
            chequeStatus: [] as string[],
            location: [] as string[],
            selectedChecks: [] as string[],
            selectedReport: [] as string[],
            columns: [] as string[],
             date: '',
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

    const onGenerate = () => {
        transform((data) => ({
            ...data,
            status: [...data.settlementStatus, ...data.chequeStatus],
        }));
        // console.log(data);
        post(generateReport().url, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleChangeSelection = (
        event: SelectChangeEvent<string[]>,
        filter: 'borrower' | 'location' | 'settlementStatus' | 'chequeStatus' | 'bu',
    ) => {
        const {
            target: { value },
        } = event;
        setData(filter, typeof value === 'string' ? value.split(',') : value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Report" />

            <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    {/* DISPLAY FIELDS */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        {/* <SectionCard
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
                        </SectionCard> */}
                        <SectionCard
                            title="Select Report"
                            color="#1e88e5"
                            icon={<ViewListIcon fontSize="small" />}
                        >
                            <FormControl
                                error={Boolean(errors.selectedReport)}
                                component="fieldset"
                            >
                                {Object.entries(REPORT_OPTIONS).map(
                                    ([key, label]) => (
                                        <FormControlLabel
                                            key={key}
                                            control={
                                                <Checkbox
                                                    size="small"
                                                    onChange={handleChange(
                                                        'selectedReport',
                                                    )(key)}
                                                />
                                            }
                                            label={label}
                                        />
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
                                sx={{ mb: 2, mt: 3 }}
                            >
                                <InputLabel>Filter Date</InputLabel>
                                <DatePicker value={data.date ? dayjs(data.date) : null}
                                    onChange={(date) =>
                                        setData('date', date?.isValid() ? date.format('YYYY-MM-DD') : '')
                                    }/>
                            </FormControl>
                           

                            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                                <InputLabel>Business Unit</InputLabel>
                                <PermissionSelection
                                    permissions={bu}
                                    selectedPermission={data.bu}
                                    handleChange={(e) =>
                                        handleChangeSelection(e, 'bu')
                                    }
                                />
                            </FormControl>
                             <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                                <InputLabel>Tag Location</InputLabel>
                                <PermissionSelection
                                    permissions={location}
                                    selectedPermission={data.location}
                                    handleChange={(e) =>
                                        handleChangeSelection(e, 'location')
                                    }
                                />
                            </FormControl>

                            <FormControl
                                fullWidth
                                size="small"
                                sx={{ mb: 3 }}
                            >
                                <InputLabel>Settlement Method</InputLabel>
                                <PermissionSelection
                                    permissions={settlementStatuses}
                                    selectedPermission={data.settlementStatus}
                                    handleChange={(e) =>
                                        handleChangeSelection(e, 'settlementStatus')
                                    }
                                />
                            </FormControl>
                            <FormControl
                                fullWidth
                                size="small"
                                sx={{ mb: 3}}
                            >
                                <InputLabel>Cheque Status</InputLabel>
                                <PermissionSelection
                                    permissions={chequeStatuses}
                                    selectedPermission={data.chequeStatus}
                                    handleChange={(e) =>
                                        handleChangeSelection(e, 'chequeStatus')
                                    }
                                />
                            </FormControl>
                            {/* <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                <InputLabel>Borrower Name</InputLabel>
                                <PermissionSelection
                                    permissions={borrower}
                                    selectedPermission={data.borrower}
                                    handleChange={(e) =>
                                        handleChangeSelection(e, 'borrower')
                                    }
                                />
                            </FormControl> */}

                           
                            {/* <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                                <InputLabel>Is Closed</InputLabel>
                                <PermissionSelection
                                    permissions={location}
                                    selectedPermission={data.location}
                                    handleChange={(e) =>
                                        handleChangeSelection(e, 'location')
                                    }
                                />
                            </FormControl> */}

                          
                        </SectionCard>
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
