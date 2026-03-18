import TableItems from '@/pages/chequeRequests/components/tableItems';
import { Borrower, InertiaPagination } from '@/types';
import { router } from '@inertiajs/react';
import { InputAdornment, TablePagination, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { SearchIcon } from 'lucide-react';
import { ChangeEvent, MouseEvent, useState } from 'react';

export default function BorrowedTableGrid({
    data,
}: {
    data: InertiaPagination<Borrower>;
}) {
    const [rowsPerPage, setRowsPerPage] = useState(data?.meta.per_page || 10);
    const [search, setSearch] = useState('');
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

    const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);

        router.reload({
            data: {
                search: e.target.value,
            },
        });
    };
    return (
        <>
            <TextField
                fullWidth
                placeholder="Search borrower..."
                value={search}
                onChange={onSearch}
                size="small"
                sx={{ mb: 2 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Borrower Number</TableCell>
                            <TableCell align="right">Borrowed Date</TableCell>
                            <TableCell align="right">Borrower Name</TableCell>
                            <TableCell align="right">Reason</TableCell>
                            <TableCell align="right">Approver</TableCell>
                            <TableCell align="right">
                                Borrower Details
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.data?.length ? (
                            data.data.map((row) => (
                                <TableItems key={row.borrowerNo} row={row} />
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
