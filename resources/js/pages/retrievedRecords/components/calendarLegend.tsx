import { Box, Stack, Typography } from '@mui/material';

export default function CalendarLegend({ color, label }: {color: string, label:string}) {
    return (
        <Stack direction="row" spacing={0.5} alignItems="center">
            <Box
                sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: color,
                    flexShrink: 0, // prevents shrinking
                }}
            />
            <Typography variant="caption" sx={{ lineHeight: 1 }}>
                {label}
            </Typography>
        </Stack>
    );
}
