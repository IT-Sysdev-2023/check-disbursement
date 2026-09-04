import ReleasingModalAll from '@/components/releasing-modal_all';
import { chequesToRelease, releaseCheque } from '@/routes';
import { Option } from '@/types';
import { router } from '@inertiajs/react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
    Box,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { ListChecks, Send } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ChequeReleasingBatch(props: {
    row: any;
    isVisible: boolean;
    receiverNames: Option[];
}) {
    const { row, isVisible, receiverNames } = props;
    const [selectedCheques, setSelectedCheques] = useState('');
    const [open, setOpen] = useState(false);
    const [borrowerData, setBorrowerData] = useState<Record<string, any[]>>({});
    const [openReleasing, setOpenReleasing] = useState(false);

    useEffect(() => {
        if (open) {
            const fetchBorrower = async () => {
                const { data } = await axios.get(chequesToRelease().url, {
                    params: {
                        batchReference: row.batch_reference,
                    },
                });
                setBorrowerData((prev) => ({
                    ...prev,
                    [row.batch_reference]: data,
                }));
            };

            fetchBorrower();
        }
    }, [open, row.batch_reference]);

    const releaseAll = async (batchReference: string) => {
        // const selectedItems = selectedRows.map((item) => ({
        //     id: item.borrowedChequeId,
        //     status:
        //         item.status == 'Manila' || item.status == 'Cebu'
        //             ? 'Forward'
        //             : item.status == 'Deposit'
        //               ? 'Deposit'
        //               : 'Release',
        // }));
        
        setSelectedCheques(batchReference);
        setOpenReleasing(true);
    };

    const selectToRelease = async (batchReference: string) => {
        router.visit(releaseCheque(batchReference));
    };
    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.batch_reference}
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.cheque_count}
                </TableCell>
                {isVisible && (
                    <TableCell align="center">
                        <IconButton
                            size="small"
                            color="success"
                            sx={{ mx: 0.5 }}
                            onClick={() => releaseAll(row.batch_reference)}
                            title="Release All"
                        >
                            <Send size={18} />
                        </IconButton>

                        <IconButton
                            size="small"
                            color="primary"
                            sx={{ mx: 0.5 }}
                            onClick={() => selectToRelease(row.batch_reference)}
                            title="Select to Release"
                        >
                            <ListChecks size={18} />
                        </IconButton>
                    </TableCell>
                )}
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={7}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                            >
                                Cheques
                            </Typography>

                            <Table size="small" aria-label="cv">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Cheque Number</TableCell>
                                        <TableCell>Cheque Date</TableCell>
                                        <TableCell>Cheque Amount</TableCell>
                                        <TableCell>Business Unit</TableCell>
                                        <TableCell>Payee</TableCell>
                                        <TableCell>Tagged Location</TableCell>
                                        <TableCell>Cheque Type</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {borrowerData[row.batch_reference]?.map(
                                        (historyRow) => (
                                            <TableRow key={historyRow.id}>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {
                                                        historyRow.checkable
                                                            .chequeNumber
                                                    }
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {
                                                        historyRow.checkable
                                                            .chequeDate
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        historyRow.checkable
                                                            .amount
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        historyRow.checkable
                                                            .company
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {historyRow.checkable.payee}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        historyRow.checkable
                                                            .location
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {historyRow.check}
                                                </TableCell>
                                            </TableRow>
                                        ),
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <ReleasingModalAll
                cheques={selectedCheques}
                receiverNames={receiverNames}
                open={openReleasing}
                handleClose={() => {
                    setOpenReleasing(false);
                }}
            />
        </>
    );
}
