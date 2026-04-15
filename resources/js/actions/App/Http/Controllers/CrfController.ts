import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CrfController::index
 * @see app/Http/Controllers/CrfController.php:24
 * @route '/extract/crf/index'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/extract/crf/index',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CrfController::index
 * @see app/Http/Controllers/CrfController.php:24
 * @route '/extract/crf/index'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CrfController::index
 * @see app/Http/Controllers/CrfController.php:24
 * @route '/extract/crf/index'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CrfController::index
 * @see app/Http/Controllers/CrfController.php:24
 * @route '/extract/crf/index'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CrfController::index
 * @see app/Http/Controllers/CrfController.php:24
 * @route '/extract/crf/index'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CrfController::index
 * @see app/Http/Controllers/CrfController.php:24
 * @route '/extract/crf/index'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CrfController::index
 * @see app/Http/Controllers/CrfController.php:24
 * @route '/extract/crf/index'
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
* @see \App\Http\Controllers\CrfController::extractCrf
 * @see app/Http/Controllers/CrfController.php:29
 * @route '/extract/crf/extract-crf'
 */
export const extractCrf = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: extractCrf.url(options),
    method: 'post',
})

extractCrf.definition = {
    methods: ["post"],
    url: '/extract/crf/extract-crf',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CrfController::extractCrf
 * @see app/Http/Controllers/CrfController.php:29
 * @route '/extract/crf/extract-crf'
 */
extractCrf.url = (options?: RouteQueryOptions) => {
    return extractCrf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CrfController::extractCrf
 * @see app/Http/Controllers/CrfController.php:29
 * @route '/extract/crf/extract-crf'
 */
extractCrf.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: extractCrf.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CrfController::extractCrf
 * @see app/Http/Controllers/CrfController.php:29
 * @route '/extract/crf/extract-crf'
 */
    const extractCrfForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: extractCrf.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CrfController::extractCrf
 * @see app/Http/Controllers/CrfController.php:29
 * @route '/extract/crf/extract-crf'
 */
        extractCrfForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: extractCrf.url(options),
            method: 'post',
        })
    
    extractCrf.form = extractCrfForm
/**
* @see \App\Http\Controllers\CrfController::detailsCrf
 * @see app/Http/Controllers/CrfController.php:39
 * @route '/details/crf/details/{id}'
 */
export const detailsCrf = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detailsCrf.url(args, options),
    method: 'get',
})

detailsCrf.definition = {
    methods: ["get","head"],
    url: '/details/crf/details/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CrfController::detailsCrf
 * @see app/Http/Controllers/CrfController.php:39
 * @route '/details/crf/details/{id}'
 */
detailsCrf.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return detailsCrf.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CrfController::detailsCrf
 * @see app/Http/Controllers/CrfController.php:39
 * @route '/details/crf/details/{id}'
 */
detailsCrf.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detailsCrf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CrfController::detailsCrf
 * @see app/Http/Controllers/CrfController.php:39
 * @route '/details/crf/details/{id}'
 */
detailsCrf.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: detailsCrf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CrfController::detailsCrf
 * @see app/Http/Controllers/CrfController.php:39
 * @route '/details/crf/details/{id}'
 */
    const detailsCrfForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: detailsCrf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CrfController::detailsCrf
 * @see app/Http/Controllers/CrfController.php:39
 * @route '/details/crf/details/{id}'
 */
        detailsCrfForm.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detailsCrf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CrfController::detailsCrf
 * @see app/Http/Controllers/CrfController.php:39
 * @route '/details/crf/details/{id}'
 */
        detailsCrfForm.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detailsCrf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    detailsCrf.form = detailsCrfForm
const CrfController = { index, extractCrf, detailsCrf }

export default CrfController