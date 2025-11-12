import * as React from 'react';
import { DataGrid, GridPaginationModel } from '@mui/x-data-grid';
import { columns } from '../internals/data/gridData';
import { Cv, inertiaPagination } from '@/types';
import { router } from '@inertiajs/react';
import { retrievedRecords } from '@/routes';

export default function CvDataGrid({ cvs }: { cvs: inertiaPagination<Cv> }) {
  
  const handlePagination = (model: GridPaginationModel) => {
    const page = model.page + 1; // MUI DataGrid uses 0-based index
    const per_page = model.pageSize;

    router.get(retrievedRecords(), { page, per_page }, {
      preserveScroll: true,
      preserveState: true,
      replace: true,
    });
    
  };

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
      onPaginationModelChange={handlePagination}
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
