<?php

namespace App\Helpers;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Pagination\Paginator;
class PaginatorHelper
{
    public static function paginate($items, $perPage = 15, $page = null, $options = [])
    {
        $page = $page ?: (Paginator::resolveCurrentPage() ?: 1);

        // Convert items to a collection if it's not already
        $items = $items instanceof Collection ? $items : Collection::make($items);

        // Get the current page items
        $currentPageItems = $items->forPage($page, $perPage);

        // Reindex the items to ensure they are sequential (starting from 0)
        $currentPageItems = $currentPageItems->values();

        // Return the paginated data
        return new LengthAwarePaginator($currentPageItems, $items->count(), $perPage, $page, $options);
    }

    public static function paginateCollection(Collection $collection, $perPage = 15, $page = null, $options = [])
    {
        $page = $page ?: (LengthAwarePaginator::resolveCurrentPage() ?: 1);
        $items = $collection->forPage($page, $perPage);
        return new LengthAwarePaginator($items, $collection->count(), $perPage, $page, $options);
    }

    // return response()->json([
    //     'data' => GcResource::collection(resource: $record->items()),
    //     'from' => $record->firstItem(),
    //     'to' => $record->lastItem(),
    //     'total' => $record->total(),
    //     'links' => $record->linkCollection(),
    // ]);
}