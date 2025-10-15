import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { columns } from '../internals/data/gridData';
import { Cv, inertiaPagination } from '@/types';

export default function CustomizedDataGrid({ cvs }: {cvs: inertiaPagination<Cv>}) {
  return (
    <DataGrid
      rows={cvs.data}
      columns={columns}
      rowCount={cvs.total}
      paginationModel={{
        page: cvs.current_page - 1,
        pageSize: cvs.per_page,
      }}
      pageSizeOptions={[10, 15, 25, 50]}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      // onPaginationModelChange={handlePagination}
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
