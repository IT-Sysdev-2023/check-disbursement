import { assignPermissions, permissions } from '@/routes';
import { FlashReponse, Permission, User } from '@/types';
import {
    Alert,
    Button,
    SelectChangeEvent,
    Snackbar,
    SnackbarCloseReason,
} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PermissionSelection from './permissionSelection';
import { router } from '@inertiajs/react';

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

export default function UserModal({
    open,
    details,
    onClose,
}: {
    open: boolean;
    details: User;
    onClose: () => void;
}) {
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedPermission, setSelectedPermission] = useState<
        string[]
    >([]);
    const [permissionsList, setPermissionsList] = useState<Permission[]>(
        [],
    );

    useEffect(() => {
        const fetchPermissions = async () => {
            const { url, method } = permissions();
            const perm = await axios({
                url,
                method,
            });
            setPermissionsList(perm.data);
        };

        fetchPermissions();
    }, []);

    //Set Defaul User Permission to the UI
    useEffect(() => {
            setSelectedPermission(
                details?.company_permissions.map((p) => 
                     p.company.name
                ),
            );
        
    }, [details?.company_permissions]);

    const handleChange = (
        event: SelectChangeEvent<typeof selectedPermission>,
    ) => {
        const {
            target: { value },
        } = event;
        setSelectedPermission(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const onSave = () => {
        router.post(
            assignPermissions(),
            {
                selectedPermission,
                id: details?.id,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    setOpenSnackBar(true);
                    const m = page.props.flash as FlashReponse;
                    setMessage(m.message);
                },
            },
        );
    };
    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Assign Role/ Permission
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Name: {details?.name}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 3 }}>
                        Permissions
                    </Typography>

                    <PermissionSelection
                        permissions={permissionsList}
                        selectedPermission={selectedPermission}
                        handleChange={handleChange}
                    />
                    <Button variant="contained" onClick={onSave}>
                        Save
                    </Button>
                </Box>
            </Modal>
            <Snackbar
                open={openSnackBar}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}
