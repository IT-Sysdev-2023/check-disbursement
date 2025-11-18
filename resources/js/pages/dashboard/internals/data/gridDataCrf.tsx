import { details } from '@/routes';
import { Cv } from '@/types';
import { router } from '@inertiajs/react';
import { Button, Stack } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { GridCellParams, GridColDef } from '@mui/x-data-grid';


// export const columnsCrf: GridColDef[] = [
//      {
//         field: 'crf',
//         headerName: 'CRF #',
//         headerAlign: 'right',
//         align: 'right',
//         flex: 1,
//         minWidth: 80,
//     },
//     {
//         field: 'company',
//         headerName: 'Company',
//         headerAlign: 'right',
//         align: 'right',
//         flex: 1,
//         minWidth: 80,
//     },
//     {
//         field: 'no',
//         headerName: 'No.',
//         headerAlign: 'right',
//         align: 'right',
//         flex: 1,
//         minWidth: 80,
//     },
//      {
//         field: 'paid_to',
//         headerName: 'Paid To',
//         headerAlign: 'right',
//         align: 'right',
//         flex: 1,
//         minWidth: 100,
//     },
//      {
//         field: 'amount',
//         headerName: 'Amount',
//         headerAlign: 'right',
//         align: 'right',
//         flex: 1,
//         minWidth: 100,
//     },
//      {
//         field: 'ck_no',
//         headerName: 'CK No.',
//         headerAlign: 'right',
//         align: 'right',
//         flex: 1,
//         minWidth: 100,
//     },
//     {
//             field: 'status',
//             headerName: 'Status',
//             minWidth: 120,
//             renderCell: (params) => {
//                 return renderStatus(
//                     params.row?.borrowed_check ? 'Borrowed' : 'Signature',
//                 );
//             },
//         },
//         {
//             field: 'actions',
//             headerName: 'Action',
//             width: 130,
//             align: 'center',
//             headerAlign: 'center',
//             sortable: false,
//             renderCell: (params) => {
//                 const { status } = params.row;

//                 console.log(params.row.borrowed_check);

//                 return (
//                     <Select
//                         size="small"
//                         value={status ?? ''}
//                         label="For Signature"
//                         onChange={(e) =>
//                             handleStatusChange(params.row.id, e.target.value)
//                         }
//                     >
//                         <MenuItem value="details">Check Details</MenuItem>
//                         {params.row.borrowed_check == null && (
//                             <MenuItem value="borrow">Borrow Check</MenuItem>
//                         )}
//                         <MenuItem value="scan">Scan</MenuItem>
//                     </Select>
//                 );
//             },
//         },
// ];

// function handleView(cv: Cv) {
//   router.visit(details(cv.id));
// }
