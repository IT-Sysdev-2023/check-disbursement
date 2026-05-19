import { scannedRecordsAmountCheckNo } from '@/routes';
import { CheckScannedDetails, ScannedRecords } from '@/types';
import {
    Box,
    Grid,
    Modal,
    Paper,
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
    boxShadow: 24,
    p: 4,
};
export default function ScannedDetails({
    title,
    open,
    onClose,
    record,
}: {
    title: string;
    open: boolean;
    record: CheckScannedDetails;
    onClose: () => void;
}) {
    const [scannedRecord, setScannedRecord] = useState<ScannedRecords>();

    useEffect(() => {
        const getRecord = async () => {
            const { data } = await axios.get(scannedRecordsAmountCheckNo().url, {
                params: {
                    amount: record.amount,
                    chequeNo: record.checkNumber
                }
            });
            setScannedRecord(data);
        };

        getRecord();
    }, [record]);

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
                        {/* <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Seq.:
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {scannedRecord?.seq}
                                </Typography>
                            </Paper>
                        </Grid> */}

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Cheque Number
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {scannedRecord?.chequeNo}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Cheque Date
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {scannedRecord?.chequeDate}
                                </Typography>
                            </Paper>
                        </Grid>
                        {/* <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Business Unit
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {scannedRecord?.bu}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Branch Name
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {scannedRecord?.branchName}
                                </Typography>
                            </Paper>
                        </Grid> */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Amount
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {scannedRecord?.amount}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Payee
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {scannedRecord?.payee}
                                </Typography>
                            </Paper>
                        </Grid>
                        
                    </Grid>
                </Box>
            </Box>
        </Modal>
    );
}
