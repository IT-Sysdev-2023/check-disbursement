import { Cv } from '@/types';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';
import * as React from 'react';

export interface EmployeeFormState {
    values: Partial<Omit<any, 'id'>>;
    errors: Partial<Record<keyof EmployeeFormState['values'], string>>;
}

export type FormFieldValue = string | string[] | number | boolean | File | null;

export interface EmployeeFormProps {
    formState: EmployeeFormState;
    onFieldChange: (
        name: keyof EmployeeFormState['values'],
        value: FormFieldValue,
    ) => void;
    onSubmit: (
        formValues: Partial<EmployeeFormState['values']>,
    ) => Promise<void>;
    onReset?: (formValues: Partial<EmployeeFormState['values']>) => void;
    submitButtonLabel: string;
    backButtonPath?: string;
    cv: Cv;
}

export default function EmployeeForm(props: EmployeeFormProps) {
    const {
        cv,
        formState,
        onFieldChange,
        onSubmit,
        onReset,
        submitButtonLabel,
        backButtonPath,
    } = props;

    const formValues = formState.values;
    const formErrors = formState.errors;

    //   const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = React.useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            setIsSubmitting(true);
            try {
                await onSubmit(formValues);
            } finally {
                setIsSubmitting(false);
            }
        },
        [formValues, onSubmit],
    );

    const handleTextFieldChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onFieldChange(
                event.target.name as keyof EmployeeFormState['values'],
                event.target.value,
            );
        },
        [onFieldChange],
    );

    const handleNumberFieldChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onFieldChange(
                event.target.name as keyof EmployeeFormState['values'],
                Number(event.target.value),
            );
        },
        [onFieldChange],
    );

    const handleCheckboxFieldChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            onFieldChange(
                event.target.name as keyof EmployeeFormState['values'],
                checked,
            );
        },
        [onFieldChange],
    );

    const handleDateFieldChange = React.useCallback(
        (fieldName: keyof EmployeeFormState['values']) =>
            (value: Dayjs | null) => {
                if (value?.isValid()) {
                    onFieldChange(fieldName, value.toISOString() ?? null);
                } else if (formValues[fieldName]) {
                    onFieldChange(fieldName, null);
                }
            },
        [formValues, onFieldChange],
    );

    const handleSelectFieldChange = React.useCallback(
        (event: SelectChangeEvent) => {
            onFieldChange(
                event.target.name as keyof EmployeeFormState['values'],
                event.target.value,
            );
        },
        [onFieldChange],
    );

    const handleReset = React.useCallback(() => {
        if (onReset) {
            onReset(formValues);
        }
    }, [formValues, onReset]);

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
            onReset={handleReset}
            sx={{ width: '100%', p: 6 }}
        >
            <Typography variant="h6" sx={{ mb: 2 }}>
                CV Number: {cv.cv_header.cv_no}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Payee: {cv.payee}
            </Typography>
            <FormGroup>
                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 2, width: '100%', mt: 3 }}
                >
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <TextField
                            value={cv.check_number}
                            onChange={handleTextFieldChange}
                            name="check_number"
                            label="Check Number"
                            slotProps={{
                                input: {
                                    readOnly: true,
                                },
                            }}
                            fullWidth
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <TextField
                            type="number"
                            value={cv.check_amount}
                            onChange={handleNumberFieldChange}
                            name="check_amount"
                            label="Check Amount"
                            fullWidth
                             slotProps={{
                                input: {
                                    readOnly: true,
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <TextField
                            type="text"
                            value={cv.check_date}
                            onChange={handleNumberFieldChange}
                            name="check_date"
                            label="Check Date"
                            fullWidth
                             slotProps={{
                                input: {
                                    readOnly: true,
                                },
                            }}
                        />
                    </Grid>

                    {/* <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={
                                    formValues.joinDate
                                        ? dayjs(formValues.joinDate)
                                        : null
                                }
                                onChange={handleDateFieldChange('joinDate')}
                                name="joinDate"
                                label="Check Date"
                                slotProps={{
                                    textField: {
                                        error: !!formErrors.joinDate,
                                        helperText: formErrors.joinDate ?? ' ',
                                        fullWidth: true,
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    </Grid> */}
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <TextField
                            type="text"
                            value={cv.cv_header.vendor_no}
                            label="Vendor"
                            fullWidth
                             slotProps={{
                                input: {
                                    readOnly: true,
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <TextField
                            type="text"
                            value={cv.bank_account_no}
                            label="Bank Account No."
                            fullWidth
                             slotProps={{
                                input: {
                                    readOnly: true,
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <TextField
                            type="text"
                            value={cv.bank_name}
                            label="Bank Name"
                            fullWidth
                             slotProps={{
                                input: {
                                    readOnly: true,
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <TextField
                            type="text"
                            value={
                                cv.check_class_location != ''
                                    ? cv.check_class_location
                                    : 'N/A'
                            }
                            label="Check Class Location"
                            fullWidth
                             slotProps={{
                                input: {
                                    readOnly: true,
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <TextField
                            type="text"
                            value={cv.clearing_date}
                            label="Clearing Date"
                            fullWidth
                             slotProps={{
                                input: {
                                    readOnly: true,
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <TextField
                            type="text"
                            value={cv.cv_header.remarks}
                            label="Remarks"
                            fullWidth
                             slotProps={{
                                input: {
                                    readOnly: true,
                                },
                            }}
                        />
                    </Grid>
                </Grid>
            </FormGroup>
            {/* <Box sx={{ textAlign: 'right', mt: 2 }}>
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                >
                    {submitButtonLabel}
                </Button>
            </Box> */}
        </Box>
    );
}
