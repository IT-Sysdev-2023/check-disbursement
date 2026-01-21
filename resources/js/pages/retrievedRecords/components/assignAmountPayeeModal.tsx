import { getScannedRecords, updateScannedRecord } from '@/routes';
import { ScannedRecords } from '@/types';
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
import axios from 'axios';
import { useEffect, useState } from 'react';

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
export default function AssignAmountPayeeModal({
    title,
    open,
    onClose,
    id,
}: {
    title: string;
    open: boolean;
    id: number;
    onClose: () => void;
}) {
    const [record, setRecord] = useState<ScannedRecords>();
    const { data, setData, errors, put, reset } = useForm({
        payee: '',
        amount: 0,
    });

    useEffect(() => {
        const getRecord = async () => {
            const { data } = await axios.get(getScannedRecords(id).url);
            setRecord(data);
            setData({
                payee: data.payee,
                amount: data.amount,
            });
        };

        getRecord();
    }, [id]);

    const handleSubmit = () => {
        if (!record?.id) return;
        put(updateScannedRecord(record.id).url, {
            preserveScroll: true,
            preserveState: true,
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
                                    Seq.:
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.seq}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Check Number
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.checkNo}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Check Date
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.postedDate}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Account Number
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.accountNo}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Business Unit
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.bu}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Branch Name
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.branchName}
                                </Typography>
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
                                    InputProps={{
                                        readOnly:
                                            data.amount !== 0 &&
                                            data.amount != null,
                                    }}
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
