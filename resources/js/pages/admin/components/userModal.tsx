import useNotifications from '@/components/notifications/useNotifications';
import { assignPermissions, permissions } from '@/routes';
import { FlashReponse, SelectionType, User } from '@/types';
import { router } from '@inertiajs/react';
import { Button, SelectChangeEvent } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useEffect, useState } from 'react';
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

type PermissionRoleType = {
    roles: SelectionType[];
    permissions: SelectionType[];
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
    const [selectedPermission, setSelectedPermission] = useState<string[]>([]);
    const [selectedRole, setSelectedRole] = useState<string[]>([]);
    const [permissionsList, setPermissionsList] = useState<PermissionRoleType>({
        roles: [],
        permissions: [],
    });

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
            details?.companyPermissions.map((p) => p.company.name),
        );
        setSelectedRole(
            details?.roles.map((p) => p.name),
        );
    }, [details?.companyPermissions, details?.roles]);

    const handleChange = (
        event: SelectChangeEvent<typeof selectedPermission>,
    ) => {
        const {
            target: { value },
        } = event;
        console.log(event);
        setSelectedPermission(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleChangeRole = (
        event: SelectChangeEvent<typeof selectedPermission>,
    ) => {
        const {
            target: { value },
        } = event;
        setSelectedRole(typeof value === 'string' ? value.split(',') : value);
    };
    const notifications = useNotifications();

    const onSave = () => {
        router.post(
            assignPermissions(),
            {
                selectedPermission,
                selectedRole,
                id: details?.id,
            },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const m = page.props.flash as FlashReponse;
                    if (m?.message) {
                        notifications.show(m.message, {
                            severity: m?.status ? 'success' : 'error',
                            autoHideDuration: 3000,
                        });
                    }
                    onClose();
                },
            },
        );
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
                        Assign Business Unit
                    </Typography>
                    <PermissionSelection
                        permissions={permissionsList.permissions}
                        selectedPermission={selectedPermission}
                        handleChange={handleChange}
                    />

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Assign Role
                    </Typography>
                    <PermissionSelection
                        permissions={permissionsList.roles}
                        selectedPermission={selectedRole}
                        handleChange={handleChangeRole}
                    />

                    <Button variant="contained" onClick={onSave} sx={{ mt: 3 }}>
                        Save
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}
