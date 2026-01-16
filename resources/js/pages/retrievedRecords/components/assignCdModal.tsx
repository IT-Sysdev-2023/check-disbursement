import { updateAssignCheckDate } from '@/routes';
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
    Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
export default function AssignCdModal({
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
    const { data, setData, put, errors, reset, transform } = useForm<{
        checkDate: string | null; // store as ISO string
    }>({
        checkDate: chequeData.checkDate
            ? dayjs(chequeData.checkDate).format('YYYY-MM-DD')
            : null,
    });

    const handleSubmit = () => {
        transform((data) => ({
            ...data,
            id: chequeData.chequeId,
            type: chequeData.type,
        }));
        put(updateAssignCheckDate().url, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
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
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {chequeData.checkNumber}
                                </Typography>
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
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Paper sx={{ px: 2, py: 1 }}>
                                    <DatePicker
                                        label="Start Date"
                                        value={
                                            data.checkDate
                                                ? dayjs(data.checkDate)
                                                : null
                                        }
                                        onChange={(newValue) =>
                                            setData(
                                                'checkDate',
                                                newValue
                                                    ? newValue.format(
                                                          'YYYY-MM-DD',
                                                      )
                                                    : null,
                                            )
                                        }
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.checkDate,
                                                helperText: errors.checkDate,
                                                sx: { mt: 1 },
                                            },
                                        }}
                                    />
                                </Paper>
                            </LocalizationProvider>
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
