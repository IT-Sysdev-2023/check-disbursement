import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CvController::businessUnits
 * @see app/Http/Controllers/CvController.php:37
 * @route '/extract/business-units'
 */
export const businessUnits = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: businessUnits.url(options),
    method: 'get',
})

businessUnits.definition = {
    methods: ["get","head"],
    url: '/extract/business-units',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CvController::businessUnits
 * @see app/Http/Controllers/CvController.php:37
 * @route '/extract/business-units'
 */
businessUnits.url = (options?: RouteQueryOptions) => {
    return businessUnits.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CvController::businessUnits
 * @see app/Http/Controllers/CvController.php:37
 * @route '/extract/business-units'
 */
businessUnits.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: businessUnits.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CvController::businessUnits
 * @see app/Http/Controllers/CvController.php:37
 * @route '/extract/business-units'
 */
businessUnits.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: businessUnits.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CvController::businessUnits
 * @see app/Http/Controllers/CvController.php:37
 * @route '/extract/business-units'
 */
    const businessUnitsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: businessUnits.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CvController::businessUnits
 * @see app/Http/Controllers/CvController.php:37
 * @route '/extract/business-units'
 */
        businessUnitsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: businessUnits.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CvController::businessUnits
 * @see app/Http/Controllers/CvController.php:37
 * @route '/extract/business-units'
 */
        businessUnitsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: businessUnits.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    businessUnits.form = businessUnitsForm
/**
* @see \App\Http\Controllers\CvController::index
 * @see app/Http/Controllers/CvController.php:16
 * @route '/extract/check-voucher/index'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/extract/check-voucher/index',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CvController::index
 * @see app/Http/Controllers/CvController.php:16
 * @route '/extract/check-voucher/index'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CvController::index
 * @see app/Http/Controllers/CvController.php:16
 * @route '/extract/check-voucher/index'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CvController::index
 * @see app/Http/Controllers/CvController.php:16
 * @route '/extract/check-voucher/index'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CvController::index
 * @see app/Http/Controllers/CvController.php:16
 * @route '/extract/check-voucher/index'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CvController::index
 * @see app/Http/Controllers/CvController.php:16
 * @route '/extract/check-voucher/index'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CvController::index
 * @see app/Http/Controllers/CvController.php:16
 * @route '/extract/check-voucher/index'
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
* @see \App\Http\Controllers\CvController::extractCv
 * @see app/Http/Controllers/CvController.php:22
 * @route '/extract/check-voucher/extract-cv'
 */
export const extractCv = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: extractCv.url(options),
    method: 'post',
})

extractCv.definition = {
    methods: ["post"],
    url: '/extract/check-voucher/extract-cv',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CvController::extractCv
 * @see app/Http/Controllers/CvController.php:22
 * @route '/extract/check-voucher/extract-cv'
 */
extractCv.url = (options?: RouteQueryOptions) => {
    return extractCv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CvController::extractCv
 * @see app/Http/Controllers/CvController.php:22
 * @route '/extract/check-voucher/extract-cv'
 */
extractCv.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: extractCv.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CvController::extractCv
 * @see app/Http/Controllers/CvController.php:22
 * @route '/extract/check-voucher/extract-cv'
 */
    const extractCvForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: extractCv.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CvController::extractCv
 * @see app/Http/Controllers/CvController.php:22
 * @route '/extract/check-voucher/extract-cv'
 */
        extractCvForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: extractCv.url(options),
            method: 'post',
        })
    
    extractCv.form = extractCvForm
/**
* @see \App\Http\Controllers\CvController::details
 * @see app/Http/Controllers/CvController.php:27
 * @route '/details/cv/details/{id}'
 */
export const details = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: details.url(args, options),
    method: 'get',
})

details.definition = {
    methods: ["get","head"],
    url: '/details/cv/details/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CvController::details
 * @see app/Http/Controllers/CvController.php:27
 * @route '/details/cv/details/{id}'
 */
details.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return details.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CvController::details
 * @see app/Http/Controllers/CvController.php:27
 * @route '/details/cv/details/{id}'
 */
details.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: details.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CvController::details
 * @see app/Http/Controllers/CvController.php:27
 * @route '/details/cv/details/{id}'
 */
details.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: details.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CvController::details
 * @see app/Http/Controllers/CvController.php:27
 * @route '/details/cv/details/{id}'
 */
    const detailsForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: details.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CvController::details
 * @see app/Http/Controllers/CvController.php:27
 * @route '/details/cv/details/{id}'
 */
        detailsForm.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: details.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CvController::details
 * @see app/Http/Controllers/CvController.php:27
 * @route '/details/cv/details/{id}'
 */
        detailsForm.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: details.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    details.form = detailsForm
/**
* @see \App\Http\Controllers\CvController::signatureDetails
 * @see app/Http/Controllers/CvController.php:32
 * @route '/details/cv/details-signature/{id}'
 */
export const signatureDetails = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: signatureDetails.url(args, options),
    method: 'get',
})

signatureDetails.definition = {
    methods: ["get","head"],
    url: '/details/cv/details-signature/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CvController::signatureDetails
 * @see app/Http/Controllers/CvController.php:32
 * @route '/details/cv/details-signature/{id}'
 */
signatureDetails.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return signatureDetails.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CvController::signatureDetails
 * @see app/Http/Controllers/CvController.php:32
 * @route '/details/cv/details-signature/{id}'
 */
signatureDetails.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: signatureDetails.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CvController::signatureDetails
 * @see app/Http/Controllers/CvController.php:32
 * @route '/details/cv/details-signature/{id}'
 */
signatureDetails.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: signatureDetails.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CvController::signatureDetails
 * @see app/Http/Controllers/CvController.php:32
 * @route '/details/cv/details-signature/{id}'
 */
    const signatureDetailsForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: signatureDetails.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CvController::signatureDetails
 * @see app/Http/Controllers/CvController.php:32
 * @route '/details/cv/details-signature/{id}'
 */
        signatureDetailsForm.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: signatureDetails.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CvController::signatureDetails
 * @see app/Http/Controllers/CvController.php:32
 * @route '/details/cv/details-signature/{id}'
 */
        signatureDetailsForm.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: signatureDetails.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    signatureDetails.form = signatureDetailsForm
const CvController = { businessUnits, index, extractCv, details, signatureDetails }

export default CvController