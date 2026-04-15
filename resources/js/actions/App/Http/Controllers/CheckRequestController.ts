import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CheckRequestController::borrowedChecks
 * @see app/Http/Controllers/CheckRequestController.php:30
 * @route '/borrowed-checks'
 */
export const borrowedChecks = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: borrowedChecks.url(options),
    method: 'get',
})

borrowedChecks.definition = {
    methods: ["get","head"],
    url: '/borrowed-checks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckRequestController::borrowedChecks
 * @see app/Http/Controllers/CheckRequestController.php:30
 * @route '/borrowed-checks'
 */
borrowedChecks.url = (options?: RouteQueryOptions) => {
    return borrowedChecks.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckRequestController::borrowedChecks
 * @see app/Http/Controllers/CheckRequestController.php:30
 * @route '/borrowed-checks'
 */
borrowedChecks.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: borrowedChecks.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckRequestController::borrowedChecks
 * @see app/Http/Controllers/CheckRequestController.php:30
 * @route '/borrowed-checks'
 */
borrowedChecks.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: borrowedChecks.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckRequestController::borrowedChecks
 * @see app/Http/Controllers/CheckRequestController.php:30
 * @route '/borrowed-checks'
 */
    const borrowedChecksForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: borrowedChecks.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckRequestController::borrowedChecks
 * @see app/Http/Controllers/CheckRequestController.php:30
 * @route '/borrowed-checks'
 */
        borrowedChecksForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: borrowedChecks.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckRequestController::borrowedChecks
 * @see app/Http/Controllers/CheckRequestController.php:30
 * @route '/borrowed-checks'
 */
        borrowedChecksForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: borrowedChecks.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    borrowedChecks.form = borrowedChecksForm
/**
* @see \App\Http\Controllers\CheckRequestController::index
 * @see app/Http/Controllers/CheckRequestController.php:25
 * @route '/section-head/check-receiving/index'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/section-head/check-receiving/index',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckRequestController::index
 * @see app/Http/Controllers/CheckRequestController.php:25
 * @route '/section-head/check-receiving/index'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckRequestController::index
 * @see app/Http/Controllers/CheckRequestController.php:25
 * @route '/section-head/check-receiving/index'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckRequestController::index
 * @see app/Http/Controllers/CheckRequestController.php:25
 * @route '/section-head/check-receiving/index'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckRequestController::index
 * @see app/Http/Controllers/CheckRequestController.php:25
 * @route '/section-head/check-receiving/index'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckRequestController::index
 * @see app/Http/Controllers/CheckRequestController.php:25
 * @route '/section-head/check-receiving/index'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckRequestController::index
 * @see app/Http/Controllers/CheckRequestController.php:25
 * @route '/section-head/check-receiving/index'
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
* @see \App\Http\Controllers\CheckRequestController::borrowedNumberCheques
 * @see app/Http/Controllers/CheckRequestController.php:44
 * @route '/section-head/check-receiving/borrowed-number-cheques/{id}'
 */
export const borrowedNumberCheques = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: borrowedNumberCheques.url(args, options),
    method: 'get',
})

borrowedNumberCheques.definition = {
    methods: ["get","head"],
    url: '/section-head/check-receiving/borrowed-number-cheques/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckRequestController::borrowedNumberCheques
 * @see app/Http/Controllers/CheckRequestController.php:44
 * @route '/section-head/check-receiving/borrowed-number-cheques/{id}'
 */
borrowedNumberCheques.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return borrowedNumberCheques.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckRequestController::borrowedNumberCheques
 * @see app/Http/Controllers/CheckRequestController.php:44
 * @route '/section-head/check-receiving/borrowed-number-cheques/{id}'
 */
borrowedNumberCheques.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: borrowedNumberCheques.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckRequestController::borrowedNumberCheques
 * @see app/Http/Controllers/CheckRequestController.php:44
 * @route '/section-head/check-receiving/borrowed-number-cheques/{id}'
 */
borrowedNumberCheques.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: borrowedNumberCheques.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckRequestController::borrowedNumberCheques
 * @see app/Http/Controllers/CheckRequestController.php:44
 * @route '/section-head/check-receiving/borrowed-number-cheques/{id}'
 */
    const borrowedNumberChequesForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: borrowedNumberCheques.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckRequestController::borrowedNumberCheques
 * @see app/Http/Controllers/CheckRequestController.php:44
 * @route '/section-head/check-receiving/borrowed-number-cheques/{id}'
 */
        borrowedNumberChequesForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: borrowedNumberCheques.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckRequestController::borrowedNumberCheques
 * @see app/Http/Controllers/CheckRequestController.php:44
 * @route '/section-head/check-receiving/borrowed-number-cheques/{id}'
 */
        borrowedNumberChequesForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: borrowedNumberCheques.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    borrowedNumberCheques.form = borrowedNumberChequesForm
/**
* @see \App\Http\Controllers\CheckRequestController::cancelCheck
 * @see app/Http/Controllers/CheckRequestController.php:49
 * @route '/section-head/check-receiving/cancel-check'
 */
export const cancelCheck = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelCheck.url(options),
    method: 'post',
})

