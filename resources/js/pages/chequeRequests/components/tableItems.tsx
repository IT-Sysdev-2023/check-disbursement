import { borrowedChecks, borrowedNumberCheques } from "@/routes";
import { Borrower } from "@/types";
import { router } from "@inertiajs/react";
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { ArrowBigRightDash } from 'lucide-react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function TableItems(props: { row: Borrower, isVisible: boolean}) {
    const { row, isVisible } = props;
    
    const [open, setOpen] = useState(false);
    const [borrowerData, setBorrowerData] = useState<Record<string, any[]>>({});

    useEffect(() => {
        if (open) {
            const fetchBorrower = async () => {
                const { data } = await axios.get(borrowedChecks().url, {
                    params: {
                        borrowerNo: row.borrowerNoClean,
                        check: row.check,
                    },
                });
                setBorrowerData((prev) => ({
                    ...prev,
                    [row.borrowerNoClean]: data,
                }));
            };

            fetchBorrower();
        }
    }, [open, row.borrowerNoClean, row.check]);

    const handleAction = async (borrowedNo: number) => {
        router.visit(borrowedNumberCheques(borrowedNo));
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
                    {row.borrowerNo}
                </TableCell>
                <TableCell align="right">{row.lastBorrowedAt}</TableCell>
                <TableCell align="right">{row.borrower}</TableCell>
                <TableCell align="right">{row.reason}</TableCell>
                {isVisible && <TableCell align="center">
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleAction(row.borrowerNoClean)}
                    >
                        <ArrowBigRightDash />
                    </IconButton>
                </TableCell>}
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
                                Checks
                            </Typography>

                            <Table size="small" aria-label="cv">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Check Number</TableCell>
                                        <TableCell>Check Date</TableCell>
                                        <TableCell>Check Amount</TableCell>
                                        <TableCell>Bu</TableCell>
                                        <TableCell>Payee</TableCell>
                                        <TableCell>Tagged Location</TableCell>
                                        <TableCell>Check Type</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {borrowerData[row.borrowerNoClean]?.map(
                                        (historyRow) => (
                                            <TableRow key={historyRow.id}>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {
                                                        historyRow.checkable
                                                            .checkNumber
                                                    }
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {
                                                        historyRow.checkable
                                                            .checkDate
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
                                                    {historyRow.checkable.location}
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
        </>
    );
}