import { storeAssignCheckNumber } from '@/routes';
import { ChequeType } from '@/types';
import { useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Divider,
    Grid,
    Modal,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import dayjs from 'dayjs';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
export default function AssignCnModal ({
    title,
    open,
    onClose,
    chequeData,
}: {
    title: string;
    open: boolean;
    onClose: () => void;
    chequeData: ChequeType;
}) {
    const { data, setData, errors, put } = useForm({
        checkNumber: chequeData.checkNumber || 0,
        id: chequeData.id,
        type: chequeData.type,
    });

    const handleSubmit = () => {
        put(storeAssignCheckNumber().url, {onSuccess: () => onClose() });
    };
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {title}
                </Typography>

                <Box sx={{ flexGrow: 1, width: '100%', mt: 2 }}>
                    <Grid container spacing={1} sx={{ width: '100%' }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Check Number
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={data.checkNumber}
                                    error={!!errors.checkNumber}
                                    helperText={errors.checkNumber ?? ' '}
                                    onChange={(e) =>
                                        setData(
                                            'checkNumber',
                                            Number(e.target.value),
                                        )
                                    }
                                    sx={{ mb: 1 }}
                                />
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Payee
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {chequeData.payee}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Check Amount
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {chequeData.amount}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Check Date
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {dayjs(chequeData.checkDate).format(
                                        'MMMM D, YYYY',
                                    )}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">Type</Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {chequeData.type}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Company Name
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {chequeData.companyName}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 3 }} />
                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="space-between"
                    >
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        </Modal>
    );
}
