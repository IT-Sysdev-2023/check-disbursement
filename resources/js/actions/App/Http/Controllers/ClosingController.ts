import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ClosingController::index
 * @see app/Http/Controllers/ClosingController.php:19
 * @route '/closing-checks/index'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/closing-checks/index',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClosingController::index
 * @see app/Http/Controllers/ClosingController.php:19
 * @route '/closing-checks/index'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClosingController::index
 * @see app/Http/Controllers/ClosingController.php:19
 * @route '/closing-checks/index'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClosingController::index
 * @see app/Http/Controllers/ClosingController.php:19
 * @route '/closing-checks/index'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClosingController::index
 * @see app/Http/Controllers/ClosingController.php:19
 * @route '/closing-checks/index'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClosingController::index
 * @see app/Http/Controllers/ClosingController.php:19
 * @route '/closing-checks/index'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClosingController::index
 * @see app/Http/Controllers/ClosingController.php:19
 * @route '/closing-checks/index'
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
* @see \App\Http\Controllers\ClosingController::close
 * @see app/Http/Controllers/ClosingController.php:25
 * @route '/closing-checks/mark-close/{id}'
 */
export const close = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

close.definition = {
    methods: ["post"],
    url: '/closing-checks/mark-close/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClosingController::close
 * @see app/Http/Controllers/ClosingController.php:25
 * @route '/closing-checks/mark-close/{id}'
 */
close.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return close.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClosingController::close
 * @see app/Http/Controllers/ClosingController.php:25
 * @route '/closing-checks/mark-close/{id}'
 */
close.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClosingController::close
 * @see app/Http/Controllers/ClosingController.php:25
 * @route '/closing-checks/mark-close/{id}'
 */
    const closeForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: close.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClosingController::close
 * @see app/Http/Controllers/ClosingController.php:25
 * @route '/closing-checks/mark-close/{id}'
 */
        closeForm.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: close.url(args, options),
            method: 'post',
        })
    
    close.form = closeForm
const ClosingController = { index, close }

export default ClosingController