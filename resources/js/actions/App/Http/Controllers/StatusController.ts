import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\StatusController::scannedRecordsAmountCheckNo
 * @see app/Http/Controllers/StatusController.php:32
 * @route '/details/scanned-records-amount-checkNo'
 */
export const scannedRecordsAmountCheckNo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scannedRecordsAmountCheckNo.url(options),
    method: 'get',
})

scannedRecordsAmountCheckNo.definition = {
    methods: ["get","head"],
    url: '/details/scanned-records-amount-checkNo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StatusController::scannedRecordsAmountCheckNo
 * @see app/Http/Controllers/StatusController.php:32
 * @route '/details/scanned-records-amount-checkNo'
 */
scannedRecordsAmountCheckNo.url = (options?: RouteQueryOptions) => {
    return scannedRecordsAmountCheckNo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StatusController::scannedRecordsAmountCheckNo
 * @see app/Http/Controllers/StatusController.php:32
 * @route '/details/scanned-records-amount-checkNo'
 */
scannedRecordsAmountCheckNo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scannedRecordsAmountCheckNo.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StatusController::scannedRecordsAmountCheckNo
 * @see app/Http/Controllers/StatusController.php:32
 * @route '/details/scanned-records-amount-checkNo'
 */
scannedRecordsAmountCheckNo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: scannedRecordsAmountCheckNo.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StatusController::scannedRecordsAmountCheckNo
 * @see app/Http/Controllers/StatusController.php:32
 * @route '/details/scanned-records-amount-checkNo'
 */
    const scannedRecordsAmountCheckNoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: scannedRecordsAmountCheckNo.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StatusController::scannedRecordsAmountCheckNo
 * @see app/Http/Controllers/StatusController.php:32
 * @route '/details/scanned-records-amount-checkNo'
 */
        scannedRecordsAmountCheckNoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scannedRecordsAmountCheckNo.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StatusController::scannedRecordsAmountCheckNo
 * @see app/Http/Controllers/StatusController.php:32
 * @route '/details/scanned-records-amount-checkNo'
 */
        scannedRecordsAmountCheckNoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scannedRecordsAmountCheckNo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    scannedRecordsAmountCheckNo.form = scannedRecordsAmountCheckNoForm
/**
* @see \App\Http\Controllers\StatusController::scannedRecords
 * @see app/Http/Controllers/StatusController.php:37
 * @route '/details/scanned-records/{id}'
 */
export const scannedRecords = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scannedRecords.url(args, options),
    method: 'get',
})

scannedRecords.definition = {
    methods: ["get","head"],
    url: '/details/scanned-records/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StatusController::scannedRecords
 * @see app/Http/Controllers/StatusController.php:37
 * @route '/details/scanned-records/{id}'
 */
scannedRecords.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return scannedRecords.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StatusController::scannedRecords
 * @see app/Http/Controllers/StatusController.php:37
 * @route '/details/scanned-records/{id}'
 */
scannedRecords.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scannedRecords.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StatusController::scannedRecords
 * @see app/Http/Controllers/StatusController.php:37
 * @route '/details/scanned-records/{id}'
 */
scannedRecords.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: scannedRecords.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StatusController::scannedRecords
 * @see app/Http/Controllers/StatusController.php:37
 * @route '/details/scanned-records/{id}'
 */
    const scannedRecordsForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: scannedRecords.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StatusController::scannedRecords
 * @see app/Http/Controllers/StatusController.php:37
 * @route '/details/scanned-records/{id}'
 */
        scannedRecordsForm.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scannedRecords.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StatusController::scannedRecords
 * @see app/Http/Controllers/StatusController.php:37
 * @route '/details/scanned-records/{id}'
 */
        scannedRecordsForm.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scannedRecords.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    scannedRecords.form = scannedRecordsForm
/**
* @see \App\Http\Controllers\StatusController::checkStatus
 * @see app/Http/Controllers/StatusController.php:27
 * @route '/check-status'
 */
export const checkStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkStatus.url(options),
    method: 'get',
})

checkStatus.definition = {
    methods: ["get","head"],
    url: '/check-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StatusController::checkStatus
 * @see app/Http/Controllers/StatusController.php:27
 * @route '/check-status'
 */
checkStatus.url = (options?: RouteQueryOptions) => {
    return checkStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StatusController::checkStatus
 * @see app/Http/Controllers/StatusController.php:27
 * @route '/check-status'
 */
checkStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkStatus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StatusController::checkStatus
 * @see app/Http/Controllers/StatusController.php:27
 * @route '/check-status'
 */
checkStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkStatus.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StatusController::checkStatus
 * @see app/Http/Controllers/StatusController.php:27
 * @route '/check-status'
 */
    const checkStatusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkStatus.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StatusController::checkStatus
 * @see app/Http/Controllers/StatusController.php:27
 * @route '/check-status'
 */
        checkStatusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkStatus.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StatusController::checkStatus
 * @see app/Http/Controllers/StatusController.php:27
 * @route '/check-status'
 */
        checkStatusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkStatus.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkStatus.form = checkStatusForm
/**
* @see \App\Http\Controllers\StatusController::cancelStale
 * @see app/Http/Controllers/StatusController.php:42
 * @route '/cancel-stale-check/{id}'
 */
export const cancelStale = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelStale.url(args, options),
    method: 'post',
})

cancelStale.definition = {
    methods: ["post"],
    url: '/cancel-stale-check/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StatusController::cancelStale
 * @see app/Http/Controllers/StatusController.php:42
 * @route '/cancel-stale-check/{id}'
 */
cancelStale.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return cancelStale.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StatusController::cancelStale
 * @see app/Http/Controllers/StatusController.php:42
 * @route '/cancel-stale-check/{id}'
 */
cancelStale.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelStale.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\StatusController::cancelStale
 * @see app/Http/Controllers/StatusController.php:42
 * @route '/cancel-stale-check/{id}'
 */
    const cancelStaleForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelStale.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StatusController::cancelStale
 * @see app/Http/Controllers/StatusController.php:42
 * @route '/cancel-stale-check/{id}'
 */
        cancelStaleForm.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelStale.url(args, options),
            method: 'post',
        })
    
    cancelStale.form = cancelStaleForm
const StatusController = { scannedRecordsAmountCheckNo, scannedRecords, checkStatus, cancelStale }

export default StatusController