import Box from '@mui/material/Box';
import CircularProgress, {
    CircularProgressProps,
} from '@mui/material/CircularProgress';

export default function CircularProgressDashboard({
    title,
    value,
    color = 'primary',
}: {
    title: string;
    value: number;
    color?: CircularProgressProps['color'];
}) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
            }}
        >
            {/* Title */}
            <Box
                sx={{
                    fontSize: '16px',
                    fontWeight: 600,
                    mb: 3,
                }}
            >
                {title}
            </Box>

            {/* Progress */}
            <Box
                sx={{
                    position: 'relative',
                    display: 'inline-flex',
                }}
            >
                {/* Gray background */}
                <CircularProgress
                    variant="determinate"
                    value={100}
                    size={150}
                    thickness={4}
                    sx={{
                        color: 'grey.100',
                    }}
                />

                {/* Colored progress */}
                <CircularProgress
                    variant="determinate"
                    value={value}
                    size={150}
                    thickness={4}
                    color={color}
                    sx={{
                        position: 'absolute',
                        left: 0,
                    }}
                />

                {/* Percentage */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        fontWeight: 600,
                    }}
                >
                    {value}%
                </Box>
            </Box>
        </Box>
    );
}
