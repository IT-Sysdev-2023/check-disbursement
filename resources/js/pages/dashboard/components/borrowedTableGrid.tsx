import { borrowedChecks, borrowedNumberCheques } from '@/routes';
import { Borrower, InertiaPagination } from '@/types';
import { router } from '@inertiajs/react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { TablePagination } from '@mui/material';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { ArrowBigRightDash } from 'lucide-react';
import { MouseEvent, useEffect, useState } from 'react';

function Row(props: { row: Borrower }) {
    const { row } = props;
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
    console.log(borrowerData);
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
                <TableCell align="center">
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleAction(row.borrowerNoClean)}
                    >
                        <ArrowBigRightDash />
                    </IconButton>
                </TableCell>
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
                                        <TableCell>Check Date</TableCell>
                                        <TableCell>Check Amount</TableCell>
                                        <TableCell>Company</TableCell>
                                        <TableCell>Payee</TableCell>
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

export default function BorrowedTableGrid({
    data,
}: {
    data: InertiaPagination<Borrower>;
}) {
    const [rowsPerPage, setRowsPerPage] = useState(data?.meta.per_page || 10);

    const handleChangePage = (
        _: MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        const page = newPage + 1;
        const per_page = data.meta.per_page;

        router.reload({
            data: {
                tab: 'borrowed',
                page: page,
                per_page: per_page,
            },
        });
    };

    const handleChangeRowsPerPage = (event) => {
        // setRowsPerPage(parseInt(event.target.value, 10));
        // setPage(0);
    };
    return (
        <>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Borrower Number</TableCell>
                            <TableCell align="right">Borrowed Date</TableCell>
                            <TableCell align="right">Borrower Name</TableCell>
                            <TableCell align="right">Reason</TableCell>
                            <TableCell align="right">
                                Borrower Details
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.data?.length ? (
                            data.data.map((row) => (
                                <Row key={row.borrowerNo} row={row} />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No records found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={data?.meta.total ?? 0}
                page={data?.meta.current_page - 1}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
        </>
    );
}
