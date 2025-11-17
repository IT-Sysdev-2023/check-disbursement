import { DataGrid, GridPaginationModel } from '@mui/x-data-grid';
import { columns } from '../internals/data/gridData';
import { Cv, inertiaPagination } from '@/types';

export default function CvDataGrid({ cvs, pagination }: { cvs: inertiaPagination<Cv>, pagination: (model: GridPaginationModel) => void }) {

  return (
    <DataGrid
      rows={cvs.data}
      columns={columns}
      rowCount={cvs.total}
      paginationMode="server"
      paginationModel={{
        page: cvs.current_page - 1,
        pageSize: cvs.per_page,
      }}
      pageSizeOptions={[10, 15, 25, 50]}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      onPaginationModelChange={pagination}
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
