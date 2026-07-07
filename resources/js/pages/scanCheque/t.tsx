import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

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
    const page = usePage<any>().props.auth;
    const breadcrumbs = [{ title: 'Scan Cheques', href: '/scan-cheques' }];
    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<any>();

    const [search, setSearch] = useState('');
    const [getScanned, setScannedCheques] = useState<any>([]);

    const filtered = files.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase()),
    );

    const analyzeScanned = async () => {
        const { data } = await axios.post('/retrieved-checks/scan-analyze/');
    };

    const getScannedCheques = async () => {
        const { data } = await axios.post(
            '/retrieved-checks/get-scanned-cheques/',
        );

        setScannedCheques(data.records);
    };

    useEcho(
        `scanning-cheques.${page.user.id}`,
        '.scanning-cheques-event',
        (e: any) => {
            setLoading(false);
            setProgress(e);
        },
    );

    useEcho(
        `scanned-records.${page.user.id}`,
        '.scanned-records-event',
        (e: any) => {
            setScannedCheques((prev: any[]) => [...prev, e.records]);
            console.log('shesh');
        },
    );

    useEffect(() => {
        getScannedCheques();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scan Cheques" />

            <PageContainer title="Sync Scanned Cheques">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-[3fr_7fr]">
                        {/* Left Column - File Browser (30%) */}
                        <div className="flex flex-col">
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
                                                        {formatSize(file.size)}
                                                    </p>
                                                </div>

                                                {/* Action */}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - 70% Processing Area */}
                        <div className="flex flex-col">
                            <div className="mb-2 flex justify-end">
                                {/* {JSON.stringify(files)} */}
                                <Button
                                    variant="outlined"
                                    onClick={analyzeScanned}
                                >
                                    Analyze Cheques and Upload
                                </Button>
                            </div>
                            <div className="space-y-6">
                                {/* Header */}
                                <div className="flex items-center gap-4">
                                    <div className="justify-centezr flex h-14 w-14 items-center rounded-full bg-blue-100 text-2xl">
                                        🔍
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold">
                                            Cheque Processing
                                        </h2>
                                        <p className="text-sm">
                                            Select a file to begin processing
                                        </p>
                                    </div>
                                </div>
                                {progress && (
                                    <div className="flex items-center gap-4">
                                        {/* {JSON.stringify(progress)} */}
                                        <div className="w-full rounded-2xl border p-6 shadow-lg">
                                            <div className="flex items-center justify-between">
                                                {progress.totalRows ===
                                                progress.currentRow ? (
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
                                                        {progress.percentage}%
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-6">
                                                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 transition-all duration-500 ease-out"
                                                        style={{
                                                            width:
                                                                progress.percentage +
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
                                                                progress.currentRow
                                                            }
                                                        </span>
                                                        <span className="text-gray-500">
                                                            {' '}
                                                            of{' '}
                                                            {progress.totalRows}
                                                        </span>
                                                    </div>

                                                    <div className="font-medium">
                                                        {progress.totalRows ===
                                                        progress.currentRow ? (
                                                            <div className="text-green-400">
                                                                Done Scanning
                                                                Cheques
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                {
                                                                    progress.message
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Detailed progress card - only shown while scanning */}
                                                {progress.totalRows !==
                                                    progress.currentRow && (
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
                                                                        progress.totalRows
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

                                {/* Table Card */}
                                <div className="overflow-hidden rounded-2xl border shadow-sm">
                                    <TableContainer component={Paper}>
                                        <Table
                                            sx={{ minWidth: 650 }}
                                            size="small"
                                            aria-label="a dense table"
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
                                                        Amount
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        Payee
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {getScanned.map((row: any) => (
                                                    <TableRow
                                                        key={
                                                            row.back_account_name
                                                        }
                                                        sx={{
                                                            '&:last-child td, &:last-child th':
                                                                { border: 0 },
                                                        }}
                                                    >
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                        >
                                                            {dayjs(
                                                                row.cheque_date,
                                                            ).format(
                                                                'MMM DD, YYYY',
                                                            )}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {row.cheque_no}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {row.account_number}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {row.amount}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {row.payee}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PageContainer>
        </AppLayout>
    );
}
