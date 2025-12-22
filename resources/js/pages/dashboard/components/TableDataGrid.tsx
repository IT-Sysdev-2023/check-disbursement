import { Crf, Cv, InertiaPagination, ManageChecks } from '@/types';
import {
    DataGrid,
    gridClasses,
    GridColDef,
    GridDensity,
    GridEventListener,
    GridFilterModel,
    GridPaginationModel,
    GridRowSelectionModel,
    GridSortModel,
} from '@mui/x-data-grid';
import { useCallback, useState } from 'react';

export default function TableDataGrid({
    data,
    columns,
    pagination,
    isLoading,
    filter,
    handleSearchFilter,
    handleSortFilter,
    density,
    hasSelection = false,
    handleSelectionChange,
    selectionModel,
    handleRowClickSelection,
}: {
    data: InertiaPagination<Cv | Crf | ManageChecks>;
    columns: GridColDef[];
    isLoading: boolean;
    hasSelection?: boolean;
    filter?: string;
    selectionModel?: GridRowSelectionModel;
    density?: GridDensity;
    handleRowClickSelection?: (id: number, taggedAt: string | null) => void;
    handleSelectionChange?: (model: GridRowSelectionModel) => void;
    pagination: (model: GridPaginationModel) => void;
    handleSearchFilter: (model: GridFilterModel) => void;
    handleSortFilter: (model: GridSortModel) => void;
}) {
    const [filterModel, setFilterModel] = useState<GridFilterModel>({
        items: [],
        quickFilterValues: [filter ?? []],
    });

    const handleSortModelChange = useCallback(
        (model: GridSortModel) => {
            if (model.length) {
                handleSortFilter(model);
            }
        },
        [handleSortFilter],
    );

    const handleFilterModelChange = useCallback(
        (model: GridFilterModel) => {
            setFilterModel(model);

            handleSearchFilter(model);
        },
        [handleSearchFilter],
    );

    const handleRowClick = useCallback<GridEventListener<'rowClick'>>(
        ({ row }) => {
            handleRowClickSelection?.(row.id, row.taggedAt);
            // router.visit(details(row.id));
        },
        [handleRowClickSelection],
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
            checkboxSelection={hasSelection}
            rowSelectionModel={selectionModel}
            onRowClick={handleRowClick}
            onRowSelectionModelChange={handleSelectionChange}
            density={density}
            paginationModel={{
                page: data.meta.current_page - 1,
                pageSize: data.meta.per_page,
            }}
            onPaginationModelChange={pagination}
            onSortModelChange={handleSortModelChange}
            filterModel={filterModel}
            onFilterModelChange={handleFilterModelChange}
            disableRowSelectionOnClick
            loading={isLoading}
            showToolbar
            pageSizeOptions={[5, 10, 15, 25]}
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
