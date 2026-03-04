import AppLayout from '@/layouts/app-layout';
import { assignPermissions, permissions, users } from '@/routes';
import { BreadcrumbItem, SelectionType, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button, SelectChangeEvent } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PermissionSelection from './components/permissionSelection';

const breadcrumbs: BreadcrumbItem[] = [
     {
        title: 'Assign User',
        href: users().url,
    },
    {
        title: 'Assign User',
        href: '#',
    },
];

type PermissionRoleType = {
    roles: SelectionType[];
    permissions: SelectionType[];
    accessPermission: SelectionType[];
};

export default function AssignUser({ user }: { user: { data: User } }) {
    const [selectedPermission, setSelectedPermission] = useState<string[]>([]);
    const [selectedRole, setSelectedRole] = useState<string[]>([]);
    const [selectedAccessPermission, setSelectedAccessPermission] = useState<
        string[]
    >([]);
    const [permissionsList, setPermissionsList] = useState<PermissionRoleType>({
        roles: [],
        permissions: [],
        accessPermission: [],
    });

    const details = user.data;
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
        setSelectedRole(details?.roles.map((p) => p.name));
        setSelectedAccessPermission(details?.permissions.map((p) => p.name));
    }, [details?.companyPermissions, details?.roles, details?.permissions]);

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

    const handleChangeRole = (
        event: SelectChangeEvent<typeof selectedPermission>,
    ) => {
        const {
            target: { value },
        } = event;
        setSelectedRole(typeof value === 'string' ? value.split(',') : value);
    };

    const handleChangeAccessPermission = (
        event: SelectChangeEvent<typeof selectedAccessPermission>,
    ) => {
        const {
            target: { value },
        } = event;
        setSelectedAccessPermission(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const onSave = () => {
        router.post(
            assignPermissions(),
            {
                selectedPermission,
                selectedRole,
                selectedAccessPermission,
                id: details?.id,
            },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Register" />

            <Box sx={{ py: 6,px: 20}}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
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

                {selectedRole?.includes('regional_officer') && (
                    <>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Assign Region
                        </Typography>
                        <PermissionSelection
                            permissions={permissionsList.accessPermission}
                            selectedPermission={selectedAccessPermission}
                            handleChange={handleChangeAccessPermission}
                        />
                    </>
                )}

                <Button variant="contained" onClick={onSave} sx={{ mt: 3 }}>
                    Save
                </Button>
            </Box>
        </AppLayout>
    );
}
