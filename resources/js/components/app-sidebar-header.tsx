import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { generatedReport } from '@/routes';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { router } from '@inertiajs/react';
import { Badge, Box, IconButton, Popover, Typography } from '@mui/material';
import { Download } from 'lucide-react';
import { useState } from 'react';
export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleDownloads = () => {
        router.get(generatedReport());
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            {/* Left */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Right */}
            <div className="ml-auto">
                <IconButton onClick={handleDownloads} sx={{ m: 1 }}>
                    <Badge color="error">
                        <Download />
                    </Badge>
                </IconButton>
                {/* <IconButton onClick={handleOpen}>
                    <Badge color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton> */}

                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    slotProps={{
                        paper: {
                            sx: {
                                mt: 1, // theme spacing (8px)
                            },
                        },
                    }}
                >
                    <Box sx={{ width: 320, p: 2 }}>
                        <Typography fontWeight={600} mb={1}>
                            Under Maintenance
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    p: 1,
                                    borderRadius: 1,
                                    bgcolor: 'action.hover',
                                }}
                            >
                                ✔ Payment approved
                            </Box>
                            <Box
                                sx={{
                                    p: 1,
                                    borderRadius: 1,
                                    bgcolor: 'action.hover',
                                }}
                            >
                                ⚠ Check pending review
                            </Box>
                            <Box
                                sx={{
                                    p: 1,
                                    borderRadius: 1,
                                    bgcolor: 'action.hover',
                                }}
                            >
                                📄 New CV uploaded
                            </Box>
                        </Box>
                    </Box>
                </Popover>
            </div>
        </header>
    );
}
