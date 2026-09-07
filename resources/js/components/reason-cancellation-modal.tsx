import { modalMediumStyle } from '@/lib/modalStyle';
import { cancelCheck } from '@/routes';
import { useForm } from '@inertiajs/react';
import { Grid, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

export default function ReasonCancellationModal({
    id,
    open,
    handleClose,
}: {
    id: number[];
    open: boolean;
    handleClose: () => void;
}) {
    const { setData, post, processing, errors, reset, transform } = useForm({
        reason: '',
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            ids: id,
        }));

        post(cancelCheck().url, {
            preserveScroll: true,
            preserveState: true,
            onError: (e) => {
                console.log(e);
            },
            onSuccess: () => {
                reset();
                handleClose();
            },
        });
    };

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalMediumStyle}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Reason for Cancellations
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Grid
                            container
                            spacing={2}
                            sx={{ mb: 2, width: '100%', mt: 3 }}
                        >
                            <Grid size={{ xs: 12, sm: 12 }}>
                                <TextField
                                    id="reason"
                                    label="Type your reason here..."
                                    onChange={(e) =>
                                        setData('reason', e.target.value)
                                    }
                                    error={!!errors.reason}
                                    helperText={errors.reason}
                                    multiline
                                    rows={4}
                                    fullWidth
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            minHeight: 120,
                                            alignItems: 'flex-start',
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ textAlign: 'right', mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                loading={processing}
                            >
                                Update
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </>
    );
}
