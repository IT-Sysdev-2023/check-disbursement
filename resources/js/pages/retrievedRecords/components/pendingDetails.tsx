import { pendingDetails } from '@/routes';
import { Borrower } from '@/types';
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
export default function PendingDetails({
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
    const [record, setRecord] = useState<Borrower>();

    useEffect(() => {
        if (!open || !id) return;
        const getRecord = async () => {
            const { data } = await axios.get(pendingDetails(id).url);

            setRecord(data);
        };

        getRecord();
    }, [id, open]);

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
                                    {record?.checkable?.checkNumber}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Check Date
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.checkable?.checkDate}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Payee
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.checkable.payee}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Amount
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.checkable.amount}
                                </Typography>
                            </Paper>
                        </Grid>
                         <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Borrower
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.borrower.name}
                                </Typography>
                            </Paper>
                        </Grid>
                         <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                   Reason for Borrowing
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.reason}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Tagged Location
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.checkable.tagLocation?.location}
                                </Typography>
                            </Paper>
                        </Grid>
                         <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline">
                                    Tagged At
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {record?.checkable.tagLocation?.createdAt}
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
