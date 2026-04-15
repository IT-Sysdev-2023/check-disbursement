import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateCheckNumber
 * @see app/Http/Controllers/AssignedCheckNumberController.php:16
 * @route '/retrieved-checks/update-assign-check-number'
 */
export const updateCheckNumber = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateCheckNumber.url(options),
    method: 'put',
})

updateCheckNumber.definition = {
    methods: ["put"],
    url: '/retrieved-checks/update-assign-check-number',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateCheckNumber
 * @see app/Http/Controllers/AssignedCheckNumberController.php:16
 * @route '/retrieved-checks/update-assign-check-number'
 */
updateCheckNumber.url = (options?: RouteQueryOptions) => {
    return updateCheckNumber.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateCheckNumber
 * @see app/Http/Controllers/AssignedCheckNumberController.php:16
 * @route '/retrieved-checks/update-assign-check-number'
 */
updateCheckNumber.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateCheckNumber.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateCheckNumber
 * @see app/Http/Controllers/AssignedCheckNumberController.php:16
 * @route '/retrieved-checks/update-assign-check-number'
 */
    const updateCheckNumberForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateCheckNumber.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateCheckNumber
 * @see app/Http/Controllers/AssignedCheckNumberController.php:16
 * @route '/retrieved-checks/update-assign-check-number'
 */
        updateCheckNumberForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateCheckNumber.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateCheckNumber.form = updateCheckNumberForm
/**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateCheckDate
 * @see app/Http/Controllers/AssignedCheckNumberController.php:21
 * @route '/retrieved-checks/update-assign-check-date'
 */
export const updateCheckDate = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateCheckDate.url(options),
    method: 'put',
})

updateCheckDate.definition = {
    methods: ["put"],
    url: '/retrieved-checks/update-assign-check-date',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateCheckDate
 * @see app/Http/Controllers/AssignedCheckNumberController.php:21
 * @route '/retrieved-checks/update-assign-check-date'
 */
updateCheckDate.url = (options?: RouteQueryOptions) => {
    return updateCheckDate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateCheckDate
 * @see app/Http/Controllers/AssignedCheckNumberController.php:21
 * @route '/retrieved-checks/update-assign-check-date'
 */
updateCheckDate.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateCheckDate.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateCheckDate
 * @see app/Http/Controllers/AssignedCheckNumberController.php:21
 * @route '/retrieved-checks/update-assign-check-date'
 */
    const updateCheckDateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateCheckDate.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateCheckDate
 * @see app/Http/Controllers/AssignedCheckNumberController.php:21
 * @route '/retrieved-checks/update-assign-check-date'
 */
        updateCheckDateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateCheckDate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateCheckDate.form = updateCheckDateForm
const AssignedCheckNumberController = { updateCheckNumber, updateCheckDate }

export default AssignedCheckNumberController