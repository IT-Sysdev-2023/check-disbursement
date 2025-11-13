import { assignPermissions, permissions } from '@/routes';
import { RolePermission, User } from '@/types';
import { Button, SelectChangeEvent } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import PermissionSelection from './permissionSelection';

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
    details: User | undefined;
    onClose: () => void;
}) {
    const [selectedPermission, setSelectedPermission] = useState<string[]>([]);
    const [permissionsList, setPermissionsList] = useState<RolePermission[]>(
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

    useEffect(() => {
        if (details?.permissions?.length) {
            setSelectedPermission(details?.permissions.map((p) => p.name));
        }
    }, [details?.permissions]);

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
        router.post(assignPermissions(), {
            selectedPermission
        })
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
        </div>
    );
}
