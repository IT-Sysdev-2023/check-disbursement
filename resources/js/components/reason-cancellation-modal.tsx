import { cancelCheck } from '@/routes';
import { useForm } from '@inertiajs/react';
import { Grid, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ReasonCancellationModal({
    checkId,
    open,
    check,
    handleClose,
}: {
    checkId: number;
    open: boolean;
    check: string;
    handleClose: () => void;
}) {
    // const [open, setOpen] = useState(false);

    const { setData, post, processing, errors, reset } = useForm({
        reason: '',
        check: check,
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(cancelCheck(checkId).url, {
            preserveScroll: true,
            preserveState: true,
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
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Reason for Cancellation
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Grid
                            container
                            spacing={2}
                            sx={{ mb: 2, width: '100%', mt: 3 }}
                        >
                            <Grid size={{ xs: 12, sm: 12 }}>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Type your reason here..."
                                    onChange={(e) =>
                                        setData('reason', e.target.value)
                                    }
                                    error={!!errors.reason}
                                    helperText={errors.reason}
                                    multiline
                                    fullWidth
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
