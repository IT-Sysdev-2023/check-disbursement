import { Crf, Cv, InertiaPagination } from '@/types';
import {
    DataGrid,
    gridClasses,
    GridColDef,
    GridEventListener,
    GridFilterModel,
    GridPaginationModel,
    GridSortModel,
} from '@mui/x-data-grid';
import { useCallback } from 'react';

export default function TableDataGrid({
    data,
    columns,
    pagination,
    isLoading,
    handleSearchFilter,
    handleSortFilter,
}: {
    data: InertiaPagination<Cv | Crf>;
    columns: GridColDef[];
    isLoading: boolean;
    pagination: (model: GridPaginationModel) => void;
    handleSearchFilter: (model: GridFilterModel) => void;
    handleSortFilter: (model: GridSortModel) => void;
    }) {
    const handleSortModelChange = useCallback(
        (model: GridSortModel) => {
            handleSortFilter(model);
        },
        [handleSortFilter],
    );

    const handleFilterModelChange = useCallback(
        (model: GridFilterModel) => {
            if (
                model.items.length > 0 ||
                (model.quickFilterValues && model.quickFilterValues.length > 0)
            ) {
                handleSearchFilter(model);
            }
        },
        [handleSearchFilter],
    );

    const handleRowClick = useCallback<GridEventListener<'rowClick'>>(
        ({ row }) => {
            console.log(row);
            // router.visit(details(row.id));
        },
        [],
    );
    if (!data) {
        return (
            <DataGrid
                rows={[]}
                columns={columns}
                loading={true}
                sx={{ height: 400 }}
            />
        );
    }
    return (
        <DataGrid
            rows={data.data}
            rowCount={data.meta.total}
            columns={columns}
            pagination
            sortingMode="server"
            filterMode="server"
            paginationMode="server"
            paginationModel={{
                page: data.meta.current_page - 1,
                pageSize: data.meta.per_page,
            }}
            onPaginationModelChange={pagination}
            onSortModelChange={handleSortModelChange}
            onFilterModelChange={handleFilterModelChange}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            loading={isLoading}
            showToolbar
            pageSizeOptions={[5, 10, 25]}
            sx={{
                [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                    outline: 'transparent',
                },
                [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
                    {
                        outline: 'none',
                    },
                [`& .${gridClasses.row}:hover`]: {
                    cursor: 'pointer',
                },
            }}
            slotProps={{
                loadingOverlay: {
                    variant: 'circular-progress',
                    noRowsVariant: 'circular-progress',
                },
                baseIconButton: {
                    size: 'small',
                },
            }}
        />
    );
}
