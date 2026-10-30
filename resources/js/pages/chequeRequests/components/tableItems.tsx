import AutocompleteUser from '@/components/autocomplete-user';
import OnlySelectionModal from '@/pages/dashboard/components/onlySelectionModal';
import {
    borrowedChecks,
    borrowedNumberCheques,
    changeApprover,
    getApprovers,
} from '@/routes';
import { Borrower, Option } from '@/types';
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
import { ArrowBigRightDash, Pencil } from 'lucide-react';
import { FormEvent, SyntheticEvent, useEffect, useState } from 'react';

export default function TableItems(props: {
    row: Borrower;
    isVisible: boolean;
}) {
    const { row, isVisible } = props;

    const [open, setOpen] = useState(false);
    const [borrowerData, setBorrowerData] = useState<Record<string, any[]>>({});
    const [openEdit, setOpenEdit] = useState(false);
    const [borrower, setBorrower] = useState(row.borrower);
    const [approvers, setApprovers] = useState<
        { label: string; value: string }[]
    >([]);

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

    const handleEdit = async () => {
        const { data } = await axios.get(getApprovers().url);
        setApprovers(data);
        setOpenEdit(true);
    };

    const handleAction = async (borrowedNo: number) => {
        router.visit(borrowedNumberCheques(borrowedNo));
    };

    const [selectedApprover, setSelectedApprover] = useState(row.approver.id);

    const handleTagSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.put(
            changeApprover(),
            {
                borrower: borrower,
                approver: selectedApprover,
                borrowerNo: row.borrowerNoClean,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setOpenEdit(false);
                },
            },
        );
    };

    const handleTextChange = (_: SyntheticEvent, name: Option) => {
        setBorrower(name.label);
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
                <TableCell align="right">{row.approver.name}</TableCell>
                <TableCell align="right">{row.reason}</TableCell>
                {isVisible && (
                    <TableCell align="center">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleAction(row.borrowerNoClean)}
                        >
                            <ArrowBigRightDash />
                        </IconButton>

                        <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleEdit()}
                            title="Edit"
                        >
                            <Pencil size={18} />
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
                                    {borrowerData[row.borrowerNoClean]?.map(
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

            <OnlySelectionModal
                title="Change Approver & Borrower"
                open={openEdit}
                onClose={() => {
                    setOpenEdit(false);
                }}
                handleSubmit={handleTagSubmit}
                handleSelectedItem={(event) =>
                    setSelectedApprover(event.target.value)
                }
                selectedItem={selectedApprover}
                item={approvers}
                // loading={tagLoading}
            >
                <AutocompleteUser
                    label="Assign Laison"
                    defaultField={borrower}
                    sxWidth={'100%'}
                    handleTextChange={handleTextChange}
                />
            </OnlySelectionModal>
        </>
    );
}
