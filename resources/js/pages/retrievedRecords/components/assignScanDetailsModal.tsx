import NumberFormatInput from '@/components/numberFormatInput';
import SelectItem from '@/pages/dashboard/components/SelectItem';
import { banks, initialScan, storeScanRecord } from '@/routes';
import { SelectionType } from '@/types';
import { router, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Divider,
    Grid,
    Modal,
    Paper,
    SelectChangeEvent,
    TextField,
    Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

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
    borrowedCheckId: any;
    onClose: () => void;
}) {
    const [bank, setBank] = useState('');
    const [onLoading, setOnLoading] = useState(false);
    const [bankRecords, setBankRecords] = useState<SelectionType[]>([]);
    const { data, setData, errors, post, reset, transform } = useForm({
        accountNumber: '',
        checkNumber: '',
        checkDate: null as any,
        payee: '',
        amount: 0,
    });
    useEffect(() => {
        if (borrowedCheckId) {
            setData({
                ...data,
                checkDate: dayjs(borrowedCheckId.checkDate),
                checkNumber: borrowedCheckId.checkNumber,
                amount: borrowedCheckId.amount,
                payee: borrowedCheckId.payee,
            });
        }
    }, [borrowedCheckId]);

    useEffect(() => {
        const getRecord = async () => {
            const { data } = await axios.get(banks().url);

            setBankRecords(data);
        };

        getRecord();
    }, []);

    const handleSubmit = () => {
        transform((data) => ({
            ...data,
            checkDate: dayjs(data.checkDate).format('YYYY-MM-DD'),
        }));

        post(storeScanRecord(borrowedCheckId.id).url, {
            preserveScroll: true,
            onBefore: () => setOnLoading(true),
            onError:() => setOnLoading(false),
            onSuccess: () => {
                setOnLoading(false);
                reset();
                onClose();
            },
        });
    };

    const handleBankChange = (e: SelectChangeEvent) => {
        setBank(e.target.value);
        setData('accountNumber', ''); // reset
    };

    const accountOptions = useMemo(() => {
        const selectedBank = bankRecords.find((b) => b.value === bank);

        if (!selectedBank?.bank_accounts) return [];

        return selectedBank.bank_accounts.map((acc) => ({
            value: acc.id,
            label: String(acc.account_no),
        }));
    }, [bankRecords, bank]);

    const scanCv = () => {
        router.post(
            initialScan(),
            {
                id: borrowedCheckId.id,
            },
            {
                onSuccess: () => onClose(),
            },
        );
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
                                <SelectItem
                                    handleChange={handleBankChange}
                                    value={bank}
                                    title=""
                                    items={bankRecords}
                                />
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Account Number
                                </Typography>
                                <SelectItem
                                    handleChange={(e) =>
                                        setData('accountNumber', e.target.value)
                                    }
                                    value={data.accountNumber}
                                    title=""
                                    items={accountOptions}
                                />
                                {errors.accountNumber && (
                                    <Typography
                                        variant="caption"
                                        color="error"
                                        sx={{ mt: 0.5, display: 'block' }}
                                    >
                                        {errors.accountNumber}
                                    </Typography>
                                )}
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
                                <NumberFormatInput
                                    fullWidth
                                    size="small"
                                    value={data.amount}
                                    error={!!errors.amount}
                                    helperText={errors.amount ?? ' '}
                                    onChange={(e) =>
                                        setData('amount', e.target.value)
                                    }
                                    sx={{ mb: 1 }}
                                />
                                {/* <TextField
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
                                /> */}
                            </Paper>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ textAlign: 'right', mt: 2 }}>
                        {!borrowedCheckId.isScanned && (
                            <Button
                                sx={{ mr: 2 }}
                                variant="outlined"
                                color="secondary"
                                onClick={scanCv}
                                loading={onLoading}
                            >
                                Scan CV
                            </Button>
                        )}

                        {borrowedCheckId.isScanned === 1 && <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSubmit}
                            loading={onLoading}
                        >
                            Submit
                        </Button>}
                    </Box>
                    {/* <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="space-between"
                    >
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleSubmit}
                                loading={onLoading}
                            >
                                Submit
                            </Button>
                        </Stack>
                    </Stack> */}
                </Box>
            </Box>
        </Modal>
    );
}
