import { Crf } from '@/types';
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

export default function CrfDetails({ details }: { details: Crf }) {
    return (
        <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Grid container spacing={2} sx={{ width: '100%' }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Crf #</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.crf}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Company</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.company}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">No</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.no}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Date</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {dayjs(details.date).format('MMMM D, YYYY')}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Paid To</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.paidTo}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Particulars</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.particulars}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Amount</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.amount}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Bank</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.bank}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Ck No</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.ckNo}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Prepared By</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.preparedBy}
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
            </Stack>
        </Box>
    );
}
