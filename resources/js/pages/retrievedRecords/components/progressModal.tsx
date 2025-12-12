import { EventType, ProgressState } from '@/types';
import { useEcho } from '@laravel/echo-react';
import { Box, Grid, LinearProgress, Modal, Typography } from '@mui/material';
import { useState } from 'react';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

type ProgressState = {
    progress: number;
    buffer: number;
    message: string;
    currentIndex: number;
    totalFiles: number;
};
export default function ProgressModal({
    open,
    handleClose,
    userId,
}: {
    open: boolean;
    userId: number;
    handleClose: () => void;
}) {
    const [progress, setProgress] = useState<ProgressState>({
        progress: 0,
        buffer: 0,
        message: '',
        currentIndex: 0,
        totalFiles: 0,
    });

    useEcho(`scan-progress.${userId}`, 'ScanProgress', (e: EventType) => {
        const { percentage, message, currentIndex, totalFiles } = e;
        const buffer = percentage + 10 > 100 ? 100 : percentage + 10;

        setProgress({
            progress: percentage,
            buffer: buffer,
            message: message,
            currentIndex: currentIndex,
            totalFiles: totalFiles,
        });
    });

    return (
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Please wait
                </Typography>
                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 2, width: '100%', mt: 3 }}
                >
                    <Grid size={{ xs: 12, sm: 12 }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                {progress.message}
                            </Typography>
                            <LinearProgress
                                variant="buffer"
                                value={progress.progress}
                                valueBuffer={progress.buffer}
                            />
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {progress.progress}%
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 12 }}></Grid>
                </Grid>
                <Box sx={{ textAlign: 'right', mt: 2 }}>
                    <Typography variant="h5" color="text.secondary">
                        {progress.currentIndex}/{progress.totalFiles}
                    </Typography>
                    {/* <Button type="submit" variant="contained" size="large">
                        Minimize
                    </Button> */}
                </Box>
            </Box>
        </Modal>
    );
}
