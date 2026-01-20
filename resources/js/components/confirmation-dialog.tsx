import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

export default function ConfirmationDialog({
    open,
    onClose,
    onOk,
    title,
    description,
}: {
    open: boolean;
    onClose: () => void;
    onOk: () => void;
    title: string;
    description: string;
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onOk} autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}
