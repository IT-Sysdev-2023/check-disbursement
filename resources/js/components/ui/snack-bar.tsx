import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function SnackBar({
    open,
  message,
    handleClose
}: {
        open: boolean
    message: string
    handleClose: () => void
}) {

  const internalClose  = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

     handleClose();
  };

  return (
      <Snackbar open={open} autoHideDuration={6000} onClose={internalClose }>
        <Alert
          onClose={internalClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
  );
}
