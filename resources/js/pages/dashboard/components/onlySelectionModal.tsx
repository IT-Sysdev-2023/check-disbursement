import { SelectionType } from '@/types';
import {
    Box,
    Button,
    Grid,
    Modal,
    SelectChangeEvent,
    Typography,
} from '@mui/material';
import SelectItem from './SelectItem';
import { modalStyle } from '@/lib/modalStyle';

export default function ({
    title,
    open,
    onClose,
    handleSubmit,
    handleSelectedItem,
    selectedItem,
    item,
}: {
    title: string;
    open: boolean;
    onClose: () => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleSelectedItem: (value: SelectChangeEvent) => void;
    selectedItem: string;
    item: SelectionType[];
}) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {title}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid
                        container
                        spacing={2}
                        sx={{ mb: 2, width: '100%', mt: 3 }}
                    >
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <SelectItem
                                handleChange={handleSelectedItem}
                                value={selectedItem}
                                title="Select"
                                items={item}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ textAlign: 'right', mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            //  disabled={processing}
                        >
                            Save
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
}
