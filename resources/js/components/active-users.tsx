import { useEffect, useState } from 'react';
import { echo } from '@laravel/echo-react';
import { Users } from 'lucide-react';

type OnlineUser = {
    id: number;
    name: string;
};

export default function ActiveUsers() {
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

    useEffect(() => {
        const channel = echo().join('active-users');

        channel
            .here((users: OnlineUser[]) => {
                setOnlineUsers(users);
            })
            .joining((user: OnlineUser) => {
                setOnlineUsers((current) =>
                    current.some((u) => u.id === user.id)
                        ? current
                        : [...current, user],
                );
            })
            .leaving((user: OnlineUser) => {
                setOnlineUsers((current) =>
                    current.filter((u) => u.id !== user.id),
                );
            });

        return () => {
            echo().leave('active-users');
        };
    }, []);

    return (
        <div className="flex items-center gap-3 rounded-lg border p-4">
            <Users className="h-5 w-5 text-green-600" />

            <div>
                <p className="text-sm text-muted-foreground">
                    Active Users
                </p>
                <p className="text-2xl font-bold">
                    {onlineUsers.length}
                </p>
            </div>
        </div>
    );
}