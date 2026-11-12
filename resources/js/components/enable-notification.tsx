
import { useEffect, useState } from 'react';
import { Alert, AlertTitle, Button } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SettingsIcon from '@mui/icons-material/Settings';

type PermissionStatus =
    | NotificationPermission
    | 'unsupported';

export default function EnableNotifications() {
    const [permission, setPermission] =
        useState<PermissionStatus>('default');

    useEffect(() => {
        if (!('Notification' in window) || !window.isSecureContext) {
            setPermission('unsupported');
            return;
        }

        const checkPermission = () => {
            setPermission(Notification.permission);
        };

        checkPermission();

        // Recheck when the user returns to the dashboard.
        window.addEventListener('focus', checkPermission);

        return () => {
            window.removeEventListener('focus', checkPermission);
        };
    }, []);

    const handleEnable = async () => {
        if (!('Notification' in window)) return;

        const result = await Notification.requestPermission();
        setPermission(result);
    };

    if (permission === 'granted' || permission === 'unsupported') {
        return null;
    }

    if (permission === 'denied') {
        return (
            <Alert
                severity="warning"
                icon={<SettingsIcon />}
            >
                <AlertTitle>Notifications are blocked</AlertTitle>
                Enable notifications for this website through
                your browser's site settings.
            </Alert>
        );
    }

    return (
        <Alert
            severity="info"
            icon={<NotificationsActiveIcon />}
            action={
                <Button
                    color="inherit"
                    size="small"
                    variant="outlined"
                    onClick={handleEnable}
                >
                    Enable Notifications
                </Button>
            }
        >
            <AlertTitle>Stay updated!</AlertTitle>
            Enable browser notifications to receive important
            updates even when you're not actively using the dashboard.
        </Alert>
    );
}
