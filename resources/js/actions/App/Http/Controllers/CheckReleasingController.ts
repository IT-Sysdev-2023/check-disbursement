import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CheckReleasingController::index
 * @see app/Http/Controllers/CheckReleasingController.php:17
 * @route '/section-head/check-releasing/index'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/section-head/check-releasing/index',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckReleasingController::index
 * @see app/Http/Controllers/CheckReleasingController.php:17
 * @route '/section-head/check-releasing/index'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckReleasingController::index
 * @see app/Http/Controllers/CheckReleasingController.php:17
 * @route '/section-head/check-releasing/index'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckReleasingController::index
 * @see app/Http/Controllers/CheckReleasingController.php:17
 * @route '/section-head/check-releasing/index'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckReleasingController::index
 * @see app/Http/Controllers/CheckReleasingController.php:17
 * @route '/section-head/check-releasing/index'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckReleasingController::index
 * @see app/Http/Controllers/CheckReleasingController.php:17
 * @route '/section-head/check-releasing/index'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckReleasingController::index
 * @see app/Http/Controllers/CheckReleasingController.php:17
 * @route '/section-head/check-releasing/index'
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
* @see \App\Http\Controllers\CheckReleasingController::show
 * @see app/Http/Controllers/CheckReleasingController.php:22
 * @route '/section-head/check-releasing/release-check/{checkId}/{status}'
 */
export const show = (args: { checkId: string | number, status: string | number } | [checkId: string | number, status: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/section-head/check-releasing/release-check/{checkId}/{status}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckReleasingController::show
 * @see app/Http/Controllers/CheckReleasingController.php:22
 * @route '/section-head/check-releasing/release-check/{checkId}/{status}'
 */
show.url = (args: { checkId: string | number, status: string | number } | [checkId: string | number, status: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    checkId: args[0],
                    status: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        checkId: args.checkId,
                                status: args.status,
                }

    return show.definition.url
            .replace('{checkId}', parsedArgs.checkId.toString())
            .replace('{status}', parsedArgs.status.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckReleasingController::show
 * @see app/Http/Controllers/CheckReleasingController.php:22
 * @route '/section-head/check-releasing/release-check/{checkId}/{status}'
 */
show.get = (args: { checkId: string | number, status: string | number } | [checkId: string | number, status: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckReleasingController::show
 * @see app/Http/Controllers/CheckReleasingController.php:22
 * @route '/section-head/check-releasing/release-check/{checkId}/{status}'
 */
show.head = (args: { checkId: string | number, status: string | number } | [checkId: string | number, status: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckReleasingController::show
 * @see app/Http/Controllers/CheckReleasingController.php:22
 * @route '/section-head/check-releasing/release-check/{checkId}/{status}'
 */
    const showForm = (args: { checkId: string | number, status: string | number } | [checkId: string | number, status: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckReleasingController::show
 * @see app/Http/Controllers/CheckReleasingController.php:22
 * @route '/section-head/check-releasing/release-check/{checkId}/{status}'
 */
        showForm.get = (args: { checkId: string | number, status: string | number } | [checkId: string | number, status: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckReleasingController::show
 * @see app/Http/Controllers/CheckReleasingController.php:22
 * @route '/section-head/check-releasing/release-check/{checkId}/{status}'
 */
        showForm.head = (args: { checkId: string | number, status: string | number } | [checkId: string | number, status: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\CheckReleasingController::store
 * @see app/Http/Controllers/CheckReleasingController.php:27
 * @route '/section-head/check-releasing/store-release-check/{id}'
 */
export const store = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/section-head/check-releasing/store-release-check/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CheckReleasingController::store
 * @see app/Http/Controllers/CheckReleasingController.php:27
 * @route '/section-head/check-releasing/store-release-check/{id}'
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
* @see \App\Http\Controllers\CheckReleasingController::store
 * @see app/Http/Controllers/CheckReleasingController.php:27
 * @route '/section-head/check-releasing/store-release-check/{id}'
 */
store.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CheckReleasingController::store
 * @see app/Http/Controllers/CheckReleasingController.php:27
 * @route '/section-head/check-releasing/store-release-check/{id}'
 */
    const storeForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CheckReleasingController::store
 * @see app/Http/Controllers/CheckReleasingController.php:27
 * @route '/section-head/check-releasing/store-release-check/{id}'
 */
        storeForm.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const CheckReleasingController = { index, show, store }

export default CheckReleasingController