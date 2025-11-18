import { Crf } from '@/types';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

export default function CrfFields({ crf }: {crf: Crf}) {

    return (
        <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ width: '100%', p: 6 }}
        >
            <FormGroup>
                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 2, width: '100%', mt: 3 }}
                >
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <TextField
                            value={crf.crf}
                            label="CRF #"
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
                            value={crf.company}
                            label="Company"
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
                            
                            value={crf.no}
                            label="No"
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
                            
                            value={crf.location}
                            label="Location"
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
                            
                            value={crf.date}
                            label="Date"
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
                            
                            value={crf.paid_to}
                            label="Paid To"
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
                            
                            value={crf.particulars}
                            label="Particulars"
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
                            
                            value={crf.amount}
                            label="Amount"
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
                            
                            value={crf.bank}
                            label="Bank"
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
                            
                            value={crf.ck_no}
                            label="CK No"
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
                            
                            value={crf.prepared_by}
                            label="Prepared By"
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
