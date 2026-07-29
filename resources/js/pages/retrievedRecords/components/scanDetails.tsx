import { getScannedRecords } from '@/routes';
import { ScannedRecords } from '@/types';
import { Box, Divider, Grid, Modal, Paper, Typography } from '@mui/material';
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
export default function ScanDetails({
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

    useEffect(() => {
        if (!open || !id) return;
        const getRecord = async () => {
            const { data } = await axios.get(getScannedRecords(id).url);

            setRecord(data);
        };

        getRecord();
    }, [id, open]);
    console.log(record);

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
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Bank:
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.bank}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Bank Account:
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.bankAccountNumber}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Bank Address:
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.bankAddress}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Cheque Number
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.chequeNo}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Check Date
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.chequeDate}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Account Number
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.bankAccountNumber}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Amount
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.amount}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Amount in Words
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.amountInWords}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Payee
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.payee}
                                </Typography>
                            </Paper>
                        </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Serial Code
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.serialCode}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 3 }} />
                </Box>
            </Box>
        </Modal>
    );
}
