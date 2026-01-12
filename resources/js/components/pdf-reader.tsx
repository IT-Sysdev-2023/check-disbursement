import { Box, Modal } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function PdfReader({ stream, open, handleClose }) {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ ...style, width: '70%' }}>
                {stream && (
                    <iframe
                        src={stream}
                        style={{ width: '100%', height: '500px' }}
                        frameBorder={0}
                    />
                )}
            </Box>
        </Modal>
    );
}
