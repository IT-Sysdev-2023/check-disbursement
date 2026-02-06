import { modalStyle } from '@/lib/modalStyle';
import { Box, Modal } from '@mui/material';


export default function PdfReader({ stream, open, handleClose }) {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ ...modalStyle, width: '70%' }}>
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
