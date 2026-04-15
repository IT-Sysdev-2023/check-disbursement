import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ScannedRecordsController::scan
 * @see app/Http/Controllers/ScannedRecordsController.php:34
 * @route '/retrieved-checks/scan'
 */
export const scan = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scan.url(options),
    method: 'get',
})

scan.definition = {
    methods: ["get","head"],
    url: '/retrieved-checks/scan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ScannedRecordsController::scan
 * @see app/Http/Controllers/ScannedRecordsController.php:34
 * @route '/retrieved-checks/scan'
 */
scan.url = (options?: RouteQueryOptions) => {
    return scan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScannedRecordsController::scan
 * @see app/Http/Controllers/ScannedRecordsController.php:34
 * @route '/retrieved-checks/scan'
 */
scan.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scan.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ScannedRecordsController::scan
 * @see app/Http/Controllers/ScannedRecordsController.php:34
 * @route '/retrieved-checks/scan'
 */
scan.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: scan.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ScannedRecordsController::scan
 * @see app/Http/Controllers/ScannedRecordsController.php:34
 * @route '/retrieved-checks/scan'
 */
    const scanForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: scan.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ScannedRecordsController::scan
 * @see app/Http/Controllers/ScannedRecordsController.php:34
 * @route '/retrieved-checks/scan'
 */
        scanForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scan.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ScannedRecordsController::scan
 * @see app/Http/Controllers/ScannedRecordsController.php:34
 * @route '/retrieved-checks/scan'
 */
        scanForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scan.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    scan.form = scanForm
/**
* @see \App\Http\Controllers\ScannedRecordsController::getScannedRecords
 * @see app/Http/Controllers/ScannedRecordsController.php:42
 * @route '/retrieved-checks/get-scanned-records/{id}'
 */
export const getScannedRecords = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getScannedRecords.url(args, options),
    method: 'get',
})

getScannedRecords.definition = {
    methods: ["get","head"],
    url: '/retrieved-checks/get-scanned-records/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ScannedRecordsController::getScannedRecords
 * @see app/Http/Controllers/ScannedRecordsController.php:42
 * @route '/retrieved-checks/get-scanned-records/{id}'
 */
getScannedRecords.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return getScannedRecords.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScannedRecordsController::getScannedRecords
 * @see app/Http/Controllers/ScannedRecordsController.php:42
 * @route '/retrieved-checks/get-scanned-records/{id}'
 */
getScannedRecords.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getScannedRecords.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ScannedRecordsController::getScannedRecords
 * @see app/Http/Controllers/ScannedRecordsController.php:42
 * @route '/retrieved-checks/get-scanned-records/{id}'
 */
getScannedRecords.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getScannedRecords.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ScannedRecordsController::getScannedRecords
 * @see app/Http/Controllers/ScannedRecordsController.php:42
 * @route '/retrieved-checks/get-scanned-records/{id}'
 */
    const getScannedRecordsForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getScannedRecords.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ScannedRecordsController::getScannedRecords
 * @see app/Http/Controllers/ScannedRecordsController.php:42
 * @route '/retrieved-checks/get-scanned-records/{id}'
 */
        getScannedRecordsForm.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getScannedRecords.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ScannedRecordsController::getScannedRecords
 * @see app/Http/Controllers/ScannedRecordsController.php:42
 * @route '/retrieved-checks/get-scanned-records/{id}'
 */
        getScannedRecordsForm.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getScannedRecords.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getScannedRecords.form = getScannedRecordsForm
/**
* @see \App\Http\Controllers\ScannedRecordsController::store
 * @see app/Http/Controllers/ScannedRecordsController.php:53
 * @route '/retrieved-checks/store-scan-record/{id}'
 */
export const store = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/retrieved-checks/store-scan-record/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ScannedRecordsController::store
 * @see app/Http/Controllers/ScannedRecordsController.php:53
 * @route '/retrieved-checks/store-scan-record/{id}'
 */
store.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScannedRecordsController::store
 * @see app/Http/Controllers/ScannedRecordsController.php:53
 * @route '/retrieved-checks/store-scan-record/{id}'
 */
store.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ScannedRecordsController::store
 * @see app/Http/Controllers/ScannedRecordsController.php:53
 * @route '/retrieved-checks/store-scan-record/{id}'
 */
    const storeForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ScannedRecordsController::store
 * @see app/Http/Controllers/ScannedRecordsController.php:53
 * @route '/retrieved-checks/store-scan-record/{id}'
 */
        storeForm.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const ScannedRecordsController = { scan, getScannedRecords, store }

export default ScannedRecordsController