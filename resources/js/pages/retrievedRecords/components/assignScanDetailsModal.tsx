import { storeScanRecord } from '@/routes';
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
export default function AssignScanDetailsModal({
    title,
    open,
    onClose,
    borrowedCheckId,
}: {
    title: string;
    open: boolean;
    borrowedCheckId: number;
    onClose: () => void;
}) {
    const { data, setData, errors, post, reset, transform } = useForm({
        bank: '',
        accountNumber: '',
        checkNumber: '',
        checkDate: null as any,
        payee: '',
        amount: 0,
    });
    // useEffect(() => {
    //     if (!open || !id) return;
    //     const getRecord = async () => {
    //         const { data } = await axios.get(getScannedRecords(id).url);

    //         setRecord(data);
    //         setData({
    //             payee: data.payee ?? '',
    //             // amount: data.amount ?? 0,
    //         });
    //     };

    //     getRecord();
    // }, [id, open]);

    const handleSubmit = () => {

        transform((data) => ({
            ...data,
            checkDate: dayjs(data.checkDate).format('YYYY-MM-DD'),
        }));

        post(storeScanRecord(borrowedCheckId).url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                // setRecord(undefined);
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
                                <Typography variant="overline">Bank</Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={data.bank}
                                    error={!!errors.bank}
                                    helperText={errors.bank ?? ' '}
                                    onChange={(e) =>
                                        setData('bank', e.target.value)
                                    }
                                    sx={{ mb: 1 }}
                                />
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Account Number
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={data.accountNumber}
                                    error={!!errors.accountNumber}
                                    helperText={errors.accountNumber ?? ' '}
                                    onChange={(e) =>
                                        setData('accountNumber', e.target.value)
                                    }
                                    sx={{ mb: 1 }}
                                />
                            </Paper>
                        </Grid>
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
                                        setData('checkNumber', e.target.value)
                                    }
                                    sx={{ mb: 1 }}
                                />
                            </Paper>
                        </Grid>
                    

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Paper sx={{ px: 2 }}>
                                    <Typography variant="overline">
                                        Check Date
                                    </Typography>
                                    <DatePicker
                                        label="Check Date"
                                        value={data.checkDate}
                                        onChange={(newValue) =>
                                            setData('checkDate', newValue)
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
                                <Typography variant="overline">
                                    Payee
                                </Typography>

                                <TextField
                                    fullWidth
                                    size="small"
                                    value={data.payee}
                                    error={!!errors.payee}
                                    helperText={errors.payee ?? ' '}
                                    onChange={(e) =>
                                        setData('payee', e.target.value)
                                    }
                                    sx={{ mb: 1 }}
                                />
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Amount
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={data.amount}
                                    error={!!errors.amount}
                                    helperText={errors.amount ?? ' '}
                                    onChange={(e) =>
                                        setData(
                                            'amount',
                                            Number(e.target.value),
                                        )
                                    }
                                    sx={{ mb: 1 }}
                                />
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
