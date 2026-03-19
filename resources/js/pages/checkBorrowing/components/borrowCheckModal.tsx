import AutocompleteUser from '@/components/autocomplete-user';
import { modalStyle } from '@/lib/modalStyle';
import SelectItem from '@/pages/dashboard/components/SelectItem';
import { secondaryBorrowCheck } from '@/routes';
import { Option } from '@/types';
import { useForm } from '@inertiajs/react';
import { Grid, SelectChangeEvent, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { SyntheticEvent } from 'react';

const itemBorrowed = [
    {
        value: 'Checks & Docs',
        label: 'Checks & Docs',
    },
    {
        value: 'Check',
        label: 'Check',
    },
    {
        value: 'Docs',
        label: 'Docs',
    },
];
export default function BorrowCheckModal({
    cheque,
    open,
    handleClose,
    type,
}: {
    cheque: (string | number)[];
    type: 'include' | 'exclude';
    open: boolean;
    handleClose: () => void;
}) {
    const { data, setData, put, processing, transform, errors, reset } =
        useForm({
            borrower: '',
            item: '',
            reason: '',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            cheques: cheque,
            type: type,
        }));
        put(secondaryBorrowCheck().url, {
            preserveScroll: true,
            preserveState: true,
            onError: (e) => {
                console.log(e);
            },
            onSuccess: () => {
                reset();
                handleClose();
            }
        });
    };

    const handleChangeItem = (event: SelectChangeEvent) => {
        setData('item', event.target.value);
    };
    const handleTextChange = (_: SyntheticEvent, name: Option) => {
        setData('borrower', name.label);
    };
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
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
                            <AutocompleteUser
                                label='Boroowers Name'
                                handleTextChange={handleTextChange}
                            />

                            <Grid size={{ xs: 12, sm: 12 }}>
                                <SelectItem
                                    handleChange={handleChangeItem}
                                    value={data.item}
                                    title="Item Borrowed"
                                    items={itemBorrowed}
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
                                loading={processing}
                            >
                                Save
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
            {/* <a-modal v-model:open="openModalReprint" style="width: 70%;">
        <iframe :src="stream" frameborder="0" style="width: 100%; height: 500px;"></iframe>
    </a-modal> */}
        </>
    );
}
