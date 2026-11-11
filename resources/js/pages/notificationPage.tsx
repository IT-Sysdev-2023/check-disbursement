import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { deleteNotification, readNotifications } from '@/routes';
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
    Pagination,
    Stack,
    Typography,
} from '@mui/material';

import { useState } from 'react';

interface NotificationItem {
    id: string;
    data: { title: string; message: string };
    read: boolean;
    created_at: string;
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    path: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notifications',
        href: '#',
    },
];

export default function NotificationPage({
    records,
    unreadCount,
}: {
    records: Paginated<NotificationItem>;
    unreadCount: number;
}) {
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [activeId, setActiveId] = useState<string | null>(null);

    const items = records.data;

    const markAsRead = (id: string) => {
        router.put(
            readNotifications(),
            {
                id: id,
                markAll: false,
            },
            { preserveScroll: true },
        );
    };

    const markAllAsRead = () => {
        router.put(
            readNotifications(),
            {
                markAll: true,
            },
            { preserveScroll: true },
        );
    };

    const removeNotification = (id: string) => {
        // If this is the last item on a page beyond the first,
        // go back one page after deleting so we don't land on an empty page.
        const goToPreviousPage =
            items.length === 1 && records.current_page > 1;

        router.delete(deleteNotification(id), {
            preserveScroll: true,
            onSuccess: () => {
                if (goToPreviousPage) {
                    router.get(
                        records.path,
                        { page: records.current_page - 1 },
                        { preserveScroll: true },
                    );
                }
            },
        });
        handleMenuClose();
    };

    const handlePageChange = (
        _: React.ChangeEvent<unknown>,
        page: number,
    ) => {
        router.get(
            records.path,
            { page },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['records', 'unreadCount'],
            },
        );
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
                    </Stack>

                    {items.length === 0 ? (
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
                            {items.map((notification, index) => (
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
                                                        {notification.data.title}
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
                                                            display: 'block',
                                                        }}
                                                    >
                                                        {
                                                            notification.data
                                                                .message
                                                        }
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.disabled"
                                                    >
                                                        {notification.created_at}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < items.length - 1 && (
                                        <Divider component="li" />
                                    )}
                                </Box>
                            ))}
                        </List>
                    )}

                    {records.last_page > 1 && (
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mt: 2 }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Showing {records.from}–{records.to} of{' '}
                                {records.total}
                            </Typography>
                            <Pagination
                                count={records.last_page}
                                page={records.current_page}
                                onChange={handlePageChange}
                                color="primary"
                                shape="rounded"
                            />
                        </Stack>
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