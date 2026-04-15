import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ForwardedCheckController::index
 * @see app/Http/Controllers/ForwardedCheckController.php:26
 * @route '/forwarded-check/index'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/forwarded-check/index',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ForwardedCheckController::index
 * @see app/Http/Controllers/ForwardedCheckController.php:26
 * @route '/forwarded-check/index'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ForwardedCheckController::index
 * @see app/Http/Controllers/ForwardedCheckController.php:26
 * @route '/forwarded-check/index'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ForwardedCheckController::index
 * @see app/Http/Controllers/ForwardedCheckController.php:26
 * @route '/forwarded-check/index'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ForwardedCheckController::index
 * @see app/Http/Controllers/ForwardedCheckController.php:26
 * @route '/forwarded-check/index'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ForwardedCheckController::index
 * @see app/Http/Controllers/ForwardedCheckController.php:26
 * @route '/forwarded-check/index'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ForwardedCheckController::index
 * @see app/Http/Controllers/ForwardedCheckController.php:26
 * @route '/forwarded-check/index'
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
* @see \App\Http\Controllers\ForwardedCheckController::showForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:40
 * @route '/forwarded-check/release-check/{id}/{status}'
 */
export const showForwarded = (args: { id: string | number, status: string | number } | [id: string | number, status: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showForwarded.url(args, options),
    method: 'get',
})

