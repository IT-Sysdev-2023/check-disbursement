import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CheckBorrowingController::index
 * @see app/Http/Controllers/CheckBorrowingController.php:25
 * @route '/section-head/check-borrowing/index'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/section-head/check-borrowing/index',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckBorrowingController::index
 * @see app/Http/Controllers/CheckBorrowingController.php:25
 * @route '/section-head/check-borrowing/index'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckBorrowingController::index
 * @see app/Http/Controllers/CheckBorrowingController.php:25
 * @route '/section-head/check-borrowing/index'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckBorrowingController::index
 * @see app/Http/Controllers/CheckBorrowingController.php:25
 * @route '/section-head/check-borrowing/index'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckBorrowingController::index
 * @see app/Http/Controllers/CheckBorrowingController.php:25
 * @route '/section-head/check-borrowing/index'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckBorrowingController::index
 * @see app/Http/Controllers/CheckBorrowingController.php:25
 * @route '/section-head/check-borrowing/index'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckBorrowingController::index
 * @see app/Http/Controllers/CheckBorrowingController.php:25
 * @route '/section-head/check-borrowing/index'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\CheckBorrowingController::borrow
 * @see app/Http/Controllers/CheckBorrowingController.php:49
 * @route '/section-head/check-borrowing/secondary-borrow'
 */
export const borrow = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: borrow.url(options),
    method: 'put',
})

borrow.definition = {
    methods: ["put"],
    url: '/section-head/check-borrowing/secondary-borrow',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CheckBorrowingController::borrow
 * @see app/Http/Controllers/CheckBorrowingController.php:49
 * @route '/section-head/check-borrowing/secondary-borrow'
 */
borrow.url = (options?: RouteQueryOptions) => {
    return borrow.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckBorrowingController::borrow
 * @see app/Http/Controllers/CheckBorrowingController.php:49
 * @route '/section-head/check-borrowing/secondary-borrow'
 */
borrow.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: borrow.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CheckBorrowingController::borrow
 * @see app/Http/Controllers/CheckBorrowingController.php:49
 * @route '/section-head/check-borrowing/secondary-borrow'
 */
    const borrowForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: borrow.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CheckBorrowingController::borrow
 * @see app/Http/Controllers/CheckBorrowingController.php:49
 * @route '/section-head/check-borrowing/secondary-borrow'
 */
        borrowForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: borrow.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    borrow.form = borrowForm
/**
* @see \App\Http\Controllers\CheckBorrowingController::returnCheck
 * @see app/Http/Controllers/CheckBorrowingController.php:139
 * @route '/section-head/check-borrowing/return-check'
 */
export const returnCheck = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: returnCheck.url(options),
    method: 'put',
})

returnCheck.definition = {
    methods: ["put"],
    url: '/section-head/check-borrowing/return-check',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CheckBorrowingController::returnCheck
 * @see app/Http/Controllers/CheckBorrowingController.php:139
 * @route '/section-head/check-borrowing/return-check'
 */
returnCheck.url = (options?: RouteQueryOptions) => {
    return returnCheck.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckBorrowingController::returnCheck
 * @see app/Http/Controllers/CheckBorrowingController.php:139
 * @route '/section-head/check-borrowing/return-check'
 */
returnCheck.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: returnCheck.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CheckBorrowingController::returnCheck
 * @see app/Http/Controllers/CheckBorrowingController.php:139
 * @route '/section-head/check-borrowing/return-check'
 */
    const returnCheckForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: returnCheck.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CheckBorrowingController::returnCheck
 * @see app/Http/Controllers/CheckBorrowingController.php:139
 * @route '/section-head/check-borrowing/return-check'
 */
        returnCheckForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: returnCheck.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    returnCheck.form = returnCheckForm
const CheckBorrowingController = { index, borrow, returnCheck }

export default CheckBorrowingController