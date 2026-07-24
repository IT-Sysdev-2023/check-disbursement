import { usePage } from '@inertiajs/react';
import { useEchoNotification } from '@laravel/echo-react';
import { SharedData } from './types';
import { showNotification } from './components/notification';

type NotificationType ={
    id: string,
    message: string,
    title: string,
    type: string
}
export default function NotificationListener() {
    const { auth } = usePage<SharedData>().props;

    useEchoNotification(`App.Models.User.${auth.user.id}`, (notification: NotificationType) => {
        showNotification(notification.title, notification.message);
    });

    return null;
}
