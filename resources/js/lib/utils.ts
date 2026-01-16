import { router } from '@inertiajs/react';
import { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const handlePagination = (model: GridPaginationModel) => {
    const page = model.page + 1;
    // const per_page = model.pageSize;

    router.reload({
        data: {
            page: page,
        },
    });
};

export const handleSearch = (model: GridFilterModel) => {
    const query = model.quickFilterValues?.length
        ? model.quickFilterValues?.[0]
        : '';

    router.reload({
        data: {
            search: query,
        },
        // only: [check === 'cv' ? 'cv' : 'crf'],
        replace: true,
    });
};

export const handleSort = (model: GridSortModel) => {
    router.reload({
        data: {
            sort: {
                field: model[0].field,
                sort: model[0].sort,
            },
        },
        // only: [check === 'cv' ? 'cv' : 'crf'],
        replace: true,
    });
};
