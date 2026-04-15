import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BankController::banks
 * @see app/Http/Controllers/BankController.php:10
 * @route '/retrieved-checks/get-banks'
 */
export const banks = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: banks.url(options),
    method: 'get',
})

banks.definition = {
    methods: ["get","head"],
    url: '/retrieved-checks/get-banks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BankController::banks
 * @see app/Http/Controllers/BankController.php:10
 * @route '/retrieved-checks/get-banks'
 */
banks.url = (options?: RouteQueryOptions) => {
    return banks.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BankController::banks
 * @see app/Http/Controllers/BankController.php:10
 * @route '/retrieved-checks/get-banks'
 */
banks.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: banks.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BankController::banks
 * @see app/Http/Controllers/BankController.php:10
 * @route '/retrieved-checks/get-banks'
 */
banks.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: banks.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BankController::banks
 * @see app/Http/Controllers/BankController.php:10
 * @route '/retrieved-checks/get-banks'
 */
    const banksForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: banks.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BankController::banks
 * @see app/Http/Controllers/BankController.php:10
 * @route '/retrieved-checks/get-banks'
 */
        banksForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: banks.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BankController::banks
 * @see app/Http/Controllers/BankController.php:10
 * @route '/retrieved-checks/get-banks'
 */
        banksForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: banks.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    banks.form = banksForm
const BankController = { banks }

export default BankController