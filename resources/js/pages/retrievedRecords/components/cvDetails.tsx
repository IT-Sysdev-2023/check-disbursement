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

export default function CvDetails({ details }: { details: Cv }) {
    return (
        <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Grid container spacing={2} sx={{ width: '100%' }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">CV Number</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.cvNo}
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
                            {details.chequeNumber}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Check Amount</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.amount}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Check Date</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {dayjs(details.chequeDate).format('MMMM D, YYYY')}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">
                            Bank Account No.
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.bankAccountNo}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Bank Name</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.bank}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Remarks</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.remarks}
                        </Typography>
                    </Paper>
                </Grid>
            
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
