import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { retrievedRecords } from '@/routes';
import { Head, router, usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DrawIcon from '@mui/icons-material/Draw';
import {
    Alert,
    Box,
    Button,
    Drawer,
    Modal,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import Badge from '@mui/material/Badge';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';

interface FileItem {
    name: string;
    path: string;
    url: string;
    size: number;
    mime: string;
}

interface Props {
    files: FileItem[];
}

function formatSize(bytes: number) {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    return Math.round(bytes / 1024) + ' KB';
}

export default function ScanCheques({ files }: Props) {
    const [dateValue, setValue] = useState<Dayjs | null>(dayjs());
    const [searchData, setSearchData] = useState<string>('');
    const page = usePage<any>().props.auth;
    const breadcrumbs = [{ title: 'Scan Cheques', href: '/scan-cheques' }];
    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<any>();
    const [open, setOpen] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [alScanned, setAlreadyScanned] = React.useState<any[]>([]);

    const [selectedRow, setSelectedRow] = useState<any>({
        bank_account_name: '',
        cheque_date: '',
        cheque_no: '',
        account_number: '',
        amount: '',
        payee: '',
    });

    const handleOpenModal = (row: any) => {
        setSelectedRow({ ...row });
        setOpenModal(true);
    };
    const saveChanges = async (selected: any) => {
        const { data } = await axios.put(
            '/retrieved-checks/put-selected-rows-check/',
            {
                data: selected,
            },
        );
        if (data) {
            setScannedCheques((prev: any[]) =>
                prev.map((item) =>
                    item.id === data.record.id ? data.record : item,
                ),
            );
            setSuccess(true);
            setOpenModal(false);
        }
    };

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRow({
            ...selectedRow,
            [e.target.name]: e.target.value,
        });
    };

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const [openEditModal, setOpenModal] = React.useState(false);

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const [search, setSearch] = useState('');
    const [getScanned, setScannedCheques] = useState<any>([]);

    const filtered = files.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase()),
    );

    const analyzeScanned = async () => {
        setLoading(true);

        try {
            const { data } = await axios.post(
                '/retrieved-checks/scan-analyze/',
            );

            if (data.status == 'success') {
                router.reload();
            }
        } finally {
            // setLoading(false);
        }
    };

    const clearCache = async () => {
        const { data } = await axios.get('/retrieved-checks/clear-cache/');
        if (data.status == 'success') {
            router.reload();
        }
    };

    const getScannedCheques = async (date: any, search: string) => {
        const { data } = await axios.post(
            '/retrieved-checks/get-scanned-cheques/',
            {
                date: date?.format('YYYY-MM-DD'),
                search: search,
            },
        );

        setScannedCheques(data.records);
    };

    useEcho(
        `scanning-cheques.${page.user.id}`,
        '.scanning-cheques-event',
        (e: any) => {
            setProgress(e);
            // console.log('scanning-cheques-event', e);
            if (e.percentage == 100) {
                setLoading(false);
                clearCache();
            }
        },
    );

    useEcho(
        `scanned-records.${page.user.id}`,
        '.scanned-records-event',
        (e: any) => {
            setScannedCheques((prev: any[]) => [...prev, e.records]);
        },
    );

    useEcho(
        `already-scanned-records.${page.user.id}`,
        '.already-scanned-records-event',
        (e: any) => {
            setAlreadyScanned((prev: any[]) => [...prev, e.records]);
        },
    );

    useEffect(() => {
        getScannedCheques(dateValue, searchData);
    }, [dateValue, searchData]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scan Cheques" />
            {alScanned.length > 0 && (
                <>
                    <div className="mt-6 rounded-lg border">
                        <h3 className="border-b px-4 py-2 text-sm font-semibold">
                            Already Scanned
                        </h3>

                        <ul className="divide-y">
                            {alScanned.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between px-4 py-2 text-sm"
                                >
                                    <span className="">
                                        {item.cheque_no ?? 'N/A'} —{' '}
                                        {item.account_no ?? 'N/A'}
                                    </span>
                                    <span className="">
                                        {item.bank_account_name ?? 'N/A'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
            <PageContainer title="Sync Scanned Cheques">
                <Snackbar
                    open={success}
                    autoHideDuration={2000}
                    onClose={() => setSuccess(false)}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <Alert
                        onClose={() => setSuccess(false)}
                        severity="success"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        Cheques Successfully Udpated!
                    </Alert>
                </Snackbar>
                <div className="mx-auto w-7xl">
                    <div className="grid grid-cols-1 gap-8">
                        {/* Left Column - File Browser (30%) */}

                        <Drawer open={open} onClose={toggleDrawer(false)}>
                            <div className="flex flex-col p-4">
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="relative max-w-xs flex-1">
                                        <input
                                            type="text"
                                            placeholder="Search files..."
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            className="w-full rounded-xl border py-3 pl-10 text-sm transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="absolute top-3.5 left-3.5 h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>

                                    <span className="ml-4 text-sm font-medium whitespace-nowrap">
                                        {filtered.length} file
                                        {filtered.length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                {/* File List */}
                                <div className="flex-1 overflow-hidden rounded-2xl border shadow-sm">
                                    {filtered.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-center">
                                            <div className="mb-4 text-6xl opacity-40">
                                                📁
                                            </div>
                                            <p className="font-medium">
                                                No files found
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="divide-y">
                                            {filtered.map((file) => (
                                                <div
                                                    key={file.path}
                                                    className="group flex items-center gap-4 px-6 py-4 transition-all duration-150"
                                                >
                                                    {/* Icon */}
                                                    <div className="text-3xl">
                                                        {file.mime?.startsWith(
                                                            'image/',
                                                        )
                                                            ? '🖼️'
                                                            : '📄'}
                                                    </div>

                                                    {/* Name */}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate font-medium transition-colors group-hover:text-blue-600">
                                                            {file.name}
                                                        </p>
                                                        <p className="mt-0.5 text-xs">
                                                            {file.path}
                                                        </p>
                                                    </div>

                                                    {/* Type */}
                                                    {/* <div>
                                                    <FileTypeIcon mime={file.mime} />
                                                </div> */}

                                                    {/* Size */}
                                                    <div className="w-20 text-right">
                                                        <p className="text-sm font-medium">
                                                            {formatSize(
                                                                file.size,
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Action */}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Drawer>
                        <div className="mb-6 flex w-full gap-4">
                            <Badge
                                badgeContent={filtered?.length}
                                color="error"
                                max={999}
                            >
                                <Button
                                    variant="contained"
                                    onClick={toggleDrawer(true)}
                                    className="flex-1"
                                >
                                    Open Scanned Cheques
                                </Button>
                            </Badge>

                            <Button
                                variant="outlined"
                                onClick={analyzeScanned}
                                disabled={filtered.length === 0 || loading}
                                className="flex-1"
                            >
                                {loading
                                    ? 'Analyzing please wait....'
                                    : 'Sync Cheques & Analyze'}
                            </Button>
                        </div>

                        {/* Right Column - 70% Processing Area */}
                        <div className="flex flex-col">
                            <div className="space-y-6">
                                {/* Header */}
                                <div className="flex items-center gap-4">
                                    <div className="justify-centezr flex h-14 w-14 items-center rounded-full bg-blue-100 text-2xl">
                                        🔍
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold">
                                            Processed Cheques
                                        </h2>
                                        {/* <Alert  severity="info"> Cheques that have been processed and analyzed will appear here. You can edit the details of each cheque if necessary.</Alert> */}
                                        <p className="text-sm">
                                            Cheques that have been processed and
                                            analyzed will appear here. You can
                                            edit the details of each cheque if
                                            necessary.
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-2 flex justify-between">
                                    <div>
                                        <DatePicker
                                            label="Select date"
                                            value={dateValue}
                                            onChange={(newValue) =>
                                                setValue(newValue)
                                            }
                                        />
                                    </div>
                                    <div>
                                        <TextField
                                            label="Search.."
                                            name="amount"
                                            type="text"
                                            placeholder="Aa.."
                                            value={searchData}
                                            onChange={(e) =>
                                                setSearchData(e.target.value)
                                            }
                                            fullWidth
                                        />
                                    </div>
                                </div>
                                {progress && (
                                    <div className="flex items-center gap-4">
                                        {/* {JSON.stringify(progress)} */}
                                        <div className="w-full rounded-2xl border p-6 shadow-lg">
                                            <div className="flex items-center justify-between">
                                                {progress?.totalRows ===
                                                progress?.currentRow ? (
                                                    <>
                                                        <div>
                                                            <h2 className="text-lg font-semibold text-green-500">
                                                                Done
                                                            </h2>

                                                            <p className="mt-1 text-sm text-green-400">
                                                                Done Analyzing..
                                                            </p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div>
                                                            <h2 className="text-lg font-semibold">
                                                                Processing
                                                                Cheques
                                                            </h2>

                                                            <p className="mt-1 text-sm">
                                                                Please wait
                                                                while we analyze
                                                                your files...
                                                            </p>
                                                        </div>
                                                    </>
                                                )}

                                                <div className="text-right">
                                                    <p className="text-3xl font-bold">
                                                        {progress?.percentage}%
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-6">
                                                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 transition-all duration-500 ease-out"
                                                        style={{
                                                            width:
                                                                progress?.percentage +
                                                                '%',
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-4 text-sm">
                                                {/* Top row: Progress counter + Status */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="font-semibold">
                                                            {
                                                                progress?.currentRow
                                                            }
                                                        </span>
                                                        <span className="text-gray-500">
                                                            {' '}
                                                            of{' '}
                                                            {
                                                                progress?.totalRows
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="font-medium">
                                                        {progress?.totalRows ===
                                                        progress?.currentRow ? (
                                                            <div className="text-green-400">
                                                                Done Scanning
                                                                Cheques
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                {
                                                                    progress?.message
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Detailed progress card - only shown while scanning */}
                                                {progress?.totalRows !==
                                                    progress?.currentRow && (
                                                    <div className="mt-4 rounded-xl border px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <svg
                                                                className="h-5 w-5 animate-spin"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <circle
                                                                    className="opacity-20"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                />
                                                                <path
                                                                    className="opacity-100"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                                />
                                                            </svg>

                                                            <div>
                                                                <p className="font-medium">
                                                                    Analyzing
                                                                    cheque{' '}
                                                                    {
                                                                        progress?.totalRows
                                                                    }
                                                                </p>
                                                                <p className="text-sm">
                                                                    Reading
                                                                    account
                                                                    number and
                                                                    amount...
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <Modal
                                    open={openEditModal}
                                    onClose={handleCloseModal}
                                >
                                    <Box sx={style}>
                                        <Box
                                            sx={{
                                                width: 500,
                                                bgcolor: 'background.paper',
                                                borderRadius: 2,
                                                p: 3,
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform:
                                                    'translate(-50%, -50%)',
                                                boxShadow: 24,
                                            }}
                                        >
                                            <Typography variant="h6" mb={3}>
                                                Edit Cheque
                                            </Typography>
                                            <Stack spacing={2}>
                                                <TextField
                                                    label="Bank Account Name"
                                                    name="bank_account_name"
                                                    value={
                                                        selectedRow.bank_account_name
                                                    }
                                                    onChange={handleChange}
                                                    fullWidth
                                                />
                                                <TextField
                                                    label="Cheque Date"
                                                    name="cheque_date"
                                                    type="date"
                                                    value={
                                                        selectedRow.cheque_date?.split(
                                                            'T',
                                                        )[0] || ''
                                                    }
                                                    onChange={handleChange}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    fullWidth
                                                />

                                                <TextField
                                                    label="Cheque No."
                                                    name="cheque_no"
                                                    value={
                                                        selectedRow.cheque_no
                                                    }
                                                    onChange={handleChange}
                                                    fullWidth
                                                />

                                                <TextField
                                                    label="Account Number"
                                                    name="account_number"
                                                    value={
                                                        selectedRow.account_number
                                                    }
                                                    onChange={handleChange}
                                                    fullWidth
                                                />

                                                <TextField
                                                    label="Amount"
                                                    name="amount"
                                                    type="number"
                                                    value={selectedRow.amount}
                                                    onChange={handleChange}
                                                    fullWidth
                                                />

                                                <TextField
                                                    label="Payee"
                                                    name="payee"
                                                    value={selectedRow.payee}
                                                    onChange={handleChange}
                                                    fullWidth
                                                />

                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    justifyContent="flex-end"
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        onClick={
                                                            handleCloseModal
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>

                                                    <Button
                                                        variant="contained"
                                                        onClick={() => {
                                                            saveChanges(
                                                                selectedRow,
                                                            );
                                                            // axios.put(`/api/cheques/${selectedRow.id}`, selectedRow)
                                                        }}
                                                    >
                                                        Save Changes
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </Box>
                                    </Box>
                                </Modal>

                                {/* Table Card */}
                                <div className="overflow-x-auto rounded-2xl border shadow-sm">
                                    <TableContainer
                                        component={Paper}
                                        sx={{ minWidth: 1200 }}
                                    >
                                        <Table
                                            size="small"
                                            aria-label="a dense table"
                                            sx={{
                                                '& .MuiTableCell-root': {
                                                    whiteSpace: 'nowrap', // Prevent text wrapping
                                                    padding: { xs: 1, sm: 1.5 }, // Smaller padding on mobile
                                                },
                                            }}
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        Bank Name
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        Date
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        Cheque No.
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        Account Number
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        Account Name
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        Amount
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        Amount in words
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        Micr Number
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        Serial Code
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        Barcode/Qr
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        Payee
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        Action
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>

                                            {getScanned?.length === 0 && (
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={11}
                                                            align="center"
                                                            sx={{ py: 4 }}
                                                        >
                                                            No data today
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            )}

                                            <TableBody>
                                                {getScanned?.map((row: any) => (
                                                    <TableRow
                                                        key={row?.id}
                                                        sx={{
                                                            '&:last-child td, &:last-child th':
                                                                { border: 0 },
                                                        }}
                                                    >
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                        >
                                                            {
                                                                row?.bank_account_name
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {dayjs(
                                                                row?.cheque_date,
                                                            ).format(
                                                                'MMM DD, YYYY',
                                                            )}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row?.cheque_no}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {
                                                                row?.account_number
                                                            }
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {
                                                                row?.account_name
                                                            }
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {new Intl.NumberFormat(
                                                                'en-PH',
                                                                {
                                                                    style: 'currency',
                                                                    currency:
                                                                        'PHP',
                                                                },
                                                            ).format(
                                                                Number(
                                                                    row?.amount,
                                                                ),
                                                            )}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {
                                                                row?.amount_in_words
                                                            }
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row?.micr_number}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row?.serial_code}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row?.barcode_or_qr}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row?.payee}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Button
                                                                size="small"
                                                                onClick={() =>
                                                                    handleOpenModal(
                                                                        row,
                                                                    )
                                                                }
                                                            >
                                                                <DrawIcon />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                                <Button
                                    variant="contained"
                                    startIcon={<ArrowBackIcon />}
                                    onClick={() =>
                                        router.get(retrievedRecords(), {
                                            tab: 'manageChecks',
                                        })
                                    }
                                >
                                    Back
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </PageContainer>
        </AppLayout>
    );
}
