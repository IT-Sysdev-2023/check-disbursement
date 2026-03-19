import {
    Borrower,
    CheckStatus,
    ChequeType,
    Crf,
    Cv,
    InertiaPagination,
    ManageChecks,
    User,
} from '@/types';
import {
    DataGrid,
    gridClasses,
    GridColDef,
    GridDensity,
    GridFilterModel,
    GridPaginationModel,
    GridRowIdGetter,
    GridRowSelectionModel,
    GridSortModel,
} from '@mui/x-data-grid';
import { useCallback, useState } from 'react';

export default function TableDataGrid({
    data,
    columns,
    pagination,
    isLoading = false,
    filter,
    handleSearchFilter,
    handleSortFilter,
    density,
    hasSelection = false,
    rowId,
    handleSelectionChange,
}: {
    data: InertiaPagination<
        Cv | Crf | ManageChecks | ChequeType | Borrower | CheckStatus | User
    >;
    columns: GridColDef[];
    isLoading?: boolean;
    hasSelection?: boolean;
    filter?: string;
    rowId?: GridRowIdGetter<any>,
    density?: GridDensity;
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
            getRowId={rowId}
            rowCount={data.meta.total}
            columns={columns}
            pagination
            sortingMode="server"
            filterMode="server"
            paginationMode="server"
            checkboxSelection={hasSelection}
            onRowSelectionModelChange={handleSelectionChange}
            disableRowSelectionOnClick={false}
            density={density}
            paginationModel={{
                page: data.meta.current_page - 1,
                pageSize: data.meta.per_page,
            }}
            onPaginationModelChange={pagination}
            onSortModelChange={handleSortModelChange}
            filterModel={filterModel}
            onFilterModelChange={handleFilterModelChange}
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
