import { Cv } from '@/types';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

export default function CheckForm({ cv }: { cv: Cv }) {

    return (
        <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ width: '100%', p: 6 }}
        >
            <Typography variant="h6" sx={{ mb: 2 }}>
                CV Number: {cv.cvHeader?.cvNo}
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
                            value={cv.checkNumber}
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
                            type="text"
                            value={cv.checkAmount}
                            name="check_amount"
                            label="Check Amount"
                            fullWidth
                            slotProps={{
                                input: {
                                    readOnly: true,
                                    inputProps: {
                                        style: { textAlign: 'right' },
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <TextField
                            type="text"
                            value={cv.checkDate}
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
                            value={cv.cvHeader?.vendorNo}
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
                            value={cv.bankAccountNo}
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
                            value={cv.bankName}
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
                            value={cv.checkClassLocation}
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
                            value={cv.clearingDate}
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
                            value={cv.cvHeader?.remarks}
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
        </Box>
    );
}
