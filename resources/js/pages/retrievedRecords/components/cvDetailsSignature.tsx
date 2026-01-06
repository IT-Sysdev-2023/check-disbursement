import { Cv } from '@/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    Box,
    Button,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import dayjs from 'dayjs';

export default function CvDetailsSignature({ details }: { details: Cv }) {

    return (
        <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Grid container spacing={2} sx={{ width: '100%' }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">CV Number</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.cvHeader?.cvNo}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Payee</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.payee}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Check Number</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.checkNumber}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Check Amount</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.checkAmount}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Released Date:</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {dayjs(details.checkStatus?.created_at).format('MMMM D, YYYY')}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Bank Name</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.bankName}
                        </Typography>
                    </Paper>
                </Grid>
                {details?.checkStatus?.image && (
                    <Grid size={{ xs: 12 ,sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">Image</Typography>

                            <Box
                                component="img"
                                src={details.checkStatus.image}
                                alt="Check preview"
                                sx={{
                                    mt: 1,
                                    width: '100%',
                                    maxHeight: 300,
                                    objectFit: 'contain',
                                    borderRadius: 1,
                                    border: '1px solid #e0e0e0',
                                }}
                            />
                        </Paper>
                    </Grid>
                )}
                {details?.checkStatus?.signature && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">
                                Signature
                            </Typography>

                            <Box
                                sx={{
                                    mt: 1,
                                    backgroundColor: '#fff', // force white bg
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 1,
                                    p: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={details.checkStatus.signature}
                                    alt="Signature preview"
                                    sx={{
                                        maxWidth: '100%',
                                        maxHeight: 300,
                                        objectFit: 'contain',
                                    }}
                                />
                            </Box>
                        </Paper>
                    </Grid>
                )}
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Stack direction="row" spacing={2} justifyContent="space-between">
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => window.history.back()}
                >
                    Back
                </Button>
                {/* <Stack direction="row" spacing={2}>
                    <Button variant="contained" startIcon={<EditIcon />}>
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                    >
                        Delete
                    </Button>
                </Stack> */}
            </Stack>
        </Box>
    );
}
