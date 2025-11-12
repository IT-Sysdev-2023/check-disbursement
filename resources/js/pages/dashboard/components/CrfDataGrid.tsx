import * as React from 'react';
import { DataGrid, GridPaginationModel } from '@mui/x-data-grid';
import { Crf, inertiaPagination } from '@/types';
import { router } from '@inertiajs/react';
import { retrievedRecords } from '@/routes';
import { columnsCrf } from '../internals/data/gridDataCrf';

export default function CrfDataGrid({ crf }: { crf: inertiaPagination<Crf> }) {
  
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
      rows={crf.data}
      columns={columnsCrf}
      rowCount={crf.total}
      paginationMode="server"
      paginationModel={{
        page: crf.current_page - 1,
        pageSize: crf.per_page,
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
