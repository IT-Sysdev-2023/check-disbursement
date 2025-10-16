import AppLayout from '@/layouts/app-layout';
import { retrieve } from '@/routes';
import { Cv, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Box,
    Button,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';
import { ChangeEvent, FormEvent, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retrieved CV/CRF',
        href: retrieve().url,
    },
    {
        title: 'Check Voucher',
        href: '#',
    },
];

interface EmployeeFormData {
    checkNumber: string;
    checkAmount: string;
    email: string;
    phone: string;
    location: string;
    bank: string;
}

interface EmployeeFormErrors {
    checkNumber?: string;
    checkAmount?: string;
    email?: string;
    phone?: string;
    location?: string;
    bank?: string;
}
export default function CvDetails({ cv }: { cv: Cv }) {
    const [checkDate, setCheckDate] = useState<Dayjs | null>(null);
    const [values, setValues] = useState<EmployeeFormData>({
        checkNumber: '',
        checkAmount: '',
        email: '',
        phone: '',
        location: '',
        bank: '',
    });

    const [errors, setErrors] = useState<EmployeeFormErrors>({});

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const validate = (): boolean => {
        const temp: EmployeeFormErrors = {};

        if (!values.checkNumber) temp.checkNumber = 'First name is required';
        if (!values.checkAmount) temp.checkAmount = 'Last name is required';
        if (!values.location) temp.location = 'Select a location';

        setErrors(temp);
        return Object.values(temp).every((x) => x === undefined);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            console.log('Form Data:', values);
            // Perform API call or state update here
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Check Releasing" />

            <Paper
                sx={{
                    maxWidth: 900,
                    mx: 'auto',
                    p: { xs: 3, sm: 4 },
                    mt: 4,
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                    background:
                        'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background:
                            'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    },
                }}
            >
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography
                        variant="h4"
                        fontWeight="800"
                        sx={{
                            background:
                                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1,
                        }}
                    >
                        Check Details
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ opacity: 0.8 }}
                    >
                        Fill in the check information below
                    </Typography>
                </Box>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        '& .MuiTextField-root': {
                            mb: 3,
                        },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    {/* Location Field */}
                    <Box sx={{ mb: 2 }}>
                        <Typography
                            variant="subtitle2"
                            fontWeight="600"
                            sx={{ mb: 2, ml: 1, color: 'text.primary' }}
                        >
                            Location
                        </Typography>
                        <TextField
                            select
                            name="location"
                            value={values.location}
                            onChange={handleChange}
                            error={Boolean(errors.location)}
                            helperText={
                                errors.location ||
                                'Select your department location'
                            }
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    '&:hover fieldset': {
                                        borderColor: '#667eea',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#667eea',
                                        borderWidth: 2,
                                    },
                                },
                            }}
                        >
                            <MenuItem value="engineering">
                                🏗️ Engineering
                            </MenuItem>
                            <MenuItem value="sales">💰 Sales</MenuItem>
                            <MenuItem value="marketing">📢 Marketing</MenuItem>
                            <MenuItem value="hr">👥 Human Resources</MenuItem>
                        </TextField>
                    </Box>

                    {/* Check Number & Date Row */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                            gap: 3,
                            mb: 4,
                        }}
                    >
                        <Box>
                            <Typography
                                variant="subtitle2"
                                fontWeight="600"
                                sx={{ mb: 2, ml: 1, color: 'text.primary' }}
                            >
                                Check Number
                            </Typography>
                            <TextField
                                label="Enter check number"
                                name="checkNumber"
                                value={values.checkNumber}
                                onChange={handleChange}
                                error={Boolean(errors.checkNumber)}
                                helperText={errors.checkNumber}
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.8)',
                                        '&:hover fieldset': {
                                            borderColor: '#667eea',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea',
                                            borderWidth: 2,
                                        },
                                    },
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography
                                variant="subtitle2"
                                fontWeight="600"
                                sx={{ mb: 2, ml: 1, color: 'text.primary' }}
                            >
                                Check Date
                            </Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Select date"
                                    value={checkDate}
                                    onChange={(newValue) =>
                                        setCheckDate(newValue)
                                    }
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            sx: {
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    backgroundColor:
                                                        'rgba(255, 255, 255, 0.8)',
                                                    '&:hover fieldset': {
                                                        borderColor: '#667eea',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#667eea',
                                                        borderWidth: 2,
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>
                    </Box>

                    {/* Amount & Bank Row */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                            gap: 3,
                            mb: 3,
                        }}
                    >
                        <Box>
                            <Typography
                                variant="subtitle2"
                                fontWeight="600"
                                sx={{ mb: 2, ml: 1, color: 'text.primary' }}
                            >
                                Check Amount
                            </Typography>
                            <TextField
                                label="Enter amount"
                                name="checkAmount"
                                value={values.checkAmount}
                                onChange={handleChange}
                                error={Boolean(errors.checkAmount)}
                                helperText={errors.checkAmount}
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.8)',
                                        '&:hover fieldset': {
                                            borderColor: '#667eea',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea',
                                            borderWidth: 2,
                                        },
                                    },
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography
                                variant="subtitle2"
                                fontWeight="600"
                                sx={{ mb: 2, ml: 1, color: 'text.primary' }}
                            >
                                Bank
                            </Typography>
                            <TextField
                                label="Enter bank name"
                                name="bank"
                                value={values.bank}
                                onChange={handleChange}
                                error={Boolean(errors.bank)}
                                helperText={errors.bank}
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.8)',
                                        '&:hover fieldset': {
                                            borderColor: '#667eea',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea',
                                            borderWidth: 2,
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Submit Button */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{
                                px: 6,
                                py: 1.5,
                                borderRadius: 3,
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                background:
                                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow:
                                    '0 4px 20px rgba(102, 126, 234, 0.3)',
                                '&:hover': {
                                    boxShadow:
                                        '0 6px 25px rgba(102, 126, 234, 0.5)',
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Submit Check
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </AppLayout>
    );
}
