import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReportController::index
 * @see app/Http/Controllers/ReportController.php:29
 * @route '/reports/report'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reports/report',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportController::index
 * @see app/Http/Controllers/ReportController.php:29
 * @route '/reports/report'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::index
 * @see app/Http/Controllers/ReportController.php:29
 * @route '/reports/report'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportController::index
 * @see app/Http/Controllers/ReportController.php:29
 * @route '/reports/report'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportController::index
 * @see app/Http/Controllers/ReportController.php:29
 * @route '/reports/report'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportController::index
 * @see app/Http/Controllers/ReportController.php:29
 * @route '/reports/report'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportController::index
 * @see app/Http/Controllers/ReportController.php:29
 * @route '/reports/report'
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
* @see \App\Http\Controllers\ReportController::generate
 * @see app/Http/Controllers/ReportController.php:56
 * @route '/reports/generate-report'
 */
export const generate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(options),
    method: 'post',
})

generate.definition = {
    methods: ["post"],
    url: '/reports/generate-report',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReportController::generate
 * @see app/Http/Controllers/ReportController.php:56
 * @route '/reports/generate-report'
 */
generate.url = (options?: RouteQueryOptions) => {
    return generate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::generate
 * @see app/Http/Controllers/ReportController.php:56
 * @route '/reports/generate-report'
 */
generate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ReportController::generate
 * @see app/Http/Controllers/ReportController.php:56
 * @route '/reports/generate-report'
 */
    const generateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ReportController::generate
 * @see app/Http/Controllers/ReportController.php:56
 * @route '/reports/generate-report'
 */
        generateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generate.url(options),
            method: 'post',
        })
    
    generate.form = generateForm
/**
* @see \App\Http\Controllers\ReportController::generatedReports
 * @see app/Http/Controllers/ReportController.php:96
 * @route '/reports/generated-reports'
 */
export const generatedReports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generatedReports.url(options),
    method: 'get',
})

generatedReports.definition = {
    methods: ["get","head"],
    url: '/reports/generated-reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportController::generatedReports
 * @see app/Http/Controllers/ReportController.php:96
 * @route '/reports/generated-reports'
 */
generatedReports.url = (options?: RouteQueryOptions) => {
    return generatedReports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::generatedReports
 * @see app/Http/Controllers/ReportController.php:96
 * @route '/reports/generated-reports'
 */
generatedReports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generatedReports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportController::generatedReports
 * @see app/Http/Controllers/ReportController.php:96
 * @route '/reports/generated-reports'
 */
generatedReports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generatedReports.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportController::generatedReports
 * @see app/Http/Controllers/ReportController.php:96
 * @route '/reports/generated-reports'
 */
    const generatedReportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: generatedReports.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportController::generatedReports
 * @see app/Http/Controllers/ReportController.php:96
 * @route '/reports/generated-reports'
 */
        generatedReportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generatedReports.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportController::generatedReports
 * @see app/Http/Controllers/ReportController.php:96
 * @route '/reports/generated-reports'
 */
        generatedReportsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generatedReports.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    generatedReports.form = generatedReportsForm
/**
* @see \App\Http\Controllers\ReportController::download
 * @see app/Http/Controllers/ReportController.php:122
 * @route '/reports/download-report'
 */
export const download = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/reports/download-report',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportController::download
 * @see app/Http/Controllers/ReportController.php:122
 * @route '/reports/download-report'
 */
download.url = (options?: RouteQueryOptions) => {
    return download.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::download
 * @see app/Http/Controllers/ReportController.php:122
 * @route '/reports/download-report'
 */
download.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportController::download
 * @see app/Http/Controllers/ReportController.php:122
 * @route '/reports/download-report'
 */
download.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportController::download
 * @see app/Http/Controllers/ReportController.php:122
 * @route '/reports/download-report'
 */
    const downloadForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportController::download
 * @see app/Http/Controllers/ReportController.php:122
 * @route '/reports/download-report'
 */
        downloadForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportController::download
 * @see app/Http/Controllers/ReportController.php:122
 * @route '/reports/download-report'
 */
        downloadForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
const ReportController = { index, generate, generatedReports, download }

export default ReportController