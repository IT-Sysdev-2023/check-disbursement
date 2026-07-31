import { ListSelectedChequeTaggingType, ListSelectedChequeType } from '@/types';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Check, X } from 'lucide-react';
import React from 'react';

export default function SelectedChequeList({
    records,
    handleDelete,
}: {
    records: ListSelectedChequeType[] | ListSelectedChequeTaggingType[];
    handleDelete: (id: number) => void;
}) {
    return (
        <Paper elevation={2} sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ px: 2, pt: 1 }}>
                Selected Cheques
            </Typography>

            {records.length === 0 ? (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ p: 2 }}
                >
                    No cheques to display.
                </Typography>
            ) : (
                <List>
                    {records.map((cheque, index) => (
                        <React.Fragment key={cheque.id}>
                            <ListItem
                                sx={{
                                    bgcolor: cheque.releasable
                                        ? 'success.50'
                                        : 'error.50',
                                    borderLeft: 4,
                                    borderColor: cheque.releasable
                                        ? 'success.main'
                                        : 'error.main',
                                    borderRadius: 1,
                                    mb: 0.5,
                                }}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleDelete(cheque.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemText
                                    primary={
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            gap={1}
                                        >
                                            <Typography variant="body1">
                                                {`Cheque #${cheque.chequeNo} — ${cheque.chequeDate}`}
                                            </Typography>

                                            {cheque.releasable ? (
                                               <Check color="#2e7d32" size={18} />
                                            ) : (
                                                 <X color="#d32f2f" size={18} />
                                            )}
                                        </Box>
                                    }
                                    secondary={`${cheque.amount} • ${cheque.status}`}
                                />
                            </ListItem>
                            {index < records.length - 1 && (
                                <Divider component="li" />
                            )}
                        </React.Fragment>
                    ))}
                </List>
            )}
        </Paper>
    );
}
