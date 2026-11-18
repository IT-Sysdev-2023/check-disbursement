import { router } from '@inertiajs/react';
import {
    GridFilterModel,
    GridPaginationModel,
    GridSortModel,
} from '@mui/x-data-grid';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const handlePagination = (model: GridPaginationModel) => {
    const page = model.page + 1;
    const pageSize = model.pageSize;

    router.reload({
        data: {
            page: page,
            per_page: pageSize,
        },
    });
};

export const handleSearch = (
    model: GridFilterModel,
    onLoading?: (loading: boolean) => void,
) => {
    const query = model.quickFilterValues?.length
        ? model.quickFilterValues?.[0]
        : '';

    router.reload({
        data: {
            search: query,
        },
        // only: [check === 'cv' ? 'cv' : 'crf'],
        replace: true,
        onStart: () => onLoading?.(true),
        onFinish: () => onLoading?.(false),
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
