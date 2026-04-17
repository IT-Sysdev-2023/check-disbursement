import { ChequeType, InertiaPagination } from '@/types';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

export default function CustomizedDataGrid({
    cheques,
}: {
    cheques: InertiaPagination<ChequeType>;
}) {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
        },
        {
            field: 'checkNumber',
            headerName: 'Cheque Number',
            flex: 1,
        },
        {
            field: 'checkDate',
            headerName: 'Cheque Date',
            flex: 1,
        },

        {
            field: 'payee',
            headerName: 'Payee',
            headerAlign: 'right',
            align: 'left',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'amount',
            headerName: 'Amount',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'companyName',
            headerName: 'Company Name',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 120,
        },
        {
            field: 'type',
            headerName: 'Cheque Type',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
        },
        {
            field: 'createdAt',
            headerName: 'Generated At',
            flex: 1,
            minWidth: 150,
        },
    ];

    return (
        <DataGrid
            rows={cheques.data}
            columns={columns}
            getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            initialState={{
                pagination: { paginationModel: { pageSize: 20 } },
            }}
            pageSizeOptions={[10, 20, 50]}
            disableColumnResize
            density="compact"
            slotProps={{
                filterPanel: {
                    filterFormProps: {
                        logicOperatorInputProps: {
                            variant: 'outlined',
                            size: 'small',
                        },
                        columnInputProps: {
                            variant: 'outlined',
                            size: 'small',
                            sx: { mt: 'auto' },
                        },
                        operatorInputProps: {
                            variant: 'outlined',
                            size: 'small',
                            sx: { mt: 'auto' },
                        },
                        valueInputProps: {
                            InputComponentProps: {
                                variant: 'outlined',
                                size: 'small',
                            },
                        },
                    },
                },
            }}
        />
    );
}