showForwarded.definition = {
    methods: ["get","head"],
    url: '/forwarded-check/release-check/{id}/{status}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ForwardedCheckController::showForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:40
 * @route '/forwarded-check/release-check/{id}/{status}'
 */
showForwarded.url = (args: { id: string | number, status: string | number } | [id: string | number, status: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                    status: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                                status: args.status,
                }

    return showForwarded.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{status}', parsedArgs.status.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ForwardedCheckController::showForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:40
 * @route '/forwarded-check/release-check/{id}/{status}'
 */
showForwarded.get = (args: { id: string | number, status: string | number } | [id: string | number, status: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showForwarded.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ForwardedCheckController::showForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:40
 * @route '/forwarded-check/release-check/{id}/{status}'
 */
showForwarded.head = (args: { id: string | number, status: string | number } | [id: string | number, status: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showForwarded.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ForwardedCheckController::showForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:40
 * @route '/forwarded-check/release-check/{id}/{status}'
 */
    const showForwardedForm = (args: { id: string | number, status: string | number } | [id: string | number, status: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showForwarded.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ForwardedCheckController::showForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:40
 * @route '/forwarded-check/release-check/{id}/{status}'
 */
        showForwardedForm.get = (args: { id: string | number, status: string | number } | [id: string | number, status: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showForwarded.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ForwardedCheckController::showForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:40
 * @route '/forwarded-check/release-check/{id}/{status}'
 */
        showForwardedForm.head = (args: { id: string | number, status: string | number } | [id: string | number, status: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showForwarded.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showForwarded.form = showForwardedForm
/**
* @see \App\Http\Controllers\ForwardedCheckController::storeReleaseCheck
 * @see app/Http/Controllers/ForwardedCheckController.php:45
 * @route '/forwarded-check/store-release-check/{id}'
 */
export const storeReleaseCheck = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReleaseCheck.url(args, options),
    method: 'post',
})

storeReleaseCheck.definition = {
    methods: ["post"],
    url: '/forwarded-check/store-release-check/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ForwardedCheckController::storeReleaseCheck
 * @see app/Http/Controllers/ForwardedCheckController.php:45
 * @route '/forwarded-check/store-release-check/{id}'
 */
storeReleaseCheck.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return storeReleaseCheck.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ForwardedCheckController::storeReleaseCheck
 * @see app/Http/Controllers/ForwardedCheckController.php:45
 * @route '/forwarded-check/store-release-check/{id}'
 */
storeReleaseCheck.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReleaseCheck.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ForwardedCheckController::storeReleaseCheck
 * @see app/Http/Controllers/ForwardedCheckController.php:45
 * @route '/forwarded-check/store-release-check/{id}'
 */
    const storeReleaseCheckForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeReleaseCheck.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ForwardedCheckController::storeReleaseCheck
 * @see app/Http/Controllers/ForwardedCheckController.php:45
 * @route '/forwarded-check/store-release-check/{id}'
 */
        storeReleaseCheckForm.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeReleaseCheck.url(args, options),
            method: 'post',
        })
    
    storeReleaseCheck.form = storeReleaseCheckForm
/**
* @see \App\Http\Controllers\ForwardedCheckController::update
 * @see app/Http/Controllers/ForwardedCheckController.php:35
 * @route '/forwarded-check/update-receiver-{id}'
 */
export const update = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/forwarded-check/update-receiver-{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ForwardedCheckController::update
 * @see app/Http/Controllers/ForwardedCheckController.php:35
 * @route '/forwarded-check/update-receiver-{id}'
 */
update.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ForwardedCheckController::update
 * @see app/Http/Controllers/ForwardedCheckController.php:35
 * @route '/forwarded-check/update-receiver-{id}'
 */
update.put = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\ForwardedCheckController::update
 * @see app/Http/Controllers/ForwardedCheckController.php:35
 * @route '/forwarded-check/update-receiver-{id}'
 */
    const updateForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ForwardedCheckController::update
 * @see app/Http/Controllers/ForwardedCheckController.php:35
 * @route '/forwarded-check/update-receiver-{id}'
 */
        updateForm.put = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\ForwardedCheckController::forwardedReleasing
 * @see app/Http/Controllers/ForwardedCheckController.php:50
 * @route '/forwarded-check/releasing'
 */
export const forwardedReleasing = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: forwardedReleasing.url(options),
    method: 'get',
})

forwardedReleasing.definition = {
    methods: ["get","head"],
    url: '/forwarded-check/releasing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ForwardedCheckController::forwardedReleasing
 * @see app/Http/Controllers/ForwardedCheckController.php:50
 * @route '/forwarded-check/releasing'
 */
forwardedReleasing.url = (options?: RouteQueryOptions) => {
    return forwardedReleasing.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ForwardedCheckController::forwardedReleasing
 * @see app/Http/Controllers/ForwardedCheckController.php:50
 * @route '/forwarded-check/releasing'
 */
forwardedReleasing.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: forwardedReleasing.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ForwardedCheckController::forwardedReleasing
 * @see app/Http/Controllers/ForwardedCheckController.php:50
 * @route '/forwarded-check/releasing'
 */
forwardedReleasing.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: forwardedReleasing.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ForwardedCheckController::forwardedReleasing
 * @see app/Http/Controllers/ForwardedCheckController.php:50
 * @route '/forwarded-check/releasing'
 */
    const forwardedReleasingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: forwardedReleasing.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ForwardedCheckController::forwardedReleasing
 * @see app/Http/Controllers/ForwardedCheckController.php:50
 * @route '/forwarded-check/releasing'
 */
        forwardedReleasingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: forwardedReleasing.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ForwardedCheckController::forwardedReleasing
 * @see app/Http/Controllers/ForwardedCheckController.php:50
 * @route '/forwarded-check/releasing'
 */
        forwardedReleasingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: forwardedReleasing.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    forwardedReleasing.form = forwardedReleasingForm
/**
* @see \App\Http\Controllers\ForwardedCheckController::cancelForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:31
 * @route '/forwarded-check/cancel/{id}'
 */
export const cancelForwarded = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelForwarded.url(args, options),
    method: 'post',
})

cancelForwarded.definition = {
    methods: ["post"],
    url: '/forwarded-check/cancel/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ForwardedCheckController::cancelForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:31
 * @route '/forwarded-check/cancel/{id}'
 */
cancelForwarded.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return cancelForwarded.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ForwardedCheckController::cancelForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:31
 * @route '/forwarded-check/cancel/{id}'
 */
cancelForwarded.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelForwarded.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ForwardedCheckController::cancelForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:31
 * @route '/forwarded-check/cancel/{id}'
 */
    const cancelForwardedForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelForwarded.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ForwardedCheckController::cancelForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:31
 * @route '/forwarded-check/cancel/{id}'
 */
        cancelForwardedForm.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelForwarded.url(args, options),
            method: 'post',
        })
    
    cancelForwarded.form = cancelForwardedForm
const ForwardedCheckController = { index, showForwarded, storeReleaseCheck, update, forwardedReleasing, cancelForwarded }

export default ForwardedCheckController