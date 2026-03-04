import AutocompleteUser from '@/components/autocomplete-user';
import { modalStyle } from '@/lib/modalStyle';
import { storeUser } from '@/routes';
import { Option } from '@/types';
import { useForm } from '@inertiajs/react';
import {
    Button,
    Grid,
    TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { SyntheticEvent } from 'react';


export default function AddUserModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.password !== data.password_confirmation) {
            alert('Passwords do not match');
            return;
        }
        post(storeUser().url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleTextChange = (_: SyntheticEvent, name: Option) => {
        setData('name', name.label);
    };
    return (
        <div>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Add User
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Grid
                            container
                            spacing={2}
                            sx={{ mb: 2, width: '100%', mt: 3 }}
                        >
                            <Grid size={{ xs: 12, sm: 12 }}>
                                <AutocompleteUser handleTextChange={handleTextChange}/>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 12 }}>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Username"
                                    value={data.username}
                                    onChange={(e) =>
                                        setData('username', e.target.value)
                                    }
                                    error={!!errors.username}
                                    helperText={errors.username}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Confirm Password"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    error={!!errors.password_confirmation}
                                    helperText={errors.password_confirmation}
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
        </div>
    );
}
