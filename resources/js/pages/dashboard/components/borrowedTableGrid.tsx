import { approveCheck, approverNames, borrowedChecks } from '@/routes';
import { BorrowerName, InertiaPagination } from '@/types';
import { router } from '@inertiajs/react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button, Grid, Modal } from '@mui/material';
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
import * as React from 'react';
import SelectItem from './SelectItem';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function Row(props: { row: BorrowerName }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const [borrowerData, setBorrowerData] = React.useState<
        Record<string, any[]>
    >({});

    const [approver, setApprover] = React.useState<
        { label: string; value: string }[]
    >([]);

    const [openModal, setOpenModal] = React.useState(false);
    const [selectedApprover, setSelectedApprover] = React.useState('');
    const [borrowedId, setBorrowedId] = React.useState<number | null>(null);

    React.useEffect(() => {
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
                // setBorrowerSelection(data);
            };

            fetchBorrower();
        }
    }, [open, row.borrowerNoClean, row.check]);

    const handleAction = async (borrowedNo: number) => {
        setBorrowedId(borrowedNo);
        const { data } = await axios.get(approverNames().url);
        setApprover(data);
        setOpenModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!borrowedId) return;
        router.put(approveCheck(), {
            approver: selectedApprover,
            borrowedNo: borrowedId,
        }, {
            onError: (e) => {
                console.log(e);
            },
            onSuccess: (e) => {
                console.log(e);
                setOpenModal(false);
            }
        });
    };

    return (
        <React.Fragment>
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
                <TableCell align="right">{row.borrowerName}</TableCell>
                <TableCell align="right">{row.reason}</TableCell>
                <TableCell align="right">{'For Signature'}</TableCell>
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
                    colSpan={6}
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
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Check Date</TableCell>
                                        <TableCell>Check Amount</TableCell>
                                        <TableCell align="right">
                                            Company
                                        </TableCell>
                                        <TableCell align="right">
                                            Payee
                                        </TableCell>
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
                                                    {historyRow.date}
                                                </TableCell>
                                                <TableCell>
                                                    {historyRow.check_amount}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {historyRow.company_name}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {historyRow.payee}
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
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Approver Name
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Grid
                            container
                            spacing={2}
                            sx={{ mb: 2, width: '100%', mt: 3 }}
                        >
                            <Grid size={{ xs: 12, sm: 12 }}>
                                <SelectItem
                                    handleChange={(event) =>
                                        setSelectedApprover(event.target.value)
                                    }
                                    value={selectedApprover}
                                    title="Select Approver"
                                    items={approver}
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
        </React.Fragment>
    );
}

export default function BorrowedTableGrid({
    data,
}: {
    data: InertiaPagination<BorrowerName>;
}) {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Borrower Number</TableCell>
                        <TableCell align="right">Borrowed Date</TableCell>
                        <TableCell align="right">Borrower Name</TableCell>
                        <TableCell align="right">Reason</TableCell>
                        <TableCell align="right">Purpose</TableCell>
                        <TableCell align="right">Borrower Details</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.data.map((row) => (
                        <Row key={row.borrowerNo} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
