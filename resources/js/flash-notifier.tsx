import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import useNotifications from './components/notifications/useNotifications';

export default function FlashNotifier() {
    const { flash } = usePage().props as {
        flash?: { message?: string; status?: boolean };
    };
    const notifications = useNotifications();
    useEffect(() => {
        if (!flash?.message) return;

        notifications.show(flash.message, {
            severity: flash.status ? 'success' : 'error',
            autoHideDuration: 3000,
        });
    }, [flash?.message, flash?.status]);

    return null;
}
