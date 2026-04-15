import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::users
 * @see app/Http/Controllers/AdminController.php:25
 * @route '/admin/users'
 */
export const users = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

users.definition = {
    methods: ["get","head"],
    url: '/admin/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::users
 * @see app/Http/Controllers/AdminController.php:25
 * @route '/admin/users'
 */
users.url = (options?: RouteQueryOptions) => {
    return users.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::users
 * @see app/Http/Controllers/AdminController.php:25
 * @route '/admin/users'
 */
users.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::users
 * @see app/Http/Controllers/AdminController.php:25
 * @route '/admin/users'
 */
users.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: users.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::users
 * @see app/Http/Controllers/AdminController.php:25
 * @route '/admin/users'
 */
    const usersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: users.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::users
 * @see app/Http/Controllers/AdminController.php:25
 * @route '/admin/users'
 */
        usersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: users.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::users
 * @see app/Http/Controllers/AdminController.php:25
 * @route '/admin/users'
 */
        usersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: users.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    users.form = usersForm
/**
* @see \App\Http\Controllers\AdminController::assign
 * @see app/Http/Controllers/AdminController.php:62
 * @route '/admin/assign/{id}'
 */
export const assign = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: assign.url(args, options),
    method: 'get',
})

assign.definition = {
    methods: ["get","head"],
    url: '/admin/assign/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::assign
 * @see app/Http/Controllers/AdminController.php:62
 * @route '/admin/assign/{id}'
 */
assign.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return assign.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::assign
 * @see app/Http/Controllers/AdminController.php:62
 * @route '/admin/assign/{id}'
 */
assign.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: assign.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::assign
 * @see app/Http/Controllers/AdminController.php:62
 * @route '/admin/assign/{id}'
 */
assign.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: assign.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::assign
 * @see app/Http/Controllers/AdminController.php:62
 * @route '/admin/assign/{id}'
 */
    const assignForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: assign.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::assign
 * @see app/Http/Controllers/AdminController.php:62
 * @route '/admin/assign/{id}'
 */
        assignForm.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: assign.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::assign
 * @see app/Http/Controllers/AdminController.php:62
 * @route '/admin/assign/{id}'
 */
        assignForm.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: assign.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    assign.form = assignForm
/**
* @see \App\Http\Controllers\AdminController::permissions
 * @see app/Http/Controllers/AdminController.php:30
 * @route '/admin/permissions'
 */
export const permissions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: permissions.url(options),
    method: 'get',
})

permissions.definition = {
    methods: ["get","head"],
    url: '/admin/permissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::permissions
 * @see app/Http/Controllers/AdminController.php:30
 * @route '/admin/permissions'
 */
permissions.url = (options?: RouteQueryOptions) => {
    return permissions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::permissions
 * @see app/Http/Controllers/AdminController.php:30
 * @route '/admin/permissions'
 */
permissions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: permissions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::permissions
 * @see app/Http/Controllers/AdminController.php:30
 * @route '/admin/permissions'
 */
permissions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: permissions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::permissions
 * @see app/Http/Controllers/AdminController.php:30
 * @route '/admin/permissions'
 */
    const permissionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: permissions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::permissions
 * @see app/Http/Controllers/AdminController.php:30
 * @route '/admin/permissions'
 */
        permissionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: permissions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::permissions
 * @see app/Http/Controllers/AdminController.php:30
 * @route '/admin/permissions'
 */
        permissionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: permissions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    permissions.form = permissionsForm
/**
* @see \App\Http\Controllers\AdminController::assignPermissions
 * @see app/Http/Controllers/AdminController.php:35
 * @route '/admin/assign-permissions'
 */
export const assignPermissions = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignPermissions.url(options),
    method: 'post',
})

assignPermissions.definition = {
    methods: ["post"],
    url: '/admin/assign-permissions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::assignPermissions
 * @see app/Http/Controllers/AdminController.php:35
 * @route '/admin/assign-permissions'
 */
assignPermissions.url = (options?: RouteQueryOptions) => {
    return assignPermissions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::assignPermissions
 * @see app/Http/Controllers/AdminController.php:35
 * @route '/admin/assign-permissions'
 */
assignPermissions.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignPermissions.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::assignPermissions
 * @see app/Http/Controllers/AdminController.php:35
 * @route '/admin/assign-permissions'
 */
    const assignPermissionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: assignPermissions.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::assignPermissions
 * @see app/Http/Controllers/AdminController.php:35
 * @route '/admin/assign-permissions'
 */
        assignPermissionsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: assignPermissions.url(options),
            method: 'post',
        })
    
    assignPermissions.form = assignPermissionsForm
/**
* @see \App\Http\Controllers\AdminController::storeUser
 * @see app/Http/Controllers/AdminController.php:66
 * @route '/admin/store-user'
 */
export const storeUser = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeUser.url(options),
    method: 'post',
})

storeUser.definition = {
    methods: ["post"],
    url: '/admin/store-user',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeUser
 * @see app/Http/Controllers/AdminController.php:66
 * @route '/admin/store-user'
 */
storeUser.url = (options?: RouteQueryOptions) => {
    return storeUser.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeUser
 * @see app/Http/Controllers/AdminController.php:66
 * @route '/admin/store-user'
 */
storeUser.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeUser.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::storeUser
 * @see app/Http/Controllers/AdminController.php:66
 * @route '/admin/store-user'
 */
    const storeUserForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeUser.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::storeUser
 * @see app/Http/Controllers/AdminController.php:66
 * @route '/admin/store-user'
 */
        storeUserForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeUser.url(options),
            method: 'post',
        })
    
    storeUser.form = storeUserForm
