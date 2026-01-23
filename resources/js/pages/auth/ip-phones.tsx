import { Head } from '@inertiajs/react';
import { ImageIcon, WorkflowIcon } from 'lucide-react';

import AuthLayout from '@/layouts/auth-layout';
import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@mui/material';

export default function IpPhones() {
    return (
        <AuthLayout title="Contact us!" description="Ip Phones">
            <Head title="Register" />
            <List
                sx={{
                    width: '100%',
                    maxWidth: 360,
                    bgcolor: 'background.paper',
                }}
            >
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <ImageIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="1952" secondary="CD, BRS, CCM" />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <WorkflowIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Work" secondary="Jan 7, 2014" />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <WorkflowIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary="Vacation"
                        secondary="July 20, 2014"
                    />
                </ListItem>
            </List>
        </AuthLayout>
    );
}
