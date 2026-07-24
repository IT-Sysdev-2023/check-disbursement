import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { readNotifications } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import {
    Circle as CircleIcon,
    DoneAll as DoneAllIcon,
    Info as InfoIcon,
    MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    Typography,
} from '@mui/material';

import { useState } from 'react';

// type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notifications',
        href: '#',
    },
];

// const typeConfig: Record<
//     NotificationType,
//     { icon: React.ReactNode; color: string }
// > = {
//     info: { icon: <InfoIcon />, color: '#0288d1' },
//     success: { icon: <CheckCircleIcon />, color: '#2e7d32' },
//     warning: { icon: <WarningIcon />, color: '#ed6c02' },
//     error: { icon: <ErrorIcon />, color: '#d32f2f' },
// };

const initialNotifications: NotificationItem[] = [
    {
        id: '1',
        title: 'Payment received',
        message: 'Your invoice #1042 has been paid in full.',
        time: '5 minutes ago',
        read: false,
    },
    {
        id: '2',
        title: 'New comment',
        message: 'Sarah left a comment on your project "Website Redesign".',
        time: '1 hour ago',
        read: false,
    },
    {
        id: '3',
        title: 'Storage almost full',
        message: 'You are using 92% of your available storage space.',
        time: '3 hours ago',
        read: true,
    },
    {
        id: '4',
        title: 'Sync failed',
        message: 'We could not sync your latest changes. Please try again.',
        time: 'Yesterday',
        read: true,
    },
    {
        id: '5',
        title: 'New team member',
        message: 'Alex Johnson has joined your workspace.',
        time: '2 days ago',
        read: true,
    },
];

export default function NotificationPage({ auth, records }) {
    const [notifications, setNotifications] =
        useState<NotificationItem[]>(initialNotifications);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    
  

    const unreadCount = records.filter((n) => !n.read).length;

    const markAsRead = (id: string) => {
        router.put(readNotifications(), {
            id: id,
            markAll: false
        });
    };

    const markAllAsRead = () => {
        router.put(readNotifications(), {
            markAll: true
        });
    };


    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setMenuAnchor(null);
    };

    const handleMenuOpen = (
        event: React.MouseEvent<HTMLElement>,
        id: string,
    ) => {
        setMenuAnchor(event.currentTarget);
        setActiveId(id);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setActiveId(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <PageContainer title="Notifications">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2 }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="h6">Recent</Typography>
                            {unreadCount > 0 && (
                                <Chip
                                    label={`${unreadCount} unread`}
                                    size="small"
                                    color="primary"
                                />
                            )}
                        </Stack>
                        <Button
                            size="small"
                            startIcon={<DoneAllIcon />}
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                        >
                            Mark all as read
                        </Button>
                        {/* <Button
                            size="small"
                            startIcon={<DoneAllIcon />}
                            onClick={notification}
                            disabled={unreadCount === 0}
                        >
                            Check Notification
                        </Button> */}
                    </Stack>

                    {records.length === 0 ? (
                        <Box sx={{ py: 8, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                You're all caught up. No notifications.
                            </Typography>
                        </Box>
                    ) : (
                        <List
                            sx={{
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                            }}
                        >
                            {records.map((notification, index) => {
                                return (
                                    <Box key={notification.id}>
                                        <ListItem
                                            alignItems="flex-start"
                                            sx={{
                                                bgcolor: notification.read
                                                    ? 'transparent'
                                                    : 'action.hover',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    bgcolor: 'action.selected',
                                                },
                                            }}
                                            onClick={
                                                notification.read
                                                    ? undefined
                                                    : () =>
                                                          markAsRead(
                                                              notification.id,
                                                          )
                                            }
                                            secondaryAction={
                                                <IconButton
                                                    edge="end"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMenuOpen(
                                                            e,
                                                            notification.id,
                                                        );
                                                    }}
                                                >
                                                    <MoreVertIcon fontSize="small" />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: `#0288d120`,
                                                        color: `#0288d1`,
                                                    }}
                                                >
                                                    <InfoIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                        spacing={1}
                                                    >
                                                        <Typography
                                                            variant="subtitle2"
                                                            fontWeight={
                                                                notification.read
                                                                    ? 400
                                                                    : 600
                                                            }
                                                        >
                                                            {
                                                                notification
                                                                    .data.title
                                                            }
                                                        </Typography>
                                                        {!notification.read && (
                                                            <CircleIcon
                                                                sx={{
                                                                    fontSize: 8,
                                                                    color: 'primary.dark',
                                                                }}
                                                            />
                                                        )}
                                                    </Stack>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            component="span"
                                                            sx={{
                                                                display:
                                                                    'block',
                                                            }}
                                                        >
                                                            {
                                                                notification
                                                                    .data
                                                                    .message
                                                            }
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.disabled"
                                                        >
                                                            {notification.time}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                        {index < records.length - 1 && (
                                            <Divider component="li" />
                                        )}
                                    </Box>
                                );
                            })}
                        </List>
                    )}

                    <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem
                            onClick={() => {
                                if (activeId) markAsRead(activeId);
                                handleMenuClose();
                            }}
                        >
                            Mark as read
                        </MenuItem>
                        <MenuItem
                            onClick={() =>
                                activeId && removeNotification(activeId)
                            }
                        >
                            Remove
                        </MenuItem>
                    </Menu>
                </Box>
            </PageContainer>
        </AppLayout>
    );
}
