import { borrowedCheck } from '@/routes';
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

export default function BorrowedCheckModal({
    checkId,
    whichCheck,
    open,
    handleClose,
}: {
    checkId: number | undefined;
        open: boolean;
        whichCheck: string;
    handleClose: () => void;
}) {
    // const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, transform, reset } =
        useForm({
            name: '',
            reason: '',
        });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            id: checkId,
            check: whichCheck
        }));

        post(borrowedCheck().url, {
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
                        Borrower Info
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid
                            container
                            spacing={2}
                            sx={{ mb: 2, width: '100%', mt: 3 }}
                        >
                            <Grid size={{ xs: 12, sm: 12 }}>
                                <TextField
                                    type="text"
                                    value={data.name ?? ''}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    name="name"
                                    label="Borrower Name"
                                    error={!!errors.name}
                                    helperText={errors.name ?? ' '}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 12 }}>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Reason For Borrowing"
                                    onChange={(e) =>
                                        setData('reason', e.target.value)
                                    }
                                    error={!!errors.reason}
                                    helperText={errors.reason}
                                    multiline
                                    rows={4}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ textAlign: 'right', mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                //  disabled={processing}
                                loading={processing}
                            >
                                Save
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </>
    );
}
