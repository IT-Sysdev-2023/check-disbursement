import SelectItem from '@/pages/dashboard/components/SelectItem';
import { borrowCheck, borrowerNames } from '@/routes';
import { FlashReponse, SelectionModelType, SelectionType } from '@/types';
import { useForm } from '@inertiajs/react';
import { Grid, SelectChangeEvent, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { useEffect, useState } from 'react';

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
    // bu,
    handleClose,
}: {
    checkId: SelectionModelType;
    open: boolean;
    whichCheck: string;
    // bu: string;
    handleClose: () => void;
}) {
    const [borrowerSelection, setBorrowerSelection] = useState<SelectionType[]>(
        [],
    );

    // const [borrower, setBorrower] = useState('');

    const { data, setData, post, processing, errors, transform, reset } =
        useForm({
            name: '',
            reason: '',
        });

    const [stream, setStream] = useState('');
    const [openModalPdf, setOpenModalPdf] = useState(false);

    useEffect(() => {
        const fetchBorrower = async () => {
            const { data } = await axios.get(borrowerNames().url);
            setBorrowerSelection(data);
        };

        fetchBorrower();
    }, []);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            type: checkId.type,
            ids: Array.from(checkId.ids), // convert Set to array
            check: whichCheck,
        }));

        post(borrowCheck().url, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                const m = page.props.flash as FlashReponse;

                reset();
                handleClose();

                if (m.status) {
                    setStream(m.stream);
                    setOpenModalPdf(true);
                }
            },
            onError: (e) => {
                console.log(e);
            },
        });
    };

    const handleChange = (event: SelectChangeEvent) => {
        setData('name', event.target.value);
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
                    {/* <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Business Unit: {bu}
                    </Typography> */}

                    <form onSubmit={handleSubmit}>
                        <Grid
                            container
                            spacing={2}
                            sx={{ mb: 2, width: '100%', mt: 3 }}
                        >
                            <Grid size={{ xs: 12, sm: 12 }}>
                                {/* <TextField
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
                                /> */}
                                <SelectItem
                                    handleChange={handleChange}
                                    value={data.name}
                                    title="Borrower Name"
                                    items={borrowerSelection}
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

            <Modal open={openModalPdf} onClose={() => setOpenModalPdf(false)}>
                <Box sx={{ ...style, width: '70%' }}>
                    {stream && (
                        <iframe
                            src={stream}
                            style={{ width: '100%', height: '500px' }}
                            frameBorder={0}
                        />
                    )}
                </Box>
            </Modal>
            {/* <a-modal v-model:open="openModalReprint" style="width: 70%;">
        <iframe :src="stream" frameborder="0" style="width: 100%; height: 500px;"></iframe>
    </a-modal> */}
        </>
    );
}
