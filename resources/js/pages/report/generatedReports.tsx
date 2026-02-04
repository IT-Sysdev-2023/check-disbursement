import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { downloadReport } from '@/routes';
import { BreadcrumbItem, FileReport } from '@/types';
import { Head } from '@inertiajs/react';
import { IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from 'lucide-react';
import * as React from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Report',
        href: '#',
    },
];
export default function generatedReports({ files }: { files: FileReport[] }) {
    const downloadFile = (file: string) => {
        window.location.href = downloadReport().url + `?file=${file}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Report" />
            <PageContainer title="Generated Reports">
                <List
                    sx={{
                        width: '100%',
                        bgcolor: 'background.paper',
                        p: 2,
                    }}
                >
                    {files.length === 0 ? (
                        <ListItem>
                            <ListItemText
                                primary="No Data"
                                primaryTypographyProps={{
                                    align: 'center',
                                    color: 'text.secondary',
                                }}
                            />
                        </ListItem>
                    ) : (
                        files.map((item, index) => (
                            <React.Fragment key={index}>
                                <ListItem
                                    alignItems="flex-start"
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="download"
                                            onClick={() =>
                                                downloadFile(item.file)
                                            }
                                        >
                                            <DownloadIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            alt={item.extension}
                                            src={`/icons/excel.png`}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={item.filename}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    sx={{
                                                        color: 'text.primary',
                                                        display: 'inline',
                                                    }}
                                                >
                                                    {item.extension + ' -'}
                                                </Typography>
                                                {' ' + item.last_modified}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                                {index < 2 && (
                                    <Divider variant="inset" component="li" />
                                )}
                            </React.Fragment>
                        ))
                    )}
                </List>
            </PageContainer>
        </AppLayout>
    );
}