/**
* @see \App\Http\Controllers\AdminController::setupBank
 * @see app/Http/Controllers/AdminController.php:40
 * @route '/admin/setup/bank-setup'
 */
export const setupBank = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: setupBank.url(options),
    method: 'get',
})

setupBank.definition = {
    methods: ["get","head"],
    url: '/admin/setup/bank-setup',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::setupBank
 * @see app/Http/Controllers/AdminController.php:40
 * @route '/admin/setup/bank-setup'
 */
setupBank.url = (options?: RouteQueryOptions) => {
    return setupBank.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::setupBank
 * @see app/Http/Controllers/AdminController.php:40
 * @route '/admin/setup/bank-setup'
 */
setupBank.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: setupBank.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::setupBank
 * @see app/Http/Controllers/AdminController.php:40
 * @route '/admin/setup/bank-setup'
 */
setupBank.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: setupBank.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::setupBank
 * @see app/Http/Controllers/AdminController.php:40
 * @route '/admin/setup/bank-setup'
 */
    const setupBankForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: setupBank.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::setupBank
 * @see app/Http/Controllers/AdminController.php:40
 * @route '/admin/setup/bank-setup'
 */
        setupBankForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: setupBank.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::setupBank
 * @see app/Http/Controllers/AdminController.php:40
 * @route '/admin/setup/bank-setup'
 */
        setupBankForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: setupBank.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    setupBank.form = setupBankForm
/**
* @see \App\Http\Controllers\AdminController::setupBankAccount
 * @see app/Http/Controllers/AdminController.php:45
 * @route '/admin/setup/bank-accout-setup'
 */
export const setupBankAccount = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: setupBankAccount.url(options),
    method: 'get',
})

setupBankAccount.definition = {
    methods: ["get","head"],
    url: '/admin/setup/bank-accout-setup',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::setupBankAccount
 * @see app/Http/Controllers/AdminController.php:45
 * @route '/admin/setup/bank-accout-setup'
 */
setupBankAccount.url = (options?: RouteQueryOptions) => {
    return setupBankAccount.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::setupBankAccount
 * @see app/Http/Controllers/AdminController.php:45
 * @route '/admin/setup/bank-accout-setup'
 */
setupBankAccount.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: setupBankAccount.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::setupBankAccount
 * @see app/Http/Controllers/AdminController.php:45
 * @route '/admin/setup/bank-accout-setup'
 */
setupBankAccount.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: setupBankAccount.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::setupBankAccount
 * @see app/Http/Controllers/AdminController.php:45
 * @route '/admin/setup/bank-accout-setup'
 */
    const setupBankAccountForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: setupBankAccount.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::setupBankAccount
 * @see app/Http/Controllers/AdminController.php:45
 * @route '/admin/setup/bank-accout-setup'
 */
        setupBankAccountForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: setupBankAccount.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::setupBankAccount
 * @see app/Http/Controllers/AdminController.php:45
 * @route '/admin/setup/bank-accout-setup'
 */
        setupBankAccountForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: setupBankAccount.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    setupBankAccount.form = setupBankAccountForm
/**
* @see \App\Http\Controllers\AdminController::storeBank
 * @see app/Http/Controllers/AdminController.php:50
 * @route '/admin/setup/store-bank'
 */
export const storeBank = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeBank.url(options),
    method: 'post',
})

storeBank.definition = {
    methods: ["post"],
    url: '/admin/setup/store-bank',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeBank
 * @see app/Http/Controllers/AdminController.php:50
 * @route '/admin/setup/store-bank'
 */
storeBank.url = (options?: RouteQueryOptions) => {
    return storeBank.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeBank
 * @see app/Http/Controllers/AdminController.php:50
 * @route '/admin/setup/store-bank'
 */
storeBank.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeBank.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::storeBank
 * @see app/Http/Controllers/AdminController.php:50
 * @route '/admin/setup/store-bank'
 */
    const storeBankForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeBank.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::storeBank
 * @see app/Http/Controllers/AdminController.php:50
 * @route '/admin/setup/store-bank'
 */
        storeBankForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeBank.url(options),
            method: 'post',
        })
    
    storeBank.form = storeBankForm
/**
* @see \App\Http\Controllers\AdminController::storeBankAccount
 * @see app/Http/Controllers/AdminController.php:57
 * @route '/admin/setup/store-bank-account'
 */
export const storeBankAccount = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeBankAccount.url(options),
    method: 'post',
})

storeBankAccount.definition = {
    methods: ["post"],
    url: '/admin/setup/store-bank-account',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeBankAccount
 * @see app/Http/Controllers/AdminController.php:57
 * @route '/admin/setup/store-bank-account'
 */
storeBankAccount.url = (options?: RouteQueryOptions) => {
    return storeBankAccount.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeBankAccount
 * @see app/Http/Controllers/AdminController.php:57
 * @route '/admin/setup/store-bank-account'
 */
storeBankAccount.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeBankAccount.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::storeBankAccount
 * @see app/Http/Controllers/AdminController.php:57
 * @route '/admin/setup/store-bank-account'
 */
    const storeBankAccountForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeBankAccount.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::storeBankAccount
 * @see app/Http/Controllers/AdminController.php:57
 * @route '/admin/setup/store-bank-account'
 */
        storeBankAccountForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeBankAccount.url(options),
            method: 'post',
        })
    
    storeBankAccount.form = storeBankAccountForm
const AdminController = { users, assign, permissions, assignPermissions, storeUser, setupBank, setupBankAccount, storeBank, storeBankAccount }

export default AdminController