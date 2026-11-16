import { Box, Card, CardContent, Typography } from '@mui/material';
import { ReactNode } from 'react';

export default function SectionCard({
    title,
    color,
    icon,
    children,
    height = 520,
}: {
    title: string;
    color: string;
    icon?: ReactNode;
    children: ReactNode;
    height?: number;
}) {
    return (
        <Card sx={{ borderRadius: 2, height }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1,
                    bgcolor: color,
                    color: '#fff',
                    fontWeight: 600,
                }}
            >
                {icon}
                <Typography variant="subtitle2">{title}</Typography>
            </Box>

            <CardContent sx={{ overflowY: 'auto', height: height - 52 }}>
                {children}
            </CardContent>
        </Card>
    );
}
