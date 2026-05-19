import ChequeStatusChip from '@/components/chip-status';
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

export default function CrfDetails({ details }: { details: Crf }) {
    return (
        <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Grid container spacing={2} sx={{ width: '100%' }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Crf #</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.cvNo}
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

                {/* <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Date</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {dayjs(details.date).format('MMMM D, YYYY')}
                        </Typography>
                    </Paper>
                </Grid> */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline">Paid To</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.payee}
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
                        <Typography variant="overline">Check No</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {details.checkNumber}
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
                {details.chequeStatus && (
                    <>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Released Date:
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {details.chequeStatus?.createdAt ?? '-'}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Status:
                                </Typography>

                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <ChequeStatusChip
                                        status={details?.chequeStatus?.status}
                                    />
                                </Typography>
                            </Paper>
                        </Grid>
                    </>
                )}
                 {details?.chequeStatus?.status === 'cancelled' && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">
                                Cancelled Reason
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {details.chequeStatus?.cancelledReason}
                            </Typography>
                        </Paper>
                    </Grid>
                )}
                {details?.chequeStatus?.receiversName && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">
                                Receivers Name
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {details.chequeStatus?.receiversName}
                            </Typography>
                        </Paper>
                    </Grid>
                )}
                {details?.chequeStatus?.image && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">Image</Typography>

                            <Box
                                component="img"
                                src={details.chequeStatus.image}
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
                {details?.chequeStatus?.signature && (
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
                                    src={details.chequeStatus.signature}
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
            </Stack>
        </Box>
    );
}
