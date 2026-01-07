import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from '@mui/material';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SelectionType } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneIcon from '@mui/icons-material/Tune';
import ViewListIcon from '@mui/icons-material/ViewList';
import { ChangeEvent, useEffect, useState } from 'react';
import SelectItem from '../dashboard/components/SelectItem';

const SectionCard = ({ title, color, icon, children, height = 520 }) => (
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
    const [selectedChecks, setSelectedChecks] = useState<string[]>([]);
    const { data, setData, post, processing, errors, transform, reset } =
        useForm({
            borrower: '',
            status: '',
            location: '',
        });
    const handleChange =
        (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
            if (event.target.checked) {
                setSelectedChecks((prev) => [...prev, key]);
            } else {
                setSelectedChecks((prev) => prev.filter((v) => v !== key));
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
                check: selectedChecks,
            },
        });
    }, [selectedChecks]);

    const handleBorrowerChange = (event: SelectChangeEvent) => {
        console.log(event);
        setData('borrower', event.target.value);
    };

    const handleLocationChange = (event: SelectChangeEvent) => {
        setData('location', event.target.value);
    };

      const handleStatusChange = (event: SelectChangeEvent) => {
        setData('status', event.target.value);
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
                            {Object.entries(CHECK_OPTIONS).map(
                                ([key, label]) => (
                                    <FormControlLabel
                                        key={key}
                                        control={
                                            <Checkbox
                                                size="small"
                                                onChange={handleChange(key)}
                                            />
                                        }
                                        label={label}
                                    />
                                ),
                            )}
                        </SectionCard>
                    </Grid>

                    {/* CONDITIONS */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <SectionCard
                            title="COLUMNS"
                            color="#009688"
                            icon={<FilterListIcon fontSize="small" />}
                        >
                            {columns.map((label) => (
                                <FormControlLabel
                                    key={label}
                                    control={<Checkbox size="small" />}
                                    label={label}
                                    sx={{
                                        '& .MuiFormControlLabel-label': {
                                            color: getLabelColor(label),
                                            fontWeight: 500,
                                        },
                                    }}
                                />
                            ))}
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
                                    onChange={handleStatusChange}
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
                                    handleChange={handleBorrowerChange}
                                    value={data.borrower}
                                    title="Borrower Name"
                                    items={borrower}
                                />
                            </FormControl>

                            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                                <SelectItem
                                    handleChange={handleLocationChange}
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
