import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BorrowedCheckController::borrower
 * @see app/Http/Controllers/BorrowedCheckController.php:22
 * @route '/retrieved-checks/get-borrower-names'
 */
export const borrower = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: borrower.url(options),
    method: 'get',
})

borrower.definition = {
    methods: ["get","head"],
    url: '/retrieved-checks/get-borrower-names',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BorrowedCheckController::borrower
 * @see app/Http/Controllers/BorrowedCheckController.php:22
 * @route '/retrieved-checks/get-borrower-names'
 */
borrower.url = (options?: RouteQueryOptions) => {
    return borrower.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BorrowedCheckController::borrower
 * @see app/Http/Controllers/BorrowedCheckController.php:22
 * @route '/retrieved-checks/get-borrower-names'
 */
borrower.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: borrower.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BorrowedCheckController::borrower
 * @see app/Http/Controllers/BorrowedCheckController.php:22
 * @route '/retrieved-checks/get-borrower-names'
 */
borrower.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: borrower.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BorrowedCheckController::borrower
 * @see app/Http/Controllers/BorrowedCheckController.php:22
 * @route '/retrieved-checks/get-borrower-names'
 */
    const borrowerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: borrower.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BorrowedCheckController::borrower
 * @see app/Http/Controllers/BorrowedCheckController.php:22
 * @route '/retrieved-checks/get-borrower-names'
 */
        borrowerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: borrower.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BorrowedCheckController::borrower
 * @see app/Http/Controllers/BorrowedCheckController.php:22
 * @route '/retrieved-checks/get-borrower-names'
 */
        borrowerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: borrower.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    borrower.form = borrowerForm
/**
* @see \App\Http\Controllers\BorrowedCheckController::store
 * @see app/Http/Controllers/BorrowedCheckController.php:17
 * @route '/retrieved-checks/store-borrow-check'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/retrieved-checks/store-borrow-check',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BorrowedCheckController::store
 * @see app/Http/Controllers/BorrowedCheckController.php:17
 * @route '/retrieved-checks/store-borrow-check'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BorrowedCheckController::store
 * @see app/Http/Controllers/BorrowedCheckController.php:17
 * @route '/retrieved-checks/store-borrow-check'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BorrowedCheckController::store
 * @see app/Http/Controllers/BorrowedCheckController.php:17
 * @route '/retrieved-checks/store-borrow-check'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BorrowedCheckController::store
 * @see app/Http/Controllers/BorrowedCheckController.php:17
 * @route '/retrieved-checks/store-borrow-check'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\BorrowedCheckController::pendingDetails
 * @see app/Http/Controllers/BorrowedCheckController.php:27
 * @route '/retrieved-checks/pending-details/{id}'
 */
export const pendingDetails = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingDetails.url(args, options),
    method: 'get',
})

pendingDetails.definition = {
    methods: ["get","head"],
    url: '/retrieved-checks/pending-details/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BorrowedCheckController::pendingDetails
 * @see app/Http/Controllers/BorrowedCheckController.php:27
 * @route '/retrieved-checks/pending-details/{id}'
 */
pendingDetails.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { id: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: typeof args.id === 'object'
                ? args.id.id
                : args.id,
                }

    return pendingDetails.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BorrowedCheckController::pendingDetails
 * @see app/Http/Controllers/BorrowedCheckController.php:27
 * @route '/retrieved-checks/pending-details/{id}'
 */
pendingDetails.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingDetails.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BorrowedCheckController::pendingDetails
 * @see app/Http/Controllers/BorrowedCheckController.php:27
 * @route '/retrieved-checks/pending-details/{id}'
 */
pendingDetails.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pendingDetails.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BorrowedCheckController::pendingDetails
 * @see app/Http/Controllers/BorrowedCheckController.php:27
 * @route '/retrieved-checks/pending-details/{id}'
 */
    const pendingDetailsForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pendingDetails.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BorrowedCheckController::pendingDetails
 * @see app/Http/Controllers/BorrowedCheckController.php:27
 * @route '/retrieved-checks/pending-details/{id}'
 */
        pendingDetailsForm.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pendingDetails.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BorrowedCheckController::pendingDetails
 * @see app/Http/Controllers/BorrowedCheckController.php:27
 * @route '/retrieved-checks/pending-details/{id}'
 */
        pendingDetailsForm.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pendingDetails.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pendingDetails.form = pendingDetailsForm
const BorrowedCheckController = { borrower, store, pendingDetails }

export default BorrowedCheckController