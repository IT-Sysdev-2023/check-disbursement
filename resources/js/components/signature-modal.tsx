
import { modalMediumStyle } from '@/lib/modalStyle';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CameraCapture from '@/pages/chequeReleasing/cameraCapture';


export default function SignatureModal({open, handleClose, onCapture}: {open: boolean, handleClose: () => void; onCapture: (image: string) => void;}) {
   
  
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={
                        modalMediumStyle && {
                            ...modalMediumStyle,
                            width: { xs: '95%', sm: '80%', md: 700 },
                            maxWidth: 900,
                        }
                    }
                >
                    <CameraCapture onCapture={onCapture}/>
                </Box>
            </Modal>
        </>
    );
}
