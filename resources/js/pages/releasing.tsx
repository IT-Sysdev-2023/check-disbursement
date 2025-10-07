import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { releasing } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check-Releasing',
        href: releasing().url,
    },
    
];

type Project = {
    id: number;
    name: string;
    status: string;
    value: string;
}

export default function Releasing() {

const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mockData: Project[] = [
    { id: 1, name: 'Project Alpha', status: 'Completed', value: '$12,450' },
    { id: 2, name: 'Project Beta', status: 'In Progress', value: '$8,720' },
    { id: 3, name: 'Project Gamma', status: 'Pending', value: '$15,300' },
    { id: 4, name: 'Project Delta', status: 'Completed', value: '$9,850' },
  ];

  const simulateDataRetrieval = () => {
    setIsLoading(true);
    setProgress(0);
    setError(null);
    setData(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setData(mockData);
          setIsLoading(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
  };

  const simulateError = () => {
    setIsLoading(true);
    setProgress(0);
    setError(null);
    setData(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 60) {
          clearInterval(interval);
          setError('Failed to retrieve data. Please try again.');
          setIsLoading(false);
          return 60;
        }
        return prev + Math.random() * 12;
      });
    }, 300);
  };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Check-Releasing" /> 
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="relative min-h-[80vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-white/80 backdrop-blur-sm dark:border-sidebar-border dark:bg-gray-900/80">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    
                    {/* Content */}
                    <div className="relative z-10 flex size-full flex-col p-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        Data Retrieval System
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                        Retrieve and analyze your project data with ease
                        </p>
                    </div>

                    {/* Control Panel */}
                    <div className="mb-8 flex justify-center gap-4">
                        <button
                        onClick={simulateDataRetrieval}
                        disabled={isLoading}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                        >
                        {isLoading ? 'Retrieving...' : 'Retrieve Data'}
                        </button>
                        
                        <button
                        onClick={simulateError}
                        disabled={isLoading}
                        className="px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                        >
                        Simulate Error
                        </button>
                    </div>

                    {/* Progress Section */}
                    {isLoading && (
                        <div className="mb-8 p-6 bg-white/90 dark:bg-gray-800/90 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Retrieving Data...
                            </span>
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {Math.min(100, Math.round(progress))}%
                            </span>
                        </div>
                        
                        {/* Main Progress Bar */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
                            <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                            />
                        </div>

                        {/* Progress Steps */}
                        <div className="grid grid-cols-4 gap-2 text-xs">
                            {['Connecting', 'Fetching', 'Processing', 'Complete'].map((step, index) => (
                            <div
                                key={step}
                                className={`text-center p-2 rounded ${
                                progress >= (index + 1) * 25
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                }`}
                            >
                                {step}
                            </div>
                            ))}
                        </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                            <svg className="size-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
                            </div>
                            <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                                Error
                            </h3>
                            <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                                {error}
                            </p>
                            </div>
                        </div>
                        </div>
                    )}

                    {/* Data Display */}
                        {data && (
                             <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                             <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                               <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                 Retrieved Data
                               </h2>
                               <p className="text-sm text-gray-600 dark:text-gray-400">
                                 {data.length} projects found
                               </p>
                             </div>
                         <TableContainer component={Paper} >
                         <Table sx={{ minWidth: 650 }} aria-label="simple table">
                         <TableHead>
                             <TableRow>
                             <TableCell>Id</TableCell>
                             <TableCell align="right">Name</TableCell>
                             <TableCell align="right">Status</TableCell>
                             <TableCell align="right">Value</TableCell>
                             </TableRow>
                         </TableHead>
                         <TableBody>
                             {data.map((row) => (
                             <TableRow
                                 key={row.name}
                                     sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                     className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                             >
                                 <TableCell component="th" scope="row">
                                 {row.id}
                                 </TableCell>
                                 <TableCell align="right">{row.name}</TableCell>
                                 <TableCell align="right" >{row.status}</TableCell>
                                 <TableCell align="right" >{row.value}</TableCell>
                             </TableRow>
                             ))}
                         </TableBody>
                         </Table>
                                </TableContainer>
                                </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !data && !error && (
                        <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto size-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <svg className="size-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No data retrieved
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Click the button above to start retrieving your data
                            </p>
                        </div>
                        </div>
                    )}
                    </div>
                </div>
        </div>
        </AppLayout>
    );
}
