import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RetrievedChecksController::index
 * @see app/Http/Controllers/RetrievedChecksController.php:22
 * @route '/retrieved-checks/index'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/retrieved-checks/index',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RetrievedChecksController::index
 * @see app/Http/Controllers/RetrievedChecksController.php:22
 * @route '/retrieved-checks/index'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RetrievedChecksController::index
 * @see app/Http/Controllers/RetrievedChecksController.php:22
 * @route '/retrieved-checks/index'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RetrievedChecksController::index
 * @see app/Http/Controllers/RetrievedChecksController.php:22
 * @route '/retrieved-checks/index'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RetrievedChecksController::index
 * @see app/Http/Controllers/RetrievedChecksController.php:22
 * @route '/retrieved-checks/index'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RetrievedChecksController::index
 * @see app/Http/Controllers/RetrievedChecksController.php:22
 * @route '/retrieved-checks/index'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RetrievedChecksController::index
 * @see app/Http/Controllers/RetrievedChecksController.php:22
 * @route '/retrieved-checks/index'
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
* @see \App\Http\Controllers\RetrievedChecksController::businessUnits
 * @see app/Http/Controllers/RetrievedChecksController.php:47
 * @route '/retrieved-checks/filter-business-units'
 */
export const businessUnits = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: businessUnits.url(options),
    method: 'get',
})

businessUnits.definition = {
    methods: ["get","head"],
    url: '/retrieved-checks/filter-business-units',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RetrievedChecksController::businessUnits
 * @see app/Http/Controllers/RetrievedChecksController.php:47
 * @route '/retrieved-checks/filter-business-units'
 */
businessUnits.url = (options?: RouteQueryOptions) => {
    return businessUnits.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RetrievedChecksController::businessUnits
 * @see app/Http/Controllers/RetrievedChecksController.php:47
 * @route '/retrieved-checks/filter-business-units'
 */
businessUnits.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: businessUnits.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RetrievedChecksController::businessUnits
 * @see app/Http/Controllers/RetrievedChecksController.php:47
 * @route '/retrieved-checks/filter-business-units'
 */
businessUnits.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: businessUnits.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RetrievedChecksController::businessUnits
 * @see app/Http/Controllers/RetrievedChecksController.php:47
 * @route '/retrieved-checks/filter-business-units'
 */
    const businessUnitsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: businessUnits.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RetrievedChecksController::businessUnits
 * @see app/Http/Controllers/RetrievedChecksController.php:47
 * @route '/retrieved-checks/filter-business-units'
 */
        businessUnitsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: businessUnits.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RetrievedChecksController::businessUnits
 * @see app/Http/Controllers/RetrievedChecksController.php:47
 * @route '/retrieved-checks/filter-business-units'
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
* @see \App\Http\Controllers\RetrievedChecksController::getLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:37
 * @route '/retrieved-checks/get-location'
 */
export const getLocation = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getLocation.url(options),
    method: 'get',
})

getLocation.definition = {
    methods: ["get","head"],
    url: '/retrieved-checks/get-location',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RetrievedChecksController::getLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:37
 * @route '/retrieved-checks/get-location'
 */
getLocation.url = (options?: RouteQueryOptions) => {
    return getLocation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RetrievedChecksController::getLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:37
 * @route '/retrieved-checks/get-location'
 */
getLocation.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getLocation.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RetrievedChecksController::getLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:37
 * @route '/retrieved-checks/get-location'
 */
getLocation.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getLocation.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RetrievedChecksController::getLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:37
 * @route '/retrieved-checks/get-location'
 */
    const getLocationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getLocation.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RetrievedChecksController::getLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:37
 * @route '/retrieved-checks/get-location'
 */
        getLocationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getLocation.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RetrievedChecksController::getLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:37
 * @route '/retrieved-checks/get-location'
 */
        getLocationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getLocation.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getLocation.form = getLocationForm
/**
* @see \App\Http\Controllers\RetrievedChecksController::updateLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:42
 * @route '/retrieved-checks/tag-location'
 */
export const updateLocation = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateLocation.url(options),
    method: 'put',
})

updateLocation.definition = {
    methods: ["put"],
    url: '/retrieved-checks/tag-location',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\RetrievedChecksController::updateLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:42
 * @route '/retrieved-checks/tag-location'
 */
updateLocation.url = (options?: RouteQueryOptions) => {
    return updateLocation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RetrievedChecksController::updateLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:42
 * @route '/retrieved-checks/tag-location'
 */
updateLocation.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateLocation.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\RetrievedChecksController::updateLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:42
 * @route '/retrieved-checks/tag-location'
 */
    const updateLocationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateLocation.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RetrievedChecksController::updateLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:42
 * @route '/retrieved-checks/tag-location'
 */
        updateLocationForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateLocation.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateLocation.form = updateLocationForm
/**
* @see \App\Http\Controllers\RetrievedChecksController::initialScan
 * @see app/Http/Controllers/RetrievedChecksController.php:70
 * @route '/retrieved-checks/initial-scan'
 */
export const initialScan = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initialScan.url(options),
    method: 'post',
})

initialScan.definition = {
    methods: ["post"],
    url: '/retrieved-checks/initial-scan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RetrievedChecksController::initialScan
 * @see app/Http/Controllers/RetrievedChecksController.php:70
 * @route '/retrieved-checks/initial-scan'
 */
initialScan.url = (options?: RouteQueryOptions) => {
    return initialScan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RetrievedChecksController::initialScan
 * @see app/Http/Controllers/RetrievedChecksController.php:70
 * @route '/retrieved-checks/initial-scan'
 */
initialScan.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initialScan.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RetrievedChecksController::initialScan
 * @see app/Http/Controllers/RetrievedChecksController.php:70
 * @route '/retrieved-checks/initial-scan'
 */
    const initialScanForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: initialScan.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RetrievedChecksController::initialScan
 * @see app/Http/Controllers/RetrievedChecksController.php:70
 * @route '/retrieved-checks/initial-scan'
 */
        initialScanForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: initialScan.url(options),
            method: 'post',
        })
    
    initialScan.form = initialScanForm
/**
* @see \App\Http\Controllers\RetrievedChecksController::syncMissingData
 * @see app/Http/Controllers/RetrievedChecksController.php:65
 * @route '/retrieved-checks/sync-missing-data'
 */
export const syncMissingData = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncMissingData.url(options),
    method: 'post',
})

syncMissingData.definition = {
    methods: ["post"],
    url: '/retrieved-checks/sync-missing-data',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RetrievedChecksController::syncMissingData
 * @see app/Http/Controllers/RetrievedChecksController.php:65
 * @route '/retrieved-checks/sync-missing-data'
 */
syncMissingData.url = (options?: RouteQueryOptions) => {
    return syncMissingData.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RetrievedChecksController::syncMissingData
 * @see app/Http/Controllers/RetrievedChecksController.php:65
 * @route '/retrieved-checks/sync-missing-data'
 */
syncMissingData.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncMissingData.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RetrievedChecksController::syncMissingData
 * @see app/Http/Controllers/RetrievedChecksController.php:65
 * @route '/retrieved-checks/sync-missing-data'
 */
    const syncMissingDataForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: syncMissingData.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RetrievedChecksController::syncMissingData
 * @see app/Http/Controllers/RetrievedChecksController.php:65
 * @route '/retrieved-checks/sync-missing-data'
 */
        syncMissingDataForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: syncMissingData.url(options),
            method: 'post',
        })
    
    syncMissingData.form = syncMissingDataForm
const RetrievedChecksController = { index, businessUnits, getLocation, updateLocation, initialScan, syncMissingData }

export default RetrievedChecksController