cancelCheck.definition = {
    methods: ["post"],
    url: '/section-head/check-receiving/cancel-check',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CheckRequestController::cancelCheck
 * @see app/Http/Controllers/CheckRequestController.php:49
 * @route '/section-head/check-receiving/cancel-check'
 */
cancelCheck.url = (options?: RouteQueryOptions) => {
    return cancelCheck.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckRequestController::cancelCheck
 * @see app/Http/Controllers/CheckRequestController.php:49
 * @route '/section-head/check-receiving/cancel-check'
 */
cancelCheck.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelCheck.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CheckRequestController::cancelCheck
 * @see app/Http/Controllers/CheckRequestController.php:49
 * @route '/section-head/check-receiving/cancel-check'
 */
    const cancelCheckForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelCheck.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CheckRequestController::cancelCheck
 * @see app/Http/Controllers/CheckRequestController.php:49
 * @route '/section-head/check-receiving/cancel-check'
 */
        cancelCheckForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelCheck.url(options),
            method: 'post',
        })
    
    cancelCheck.form = cancelCheckForm
/**
* @see \App\Http\Controllers\CheckRequestController::approver
 * @see app/Http/Controllers/CheckRequestController.php:39
 * @route '/section-head/check-receiving/approver'
 */
export const approver = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: approver.url(options),
    method: 'get',
})

approver.definition = {
    methods: ["get","head"],
    url: '/section-head/check-receiving/approver',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckRequestController::approver
 * @see app/Http/Controllers/CheckRequestController.php:39
 * @route '/section-head/check-receiving/approver'
 */
approver.url = (options?: RouteQueryOptions) => {
    return approver.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckRequestController::approver
 * @see app/Http/Controllers/CheckRequestController.php:39
 * @route '/section-head/check-receiving/approver'
 */
approver.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: approver.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckRequestController::approver
 * @see app/Http/Controllers/CheckRequestController.php:39
 * @route '/section-head/check-receiving/approver'
 */
approver.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: approver.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckRequestController::approver
 * @see app/Http/Controllers/CheckRequestController.php:39
 * @route '/section-head/check-receiving/approver'
 */
    const approverForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: approver.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckRequestController::approver
 * @see app/Http/Controllers/CheckRequestController.php:39
 * @route '/section-head/check-receiving/approver'
 */
        approverForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: approver.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckRequestController::approver
 * @see app/Http/Controllers/CheckRequestController.php:39
 * @route '/section-head/check-receiving/approver'
 */
        approverForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: approver.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    approver.form = approverForm
/**
* @see \App\Http\Controllers\CheckRequestController::approveCheck
 * @see app/Http/Controllers/CheckRequestController.php:35
 * @route '/section-head/check-receiving/approve-check'
 */
export const approveCheck = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: approveCheck.url(options),
    method: 'put',
})

approveCheck.definition = {
    methods: ["put"],
    url: '/section-head/check-receiving/approve-check',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CheckRequestController::approveCheck
 * @see app/Http/Controllers/CheckRequestController.php:35
 * @route '/section-head/check-receiving/approve-check'
 */
approveCheck.url = (options?: RouteQueryOptions) => {
    return approveCheck.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckRequestController::approveCheck
 * @see app/Http/Controllers/CheckRequestController.php:35
 * @route '/section-head/check-receiving/approve-check'
 */
approveCheck.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: approveCheck.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CheckRequestController::approveCheck
 * @see app/Http/Controllers/CheckRequestController.php:35
 * @route '/section-head/check-receiving/approve-check'
 */
    const approveCheckForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approveCheck.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CheckRequestController::approveCheck
 * @see app/Http/Controllers/CheckRequestController.php:35
 * @route '/section-head/check-receiving/approve-check'
 */
        approveCheckForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approveCheck.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    approveCheck.form = approveCheckForm
/**
* @see \App\Http\Controllers\CheckRequestController::changeApprover
 * @see app/Http/Controllers/CheckRequestController.php:54
 * @route '/section-head/check-receiving/change-approver'
 */
export const changeApprover = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: changeApprover.url(options),
    method: 'put',
})

changeApprover.definition = {
    methods: ["put"],
    url: '/section-head/check-receiving/change-approver',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CheckRequestController::changeApprover
 * @see app/Http/Controllers/CheckRequestController.php:54
 * @route '/section-head/check-receiving/change-approver'
 */
changeApprover.url = (options?: RouteQueryOptions) => {
    return changeApprover.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckRequestController::changeApprover
 * @see app/Http/Controllers/CheckRequestController.php:54
 * @route '/section-head/check-receiving/change-approver'
 */
changeApprover.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: changeApprover.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CheckRequestController::changeApprover
 * @see app/Http/Controllers/CheckRequestController.php:54
 * @route '/section-head/check-receiving/change-approver'
 */
    const changeApproverForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: changeApprover.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CheckRequestController::changeApprover
 * @see app/Http/Controllers/CheckRequestController.php:54
 * @route '/section-head/check-receiving/change-approver'
 */
        changeApproverForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: changeApprover.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    changeApprover.form = changeApproverForm
const CheckRequestController = { borrowedChecks, index, borrowedNumberCheques, cancelCheck, approver, approveCheck, changeApprover }

export default CheckRequestController