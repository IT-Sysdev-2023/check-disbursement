import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    ImageList,
    ImageListItem,
    Typography,
} from '@mui/material';
import { ShieldCloseIcon } from 'lucide-react';

export default function ImageViewing({
    open,
    handleClose,
    images,
    title = 'Scanned Documents',
}: {
    title: string;
    open: boolean;
    handleClose: () => void;
    images: string[];
}) {
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                {title}
                <IconButton
                    onClick={handleClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <ShieldCloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {images.length > 0 ? (
                    <ImageList variant="masonry" cols={3} gap={16}>
                        {images.map((image, index) => (
                            <ImageListItem key={image}>
                                <Box
                                    component="img"
                                    src={image}
                                    alt={`Document ${index + 1}`}
                                    sx={{
                                        width: '100%',
                                        display: 'block',
                                        borderRadius: 1,
                                        cursor: 'pointer',
                                        transition: '0.2s',
                                        '&:hover': {
                                            opacity: 0.8,
                                            transform: 'scale(1.01)',
                                        },
                                    }}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                ) : (
                    <Box
                        sx={{
                            minHeight: 300,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography color="text.secondary">
                            No Documents
                        </Typography>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}
