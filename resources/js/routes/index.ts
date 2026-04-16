import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../wayfinder'
/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:20
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:20
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:20
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:20
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:20
 * @route '/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:20
 * @route '/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:20
 * @route '/login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::logout
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:54
 * @route '/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::logout
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:54
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::logout
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:54
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::logout
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:54
 * @route '/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::logout
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:54
 * @route '/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm
/**
 * @see routes/web.php:25
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:25
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:25
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:25
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:25
 * @route '/'
 */
    const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: home.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:25
 * @route '/'
 */
        homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:25
 * @route '/'
 */
        homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    home.form = homeForm
/**
* @see \App\Http\Controllers\DashboardController::dashboard
 * @see app/Http/Controllers/DashboardController.php:19
 * @route '/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::dashboard
 * @see app/Http/Controllers/DashboardController.php:19
 * @route '/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::dashboard
 * @see app/Http/Controllers/DashboardController.php:19
 * @route '/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::dashboard
 * @see app/Http/Controllers/DashboardController.php:19
 * @route '/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::dashboard
 * @see app/Http/Controllers/DashboardController.php:19
 * @route '/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::dashboard
 * @see app/Http/Controllers/DashboardController.php:19
 * @route '/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::dashboard
 * @see app/Http/Controllers/DashboardController.php:19
 * @route '/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
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
* @see \App\Http\Controllers\AdminController::bankSetup
 * @see app/Http/Controllers/AdminController.php:40
 * @route '/admin/setup/bank-setup'
 */
export const bankSetup = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bankSetup.url(options),
    method: 'get',
})

bankSetup.definition = {
    methods: ["get","head"],
    url: '/admin/setup/bank-setup',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::bankSetup
 * @see app/Http/Controllers/AdminController.php:40
 * @route '/admin/setup/bank-setup'
 */
bankSetup.url = (options?: RouteQueryOptions) => {
    return bankSetup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::bankSetup
 * @see app/Http/Controllers/AdminController.php:40
 * @route '/admin/setup/bank-setup'
 */
bankSetup.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bankSetup.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::bankSetup
 * @see app/Http/Controllers/AdminController.php:40
 * @route '/admin/setup/bank-setup'
 */
bankSetup.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bankSetup.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::bankSetup
 * @see app/Http/Controllers/AdminController.php:40
 * @route '/admin/setup/bank-setup'
 */
    const bankSetupForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: bankSetup.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::bankSetup
 * @see app/Http/Controllers/AdminController.php:40
 * @route '/admin/setup/bank-setup'
 */
        bankSetupForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bankSetup.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::bankSetup
 * @see app/Http/Controllers/AdminController.php:40
 * @route '/admin/setup/bank-setup'
 */
        bankSetupForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bankSetup.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    bankSetup.form = bankSetupForm
/**
* @see \App\Http\Controllers\AdminController::bankAccountSetup
 * @see app/Http/Controllers/AdminController.php:45
 * @route '/admin/setup/bank-accout-setup'
 */
export const bankAccountSetup = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bankAccountSetup.url(options),
    method: 'get',
})

bankAccountSetup.definition = {
    methods: ["get","head"],
    url: '/admin/setup/bank-accout-setup',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::bankAccountSetup
 * @see app/Http/Controllers/AdminController.php:45
 * @route '/admin/setup/bank-accout-setup'
 */
bankAccountSetup.url = (options?: RouteQueryOptions) => {
    return bankAccountSetup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::bankAccountSetup
 * @see app/Http/Controllers/AdminController.php:45
 * @route '/admin/setup/bank-accout-setup'
 */
bankAccountSetup.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bankAccountSetup.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::bankAccountSetup
 * @see app/Http/Controllers/AdminController.php:45
 * @route '/admin/setup/bank-accout-setup'
 */
bankAccountSetup.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bankAccountSetup.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::bankAccountSetup
 * @see app/Http/Controllers/AdminController.php:45
 * @route '/admin/setup/bank-accout-setup'
 */
    const bankAccountSetupForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: bankAccountSetup.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::bankAccountSetup
 * @see app/Http/Controllers/AdminController.php:45
 * @route '/admin/setup/bank-accout-setup'
 */
        bankAccountSetupForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bankAccountSetup.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::bankAccountSetup
 * @see app/Http/Controllers/AdminController.php:45
 * @route '/admin/setup/bank-accout-setup'
 */
        bankAccountSetupForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bankAccountSetup.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    bankAccountSetup.form = bankAccountSetupForm
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
/**
* @see \App\Http\Controllers\CvController::getBusinessUnits
 * @see app/Http/Controllers/CvController.php:37
 * @route '/extract/business-units'
 */
export const getBusinessUnits = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getBusinessUnits.url(options),
    method: 'get',
})

getBusinessUnits.definition = {
    methods: ["get","head"],
    url: '/extract/business-units',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CvController::getBusinessUnits
 * @see app/Http/Controllers/CvController.php:37
 * @route '/extract/business-units'
 */
getBusinessUnits.url = (options?: RouteQueryOptions) => {
    return getBusinessUnits.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CvController::getBusinessUnits
 * @see app/Http/Controllers/CvController.php:37
 * @route '/extract/business-units'
 */
getBusinessUnits.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getBusinessUnits.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CvController::getBusinessUnits
 * @see app/Http/Controllers/CvController.php:37
 * @route '/extract/business-units'
 */
getBusinessUnits.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getBusinessUnits.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CvController::getBusinessUnits
 * @see app/Http/Controllers/CvController.php:37
 * @route '/extract/business-units'
 */
    const getBusinessUnitsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getBusinessUnits.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CvController::getBusinessUnits
 * @see app/Http/Controllers/CvController.php:37
 * @route '/extract/business-units'
 */
        getBusinessUnitsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getBusinessUnits.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CvController::getBusinessUnits
 * @see app/Http/Controllers/CvController.php:37
 * @route '/extract/business-units'
 */
        getBusinessUnitsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getBusinessUnits.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getBusinessUnits.form = getBusinessUnitsForm
/**
* @see \App\Http\Controllers\CvController::checkVoucher
 * @see app/Http/Controllers/CvController.php:16
 * @route '/extract/check-voucher/index'
 */
export const checkVoucher = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkVoucher.url(options),
    method: 'get',
})

checkVoucher.definition = {
    methods: ["get","head"],
    url: '/extract/check-voucher/index',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CvController::checkVoucher
 * @see app/Http/Controllers/CvController.php:16
 * @route '/extract/check-voucher/index'
 */
checkVoucher.url = (options?: RouteQueryOptions) => {
    return checkVoucher.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CvController::checkVoucher
 * @see app/Http/Controllers/CvController.php:16
 * @route '/extract/check-voucher/index'
 */
checkVoucher.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkVoucher.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CvController::checkVoucher
 * @see app/Http/Controllers/CvController.php:16
 * @route '/extract/check-voucher/index'
 */
checkVoucher.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkVoucher.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CvController::checkVoucher
 * @see app/Http/Controllers/CvController.php:16
 * @route '/extract/check-voucher/index'
 */
    const checkVoucherForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkVoucher.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CvController::checkVoucher
 * @see app/Http/Controllers/CvController.php:16
 * @route '/extract/check-voucher/index'
 */
        checkVoucherForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkVoucher.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CvController::checkVoucher
 * @see app/Http/Controllers/CvController.php:16
 * @route '/extract/check-voucher/index'
 */
        checkVoucherForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkVoucher.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkVoucher.form = checkVoucherForm
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
* @see \App\Http\Controllers\CrfController::checkRequestForm
 * @see app/Http/Controllers/CrfController.php:24
 * @route '/extract/crf/index'
 */
export const checkRequestForm = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkRequestForm.url(options),
    method: 'get',
})

checkRequestForm.definition = {
    methods: ["get","head"],
    url: '/extract/crf/index',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CrfController::checkRequestForm
 * @see app/Http/Controllers/CrfController.php:24
 * @route '/extract/crf/index'
 */
checkRequestForm.url = (options?: RouteQueryOptions) => {
    return checkRequestForm.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CrfController::checkRequestForm
 * @see app/Http/Controllers/CrfController.php:24
 * @route '/extract/crf/index'
 */
checkRequestForm.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkRequestForm.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CrfController::checkRequestForm
 * @see app/Http/Controllers/CrfController.php:24
 * @route '/extract/crf/index'
 */
checkRequestForm.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkRequestForm.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CrfController::checkRequestForm
 * @see app/Http/Controllers/CrfController.php:24
 * @route '/extract/crf/index'
 */
    const checkRequestFormForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkRequestForm.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CrfController::checkRequestForm
 * @see app/Http/Controllers/CrfController.php:24
 * @route '/extract/crf/index'
 */
        checkRequestFormForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkRequestForm.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CrfController::checkRequestForm
 * @see app/Http/Controllers/CrfController.php:24
 * @route '/extract/crf/index'
 */
        checkRequestFormForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkRequestForm.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkRequestForm.form = checkRequestFormForm
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
* @see \App\Http\Controllers\RetrievedChecksController::retrievedRecords
 * @see app/Http/Controllers/RetrievedChecksController.php:19
 * @route '/retrieved-checks/index'
 */
export const retrievedRecords = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: retrievedRecords.url(options),
    method: 'get',
})

retrievedRecords.definition = {
    methods: ["get","head"],
    url: '/retrieved-checks/index',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RetrievedChecksController::retrievedRecords
 * @see app/Http/Controllers/RetrievedChecksController.php:19
 * @route '/retrieved-checks/index'
 */
retrievedRecords.url = (options?: RouteQueryOptions) => {
    return retrievedRecords.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RetrievedChecksController::retrievedRecords
 * @see app/Http/Controllers/RetrievedChecksController.php:19
 * @route '/retrieved-checks/index'
 */
retrievedRecords.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: retrievedRecords.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RetrievedChecksController::retrievedRecords
 * @see app/Http/Controllers/RetrievedChecksController.php:19
 * @route '/retrieved-checks/index'
 */
retrievedRecords.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: retrievedRecords.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RetrievedChecksController::retrievedRecords
 * @see app/Http/Controllers/RetrievedChecksController.php:19
 * @route '/retrieved-checks/index'
 */
    const retrievedRecordsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: retrievedRecords.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RetrievedChecksController::retrievedRecords
 * @see app/Http/Controllers/RetrievedChecksController.php:19
 * @route '/retrieved-checks/index'
 */
        retrievedRecordsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: retrievedRecords.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RetrievedChecksController::retrievedRecords
 * @see app/Http/Controllers/RetrievedChecksController.php:19
 * @route '/retrieved-checks/index'
 */
        retrievedRecordsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: retrievedRecords.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    retrievedRecords.form = retrievedRecordsForm
/**
* @see \App\Http\Controllers\RetrievedChecksController::filterBusinessUnits
 * @see app/Http/Controllers/RetrievedChecksController.php:44
 * @route '/retrieved-checks/filter-business-units'
 */
export const filterBusinessUnits = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: filterBusinessUnits.url(options),
    method: 'get',
})

filterBusinessUnits.definition = {
    methods: ["get","head"],
    url: '/retrieved-checks/filter-business-units',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RetrievedChecksController::filterBusinessUnits
 * @see app/Http/Controllers/RetrievedChecksController.php:44
 * @route '/retrieved-checks/filter-business-units'
 */
filterBusinessUnits.url = (options?: RouteQueryOptions) => {
    return filterBusinessUnits.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RetrievedChecksController::filterBusinessUnits
 * @see app/Http/Controllers/RetrievedChecksController.php:44
 * @route '/retrieved-checks/filter-business-units'
 */
filterBusinessUnits.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: filterBusinessUnits.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RetrievedChecksController::filterBusinessUnits
 * @see app/Http/Controllers/RetrievedChecksController.php:44
 * @route '/retrieved-checks/filter-business-units'
 */
filterBusinessUnits.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: filterBusinessUnits.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RetrievedChecksController::filterBusinessUnits
 * @see app/Http/Controllers/RetrievedChecksController.php:44
 * @route '/retrieved-checks/filter-business-units'
 */
    const filterBusinessUnitsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: filterBusinessUnits.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RetrievedChecksController::filterBusinessUnits
 * @see app/Http/Controllers/RetrievedChecksController.php:44
 * @route '/retrieved-checks/filter-business-units'
 */
        filterBusinessUnitsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: filterBusinessUnits.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RetrievedChecksController::filterBusinessUnits
 * @see app/Http/Controllers/RetrievedChecksController.php:44
 * @route '/retrieved-checks/filter-business-units'
 */
        filterBusinessUnitsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: filterBusinessUnits.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    filterBusinessUnits.form = filterBusinessUnitsForm
/**
* @see \App\Http\Controllers\BorrowedCheckController::borrowerNames
 * @see app/Http/Controllers/BorrowedCheckController.php:22
 * @route '/retrieved-checks/get-borrower-names'
 */
export const borrowerNames = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: borrowerNames.url(options),
    method: 'get',
})

borrowerNames.definition = {
    methods: ["get","head"],
    url: '/retrieved-checks/get-borrower-names',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BorrowedCheckController::borrowerNames
 * @see app/Http/Controllers/BorrowedCheckController.php:22
 * @route '/retrieved-checks/get-borrower-names'
 */
borrowerNames.url = (options?: RouteQueryOptions) => {
    return borrowerNames.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BorrowedCheckController::borrowerNames
 * @see app/Http/Controllers/BorrowedCheckController.php:22
 * @route '/retrieved-checks/get-borrower-names'
 */
borrowerNames.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: borrowerNames.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BorrowedCheckController::borrowerNames
 * @see app/Http/Controllers/BorrowedCheckController.php:22
 * @route '/retrieved-checks/get-borrower-names'
 */
borrowerNames.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: borrowerNames.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BorrowedCheckController::borrowerNames
 * @see app/Http/Controllers/BorrowedCheckController.php:22
 * @route '/retrieved-checks/get-borrower-names'
 */
    const borrowerNamesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: borrowerNames.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BorrowedCheckController::borrowerNames
 * @see app/Http/Controllers/BorrowedCheckController.php:22
 * @route '/retrieved-checks/get-borrower-names'
 */
        borrowerNamesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: borrowerNames.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BorrowedCheckController::borrowerNames
 * @see app/Http/Controllers/BorrowedCheckController.php:22
 * @route '/retrieved-checks/get-borrower-names'
 */
        borrowerNamesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: borrowerNames.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    borrowerNames.form = borrowerNamesForm
/**
* @see \App\Http\Controllers\BorrowedCheckController::borrowCheck
 * @see app/Http/Controllers/BorrowedCheckController.php:17
 * @route '/retrieved-checks/store-borrow-check'
 */
export const borrowCheck = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: borrowCheck.url(options),
    method: 'post',
})

borrowCheck.definition = {
    methods: ["post"],
    url: '/retrieved-checks/store-borrow-check',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BorrowedCheckController::borrowCheck
 * @see app/Http/Controllers/BorrowedCheckController.php:17
 * @route '/retrieved-checks/store-borrow-check'
 */
borrowCheck.url = (options?: RouteQueryOptions) => {
    return borrowCheck.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BorrowedCheckController::borrowCheck
 * @see app/Http/Controllers/BorrowedCheckController.php:17
 * @route '/retrieved-checks/store-borrow-check'
 */
borrowCheck.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: borrowCheck.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BorrowedCheckController::borrowCheck
 * @see app/Http/Controllers/BorrowedCheckController.php:17
 * @route '/retrieved-checks/store-borrow-check'
 */
    const borrowCheckForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: borrowCheck.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BorrowedCheckController::borrowCheck
 * @see app/Http/Controllers/BorrowedCheckController.php:17
 * @route '/retrieved-checks/store-borrow-check'
 */
        borrowCheckForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: borrowCheck.url(options),
            method: 'post',
        })
    
    borrowCheck.form = borrowCheckForm
/**
* @see \App\Http\Controllers\RetrievedChecksController::getLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:34
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
 * @see app/Http/Controllers/RetrievedChecksController.php:34
 * @route '/retrieved-checks/get-location'
 */
getLocation.url = (options?: RouteQueryOptions) => {
    return getLocation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RetrievedChecksController::getLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:34
 * @route '/retrieved-checks/get-location'
 */
getLocation.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getLocation.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RetrievedChecksController::getLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:34
 * @route '/retrieved-checks/get-location'
 */
getLocation.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getLocation.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RetrievedChecksController::getLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:34
 * @route '/retrieved-checks/get-location'
 */
    const getLocationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getLocation.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RetrievedChecksController::getLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:34
 * @route '/retrieved-checks/get-location'
 */
        getLocationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getLocation.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RetrievedChecksController::getLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:34
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
* @see \App\Http\Controllers\RetrievedChecksController::tagLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:39
 * @route '/retrieved-checks/tag-location'
 */
export const tagLocation = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: tagLocation.url(options),
    method: 'put',
})

tagLocation.definition = {
    methods: ["put"],
    url: '/retrieved-checks/tag-location',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\RetrievedChecksController::tagLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:39
 * @route '/retrieved-checks/tag-location'
 */
tagLocation.url = (options?: RouteQueryOptions) => {
    return tagLocation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RetrievedChecksController::tagLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:39
 * @route '/retrieved-checks/tag-location'
 */
tagLocation.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: tagLocation.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\RetrievedChecksController::tagLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:39
 * @route '/retrieved-checks/tag-location'
 */
    const tagLocationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: tagLocation.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RetrievedChecksController::tagLocation
 * @see app/Http/Controllers/RetrievedChecksController.php:39
 * @route '/retrieved-checks/tag-location'
 */
        tagLocationForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: tagLocation.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    tagLocation.form = tagLocationForm
/**
* @see \App\Http\Controllers\BorrowedCheckController::pendingDetails
 * @see app/Http/Controllers/BorrowedCheckController.php:27
 * @route '/retrieved-checks/pending-details/{id}'
 */
export const pendingDetails = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingDetails.url(args, options),
    method: 'get',
})

pendingDetails.definition = {
    methods: ["get","head"],
    url: '/retrieved-checks/pending-details/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BorrowedCheckController::pendingDetails
 * @see app/Http/Controllers/BorrowedCheckController.php:27
 * @route '/retrieved-checks/pending-details/{id}'
 */
pendingDetails.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return pendingDetails.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BorrowedCheckController::pendingDetails
 * @see app/Http/Controllers/BorrowedCheckController.php:27
 * @route '/retrieved-checks/pending-details/{id}'
 */
pendingDetails.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingDetails.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BorrowedCheckController::pendingDetails
 * @see app/Http/Controllers/BorrowedCheckController.php:27
 * @route '/retrieved-checks/pending-details/{id}'
 */
pendingDetails.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pendingDetails.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BorrowedCheckController::pendingDetails
 * @see app/Http/Controllers/BorrowedCheckController.php:27
 * @route '/retrieved-checks/pending-details/{id}'
 */
    const pendingDetailsForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pendingDetails.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BorrowedCheckController::pendingDetails
 * @see app/Http/Controllers/BorrowedCheckController.php:27
 * @route '/retrieved-checks/pending-details/{id}'
 */
        pendingDetailsForm.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pendingDetails.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BorrowedCheckController::pendingDetails
 * @see app/Http/Controllers/BorrowedCheckController.php:27
 * @route '/retrieved-checks/pending-details/{id}'
 */
        pendingDetailsForm.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pendingDetails.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pendingDetails.form = pendingDetailsForm
/**
* @see \App\Http\Controllers\ScannedRecordsController::scan
 * @see app/Http/Controllers/ScannedRecordsController.php:34
 * @route '/retrieved-checks/scan'
 */
export const scan = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scan.url(options),
    method: 'get',
})

scan.definition = {
    methods: ["get","head"],
    url: '/retrieved-checks/scan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ScannedRecordsController::scan
 * @see app/Http/Controllers/ScannedRecordsController.php:34
 * @route '/retrieved-checks/scan'
 */
scan.url = (options?: RouteQueryOptions) => {
    return scan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScannedRecordsController::scan
 * @see app/Http/Controllers/ScannedRecordsController.php:34
 * @route '/retrieved-checks/scan'
 */
scan.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scan.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ScannedRecordsController::scan
 * @see app/Http/Controllers/ScannedRecordsController.php:34
 * @route '/retrieved-checks/scan'
 */
scan.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: scan.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ScannedRecordsController::scan
 * @see app/Http/Controllers/ScannedRecordsController.php:34
 * @route '/retrieved-checks/scan'
 */
    const scanForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: scan.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ScannedRecordsController::scan
 * @see app/Http/Controllers/ScannedRecordsController.php:34
 * @route '/retrieved-checks/scan'
 */
        scanForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scan.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ScannedRecordsController::scan
 * @see app/Http/Controllers/ScannedRecordsController.php:34
 * @route '/retrieved-checks/scan'
 */
        scanForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scan.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    scan.form = scanForm
/**
* @see \App\Http\Controllers\ScannedRecordsController::getScannedRecords
 * @see app/Http/Controllers/ScannedRecordsController.php:42
 * @route '/retrieved-checks/get-scanned-records/{id}'
 */
export const getScannedRecords = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getScannedRecords.url(args, options),
    method: 'get',
})

getScannedRecords.definition = {
    methods: ["get","head"],
    url: '/retrieved-checks/get-scanned-records/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ScannedRecordsController::getScannedRecords
 * @see app/Http/Controllers/ScannedRecordsController.php:42
 * @route '/retrieved-checks/get-scanned-records/{id}'
 */
getScannedRecords.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return getScannedRecords.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScannedRecordsController::getScannedRecords
 * @see app/Http/Controllers/ScannedRecordsController.php:42
 * @route '/retrieved-checks/get-scanned-records/{id}'
 */
getScannedRecords.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getScannedRecords.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ScannedRecordsController::getScannedRecords
 * @see app/Http/Controllers/ScannedRecordsController.php:42
 * @route '/retrieved-checks/get-scanned-records/{id}'
 */
getScannedRecords.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getScannedRecords.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ScannedRecordsController::getScannedRecords
 * @see app/Http/Controllers/ScannedRecordsController.php:42
 * @route '/retrieved-checks/get-scanned-records/{id}'
 */
    const getScannedRecordsForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getScannedRecords.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ScannedRecordsController::getScannedRecords
 * @see app/Http/Controllers/ScannedRecordsController.php:42
 * @route '/retrieved-checks/get-scanned-records/{id}'
 */
        getScannedRecordsForm.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getScannedRecords.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ScannedRecordsController::getScannedRecords
 * @see app/Http/Controllers/ScannedRecordsController.php:42
 * @route '/retrieved-checks/get-scanned-records/{id}'
 */
        getScannedRecordsForm.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getScannedRecords.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getScannedRecords.form = getScannedRecordsForm
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
/**
* @see \App\Http\Controllers\ScannedRecordsController::storeScanRecord
 * @see app/Http/Controllers/ScannedRecordsController.php:53
 * @route '/retrieved-checks/store-scan-record/{id}'
 */
export const storeScanRecord = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeScanRecord.url(args, options),
    method: 'post',
})

storeScanRecord.definition = {
    methods: ["post"],
    url: '/retrieved-checks/store-scan-record/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ScannedRecordsController::storeScanRecord
 * @see app/Http/Controllers/ScannedRecordsController.php:53
 * @route '/retrieved-checks/store-scan-record/{id}'
 */
storeScanRecord.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return storeScanRecord.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScannedRecordsController::storeScanRecord
 * @see app/Http/Controllers/ScannedRecordsController.php:53
 * @route '/retrieved-checks/store-scan-record/{id}'
 */
storeScanRecord.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeScanRecord.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ScannedRecordsController::storeScanRecord
 * @see app/Http/Controllers/ScannedRecordsController.php:53
 * @route '/retrieved-checks/store-scan-record/{id}'
 */
    const storeScanRecordForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeScanRecord.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ScannedRecordsController::storeScanRecord
 * @see app/Http/Controllers/ScannedRecordsController.php:53
 * @route '/retrieved-checks/store-scan-record/{id}'
 */
        storeScanRecordForm.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeScanRecord.url(args, options),
            method: 'post',
        })
    
    storeScanRecord.form = storeScanRecordForm
/**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateAssignCheckNumber
 * @see app/Http/Controllers/AssignedCheckNumberController.php:16
 * @route '/retrieved-checks/update-assign-check-number'
 */
export const updateAssignCheckNumber = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateAssignCheckNumber.url(options),
    method: 'put',
})

updateAssignCheckNumber.definition = {
    methods: ["put"],
    url: '/retrieved-checks/update-assign-check-number',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateAssignCheckNumber
 * @see app/Http/Controllers/AssignedCheckNumberController.php:16
 * @route '/retrieved-checks/update-assign-check-number'
 */
updateAssignCheckNumber.url = (options?: RouteQueryOptions) => {
    return updateAssignCheckNumber.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateAssignCheckNumber
 * @see app/Http/Controllers/AssignedCheckNumberController.php:16
 * @route '/retrieved-checks/update-assign-check-number'
 */
updateAssignCheckNumber.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateAssignCheckNumber.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateAssignCheckNumber
 * @see app/Http/Controllers/AssignedCheckNumberController.php:16
 * @route '/retrieved-checks/update-assign-check-number'
 */
    const updateAssignCheckNumberForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateAssignCheckNumber.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateAssignCheckNumber
 * @see app/Http/Controllers/AssignedCheckNumberController.php:16
 * @route '/retrieved-checks/update-assign-check-number'
 */
        updateAssignCheckNumberForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateAssignCheckNumber.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateAssignCheckNumber.form = updateAssignCheckNumberForm
/**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateAssignCheckDate
 * @see app/Http/Controllers/AssignedCheckNumberController.php:21
 * @route '/retrieved-checks/update-assign-check-date'
 */
export const updateAssignCheckDate = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateAssignCheckDate.url(options),
    method: 'put',
})

updateAssignCheckDate.definition = {
    methods: ["put"],
    url: '/retrieved-checks/update-assign-check-date',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateAssignCheckDate
 * @see app/Http/Controllers/AssignedCheckNumberController.php:21
 * @route '/retrieved-checks/update-assign-check-date'
 */
updateAssignCheckDate.url = (options?: RouteQueryOptions) => {
    return updateAssignCheckDate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateAssignCheckDate
 * @see app/Http/Controllers/AssignedCheckNumberController.php:21
 * @route '/retrieved-checks/update-assign-check-date'
 */
updateAssignCheckDate.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateAssignCheckDate.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateAssignCheckDate
 * @see app/Http/Controllers/AssignedCheckNumberController.php:21
 * @route '/retrieved-checks/update-assign-check-date'
 */
    const updateAssignCheckDateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateAssignCheckDate.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AssignedCheckNumberController::updateAssignCheckDate
 * @see app/Http/Controllers/AssignedCheckNumberController.php:21
 * @route '/retrieved-checks/update-assign-check-date'
 */
        updateAssignCheckDateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateAssignCheckDate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateAssignCheckDate.form = updateAssignCheckDateForm
/**
* @see \App\Http\Controllers\RetrievedChecksController::syncMissingData
 * @see app/Http/Controllers/RetrievedChecksController.php:62
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
 * @see app/Http/Controllers/RetrievedChecksController.php:62
 * @route '/retrieved-checks/sync-missing-data'
 */
syncMissingData.url = (options?: RouteQueryOptions) => {
    return syncMissingData.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RetrievedChecksController::syncMissingData
 * @see app/Http/Controllers/RetrievedChecksController.php:62
 * @route '/retrieved-checks/sync-missing-data'
 */
syncMissingData.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncMissingData.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RetrievedChecksController::syncMissingData
 * @see app/Http/Controllers/RetrievedChecksController.php:62
 * @route '/retrieved-checks/sync-missing-data'
 */
    const syncMissingDataForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: syncMissingData.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RetrievedChecksController::syncMissingData
 * @see app/Http/Controllers/RetrievedChecksController.php:62
 * @route '/retrieved-checks/sync-missing-data'
 */
        syncMissingDataForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: syncMissingData.url(options),
            method: 'post',
        })
    
    syncMissingData.form = syncMissingDataForm
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
/**
* @see \App\Http\Controllers\StatusController::scannedRecordsAmountCheckNo
 * @see app/Http/Controllers/StatusController.php:32
 * @route '/details/scanned-records-amount-checkNo'
 */
export const scannedRecordsAmountCheckNo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scannedRecordsAmountCheckNo.url(options),
    method: 'get',
})

scannedRecordsAmountCheckNo.definition = {
    methods: ["get","head"],
    url: '/details/scanned-records-amount-checkNo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StatusController::scannedRecordsAmountCheckNo
 * @see app/Http/Controllers/StatusController.php:32
 * @route '/details/scanned-records-amount-checkNo'
 */
scannedRecordsAmountCheckNo.url = (options?: RouteQueryOptions) => {
    return scannedRecordsAmountCheckNo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StatusController::scannedRecordsAmountCheckNo
 * @see app/Http/Controllers/StatusController.php:32
 * @route '/details/scanned-records-amount-checkNo'
 */
scannedRecordsAmountCheckNo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scannedRecordsAmountCheckNo.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StatusController::scannedRecordsAmountCheckNo
 * @see app/Http/Controllers/StatusController.php:32
 * @route '/details/scanned-records-amount-checkNo'
 */
scannedRecordsAmountCheckNo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: scannedRecordsAmountCheckNo.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StatusController::scannedRecordsAmountCheckNo
 * @see app/Http/Controllers/StatusController.php:32
 * @route '/details/scanned-records-amount-checkNo'
 */
    const scannedRecordsAmountCheckNoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: scannedRecordsAmountCheckNo.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StatusController::scannedRecordsAmountCheckNo
 * @see app/Http/Controllers/StatusController.php:32
 * @route '/details/scanned-records-amount-checkNo'
 */
        scannedRecordsAmountCheckNoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scannedRecordsAmountCheckNo.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StatusController::scannedRecordsAmountCheckNo
 * @see app/Http/Controllers/StatusController.php:32
 * @route '/details/scanned-records-amount-checkNo'
 */
        scannedRecordsAmountCheckNoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scannedRecordsAmountCheckNo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    scannedRecordsAmountCheckNo.form = scannedRecordsAmountCheckNoForm
/**
* @see \App\Http\Controllers\StatusController::scannedRecords
 * @see app/Http/Controllers/StatusController.php:37
 * @route '/details/scanned-records/{id}'
 */
export const scannedRecords = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scannedRecords.url(args, options),
    method: 'get',
})

scannedRecords.definition = {
    methods: ["get","head"],
    url: '/details/scanned-records/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StatusController::scannedRecords
 * @see app/Http/Controllers/StatusController.php:37
 * @route '/details/scanned-records/{id}'
 */
scannedRecords.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return scannedRecords.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StatusController::scannedRecords
 * @see app/Http/Controllers/StatusController.php:37
 * @route '/details/scanned-records/{id}'
 */
scannedRecords.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scannedRecords.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StatusController::scannedRecords
 * @see app/Http/Controllers/StatusController.php:37
 * @route '/details/scanned-records/{id}'
 */
scannedRecords.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: scannedRecords.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StatusController::scannedRecords
 * @see app/Http/Controllers/StatusController.php:37
 * @route '/details/scanned-records/{id}'
 */
    const scannedRecordsForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: scannedRecords.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StatusController::scannedRecords
 * @see app/Http/Controllers/StatusController.php:37
 * @route '/details/scanned-records/{id}'
 */
        scannedRecordsForm.get = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scannedRecords.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StatusController::scannedRecords
 * @see app/Http/Controllers/StatusController.php:37
 * @route '/details/scanned-records/{id}'
 */
        scannedRecordsForm.head = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scannedRecords.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    scannedRecords.form = scannedRecordsForm
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
* @see \App\Http\Controllers\CheckRequestController::chequeRequests
 * @see app/Http/Controllers/CheckRequestController.php:25
 * @route '/section-head/check-receiving/index'
 */
export const chequeRequests = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: chequeRequests.url(options),
    method: 'get',
})

chequeRequests.definition = {
    methods: ["get","head"],
    url: '/section-head/check-receiving/index',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckRequestController::chequeRequests
 * @see app/Http/Controllers/CheckRequestController.php:25
 * @route '/section-head/check-receiving/index'
 */
chequeRequests.url = (options?: RouteQueryOptions) => {
    return chequeRequests.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckRequestController::chequeRequests
 * @see app/Http/Controllers/CheckRequestController.php:25
 * @route '/section-head/check-receiving/index'
 */
chequeRequests.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: chequeRequests.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckRequestController::chequeRequests
 * @see app/Http/Controllers/CheckRequestController.php:25
 * @route '/section-head/check-receiving/index'
 */
chequeRequests.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: chequeRequests.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckRequestController::chequeRequests
 * @see app/Http/Controllers/CheckRequestController.php:25
 * @route '/section-head/check-receiving/index'
 */
    const chequeRequestsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: chequeRequests.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckRequestController::chequeRequests
 * @see app/Http/Controllers/CheckRequestController.php:25
 * @route '/section-head/check-receiving/index'
 */
        chequeRequestsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: chequeRequests.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckRequestController::chequeRequests
 * @see app/Http/Controllers/CheckRequestController.php:25
 * @route '/section-head/check-receiving/index'
 */
        chequeRequestsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: chequeRequests.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    chequeRequests.form = chequeRequestsForm
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
* @see \App\Http\Controllers\CheckRequestController::approverNames
 * @see app/Http/Controllers/CheckRequestController.php:39
 * @route '/section-head/check-receiving/approver'
 */
export const approverNames = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: approverNames.url(options),
    method: 'get',
})

approverNames.definition = {
    methods: ["get","head"],
    url: '/section-head/check-receiving/approver',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckRequestController::approverNames
 * @see app/Http/Controllers/CheckRequestController.php:39
 * @route '/section-head/check-receiving/approver'
 */
approverNames.url = (options?: RouteQueryOptions) => {
    return approverNames.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckRequestController::approverNames
 * @see app/Http/Controllers/CheckRequestController.php:39
 * @route '/section-head/check-receiving/approver'
 */
approverNames.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: approverNames.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckRequestController::approverNames
 * @see app/Http/Controllers/CheckRequestController.php:39
 * @route '/section-head/check-receiving/approver'
 */
approverNames.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: approverNames.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckRequestController::approverNames
 * @see app/Http/Controllers/CheckRequestController.php:39
 * @route '/section-head/check-receiving/approver'
 */
    const approverNamesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: approverNames.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckRequestController::approverNames
 * @see app/Http/Controllers/CheckRequestController.php:39
 * @route '/section-head/check-receiving/approver'
 */
        approverNamesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: approverNames.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckRequestController::approverNames
 * @see app/Http/Controllers/CheckRequestController.php:39
 * @route '/section-head/check-receiving/approver'
 */
        approverNamesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: approverNames.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    approverNames.form = approverNamesForm
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
/**
* @see \App\Http\Controllers\CheckReleasingController::checkReleasing
 * @see app/Http/Controllers/CheckReleasingController.php:17
 * @route '/section-head/check-releasing/index'
 */
export const checkReleasing = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkReleasing.url(options),
    method: 'get',
})

checkReleasing.definition = {
    methods: ["get","head"],
    url: '/section-head/check-releasing/index',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckReleasingController::checkReleasing
 * @see app/Http/Controllers/CheckReleasingController.php:17
 * @route '/section-head/check-releasing/index'
 */
checkReleasing.url = (options?: RouteQueryOptions) => {
    return checkReleasing.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckReleasingController::checkReleasing
 * @see app/Http/Controllers/CheckReleasingController.php:17
 * @route '/section-head/check-releasing/index'
 */
checkReleasing.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkReleasing.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckReleasingController::checkReleasing
 * @see app/Http/Controllers/CheckReleasingController.php:17
 * @route '/section-head/check-releasing/index'
 */
checkReleasing.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkReleasing.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckReleasingController::checkReleasing
 * @see app/Http/Controllers/CheckReleasingController.php:17
 * @route '/section-head/check-releasing/index'
 */
    const checkReleasingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkReleasing.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckReleasingController::checkReleasing
 * @see app/Http/Controllers/CheckReleasingController.php:17
 * @route '/section-head/check-releasing/index'
 */
        checkReleasingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkReleasing.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckReleasingController::checkReleasing
 * @see app/Http/Controllers/CheckReleasingController.php:17
 * @route '/section-head/check-releasing/index'
 */
        checkReleasingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkReleasing.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkReleasing.form = checkReleasingForm
/**
* @see \App\Http\Controllers\CheckReleasingController::releaseCheck
 * @see app/Http/Controllers/CheckReleasingController.php:22
 * @route '/section-head/check-releasing/release-check/{checkId}/{status}'
 */
export const releaseCheck = (args: { checkId: string | number, status: string | number } | [checkId: string | number, status: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: releaseCheck.url(args, options),
    method: 'get',
})

releaseCheck.definition = {
    methods: ["get","head"],
    url: '/section-head/check-releasing/release-check/{checkId}/{status}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckReleasingController::releaseCheck
 * @see app/Http/Controllers/CheckReleasingController.php:22
 * @route '/section-head/check-releasing/release-check/{checkId}/{status}'
 */
releaseCheck.url = (args: { checkId: string | number, status: string | number } | [checkId: string | number, status: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    checkId: args[0],
                    status: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        checkId: args.checkId,
                                status: args.status,
                }

    return releaseCheck.definition.url
            .replace('{checkId}', parsedArgs.checkId.toString())
            .replace('{status}', parsedArgs.status.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckReleasingController::releaseCheck
 * @see app/Http/Controllers/CheckReleasingController.php:22
 * @route '/section-head/check-releasing/release-check/{checkId}/{status}'
 */
releaseCheck.get = (args: { checkId: string | number, status: string | number } | [checkId: string | number, status: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: releaseCheck.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckReleasingController::releaseCheck
 * @see app/Http/Controllers/CheckReleasingController.php:22
 * @route '/section-head/check-releasing/release-check/{checkId}/{status}'
 */
releaseCheck.head = (args: { checkId: string | number, status: string | number } | [checkId: string | number, status: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: releaseCheck.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckReleasingController::releaseCheck
 * @see app/Http/Controllers/CheckReleasingController.php:22
 * @route '/section-head/check-releasing/release-check/{checkId}/{status}'
 */
    const releaseCheckForm = (args: { checkId: string | number, status: string | number } | [checkId: string | number, status: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: releaseCheck.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckReleasingController::releaseCheck
 * @see app/Http/Controllers/CheckReleasingController.php:22
 * @route '/section-head/check-releasing/release-check/{checkId}/{status}'
 */
        releaseCheckForm.get = (args: { checkId: string | number, status: string | number } | [checkId: string | number, status: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: releaseCheck.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckReleasingController::releaseCheck
 * @see app/Http/Controllers/CheckReleasingController.php:22
 * @route '/section-head/check-releasing/release-check/{checkId}/{status}'
 */
        releaseCheckForm.head = (args: { checkId: string | number, status: string | number } | [checkId: string | number, status: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: releaseCheck.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    releaseCheck.form = releaseCheckForm
/**
* @see \App\Http\Controllers\CheckReleasingController::storeReleaseCheck
 * @see app/Http/Controllers/CheckReleasingController.php:27
 * @route '/section-head/check-releasing/store-release-check/{id}'
 */
export const storeReleaseCheck = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReleaseCheck.url(args, options),
    method: 'post',
})

storeReleaseCheck.definition = {
    methods: ["post"],
    url: '/section-head/check-releasing/store-release-check/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CheckReleasingController::storeReleaseCheck
 * @see app/Http/Controllers/CheckReleasingController.php:27
 * @route '/section-head/check-releasing/store-release-check/{id}'
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
* @see \App\Http\Controllers\CheckReleasingController::storeReleaseCheck
 * @see app/Http/Controllers/CheckReleasingController.php:27
 * @route '/section-head/check-releasing/store-release-check/{id}'
 */
storeReleaseCheck.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReleaseCheck.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CheckReleasingController::storeReleaseCheck
 * @see app/Http/Controllers/CheckReleasingController.php:27
 * @route '/section-head/check-releasing/store-release-check/{id}'
 */
    const storeReleaseCheckForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeReleaseCheck.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CheckReleasingController::storeReleaseCheck
 * @see app/Http/Controllers/CheckReleasingController.php:27
 * @route '/section-head/check-releasing/store-release-check/{id}'
 */
        storeReleaseCheckForm.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeReleaseCheck.url(args, options),
            method: 'post',
        })
    
    storeReleaseCheck.form = storeReleaseCheckForm
/**
* @see \App\Http\Controllers\ForwardedCheckController::forwardedCheckReleasing
 * @see app/Http/Controllers/ForwardedCheckController.php:26
 * @route '/forwarded-check/index'
 */
export const forwardedCheckReleasing = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: forwardedCheckReleasing.url(options),
    method: 'get',
})

forwardedCheckReleasing.definition = {
    methods: ["get","head"],
    url: '/forwarded-check/index',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ForwardedCheckController::forwardedCheckReleasing
 * @see app/Http/Controllers/ForwardedCheckController.php:26
 * @route '/forwarded-check/index'
 */
forwardedCheckReleasing.url = (options?: RouteQueryOptions) => {
    return forwardedCheckReleasing.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ForwardedCheckController::forwardedCheckReleasing
 * @see app/Http/Controllers/ForwardedCheckController.php:26
 * @route '/forwarded-check/index'
 */
forwardedCheckReleasing.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: forwardedCheckReleasing.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ForwardedCheckController::forwardedCheckReleasing
 * @see app/Http/Controllers/ForwardedCheckController.php:26
 * @route '/forwarded-check/index'
 */
forwardedCheckReleasing.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: forwardedCheckReleasing.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ForwardedCheckController::forwardedCheckReleasing
 * @see app/Http/Controllers/ForwardedCheckController.php:26
 * @route '/forwarded-check/index'
 */
    const forwardedCheckReleasingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: forwardedCheckReleasing.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ForwardedCheckController::forwardedCheckReleasing
 * @see app/Http/Controllers/ForwardedCheckController.php:26
 * @route '/forwarded-check/index'
 */
        forwardedCheckReleasingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: forwardedCheckReleasing.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ForwardedCheckController::forwardedCheckReleasing
 * @see app/Http/Controllers/ForwardedCheckController.php:26
 * @route '/forwarded-check/index'
 */
        forwardedCheckReleasingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: forwardedCheckReleasing.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    forwardedCheckReleasing.form = forwardedCheckReleasingForm
/**
* @see \App\Http\Controllers\ForwardedCheckController::releaseCheckForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:40
 * @route '/forwarded-check/release-check/{id}/{status}'
 */
export const releaseCheckForwarded = (args: { id: string | number, status: string | number } | [id: string | number, status: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: releaseCheckForwarded.url(args, options),
    method: 'get',
})

releaseCheckForwarded.definition = {
    methods: ["get","head"],
    url: '/forwarded-check/release-check/{id}/{status}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ForwardedCheckController::releaseCheckForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:40
 * @route '/forwarded-check/release-check/{id}/{status}'
 */
releaseCheckForwarded.url = (args: { id: string | number, status: string | number } | [id: string | number, status: string | number ], options?: RouteQueryOptions) => {
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

    return releaseCheckForwarded.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{status}', parsedArgs.status.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ForwardedCheckController::releaseCheckForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:40
 * @route '/forwarded-check/release-check/{id}/{status}'
 */
releaseCheckForwarded.get = (args: { id: string | number, status: string | number } | [id: string | number, status: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: releaseCheckForwarded.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ForwardedCheckController::releaseCheckForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:40
 * @route '/forwarded-check/release-check/{id}/{status}'
 */
releaseCheckForwarded.head = (args: { id: string | number, status: string | number } | [id: string | number, status: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: releaseCheckForwarded.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ForwardedCheckController::releaseCheckForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:40
 * @route '/forwarded-check/release-check/{id}/{status}'
 */
    const releaseCheckForwardedForm = (args: { id: string | number, status: string | number } | [id: string | number, status: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: releaseCheckForwarded.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ForwardedCheckController::releaseCheckForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:40
 * @route '/forwarded-check/release-check/{id}/{status}'
 */
        releaseCheckForwardedForm.get = (args: { id: string | number, status: string | number } | [id: string | number, status: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: releaseCheckForwarded.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ForwardedCheckController::releaseCheckForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:40
 * @route '/forwarded-check/release-check/{id}/{status}'
 */
        releaseCheckForwardedForm.head = (args: { id: string | number, status: string | number } | [id: string | number, status: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: releaseCheckForwarded.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    releaseCheckForwarded.form = releaseCheckForwardedForm
/**
* @see \App\Http\Controllers\ForwardedCheckController::storeReleaseCheckForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:45
 * @route '/forwarded-check/store-release-check/{id}'
 */
export const storeReleaseCheckForwarded = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReleaseCheckForwarded.url(args, options),
    method: 'post',
})

storeReleaseCheckForwarded.definition = {
    methods: ["post"],
    url: '/forwarded-check/store-release-check/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ForwardedCheckController::storeReleaseCheckForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:45
 * @route '/forwarded-check/store-release-check/{id}'
 */
storeReleaseCheckForwarded.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return storeReleaseCheckForwarded.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ForwardedCheckController::storeReleaseCheckForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:45
 * @route '/forwarded-check/store-release-check/{id}'
 */
storeReleaseCheckForwarded.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReleaseCheckForwarded.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ForwardedCheckController::storeReleaseCheckForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:45
 * @route '/forwarded-check/store-release-check/{id}'
 */
    const storeReleaseCheckForwardedForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeReleaseCheckForwarded.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ForwardedCheckController::storeReleaseCheckForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:45
 * @route '/forwarded-check/store-release-check/{id}'
 */
        storeReleaseCheckForwardedForm.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeReleaseCheckForwarded.url(args, options),
            method: 'post',
        })
    
    storeReleaseCheckForwarded.form = storeReleaseCheckForwardedForm
/**
* @see \App\Http\Controllers\ForwardedCheckController::receiverForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:35
 * @route '/forwarded-check/update-receiver-{id}'
 */
export const receiverForwarded = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: receiverForwarded.url(args, options),
    method: 'put',
})

receiverForwarded.definition = {
    methods: ["put"],
    url: '/forwarded-check/update-receiver-{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ForwardedCheckController::receiverForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:35
 * @route '/forwarded-check/update-receiver-{id}'
 */
receiverForwarded.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return receiverForwarded.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ForwardedCheckController::receiverForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:35
 * @route '/forwarded-check/update-receiver-{id}'
 */
receiverForwarded.put = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: receiverForwarded.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\ForwardedCheckController::receiverForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:35
 * @route '/forwarded-check/update-receiver-{id}'
 */
    const receiverForwardedForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: receiverForwarded.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ForwardedCheckController::receiverForwarded
 * @see app/Http/Controllers/ForwardedCheckController.php:35
 * @route '/forwarded-check/update-receiver-{id}'
 */
        receiverForwardedForm.put = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: receiverForwarded.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    receiverForwarded.form = receiverForwardedForm
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
/**
* @see \App\Http\Controllers\ClosingController::closingChecks
 * @see app/Http/Controllers/ClosingController.php:19
 * @route '/closing-checks/index'
 */
export const closingChecks = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: closingChecks.url(options),
    method: 'get',
})

closingChecks.definition = {
    methods: ["get","head"],
    url: '/closing-checks/index',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClosingController::closingChecks
 * @see app/Http/Controllers/ClosingController.php:19
 * @route '/closing-checks/index'
 */
closingChecks.url = (options?: RouteQueryOptions) => {
    return closingChecks.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClosingController::closingChecks
 * @see app/Http/Controllers/ClosingController.php:19
 * @route '/closing-checks/index'
 */
closingChecks.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: closingChecks.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClosingController::closingChecks
 * @see app/Http/Controllers/ClosingController.php:19
 * @route '/closing-checks/index'
 */
closingChecks.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: closingChecks.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClosingController::closingChecks
 * @see app/Http/Controllers/ClosingController.php:19
 * @route '/closing-checks/index'
 */
    const closingChecksForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: closingChecks.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClosingController::closingChecks
 * @see app/Http/Controllers/ClosingController.php:19
 * @route '/closing-checks/index'
 */
        closingChecksForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: closingChecks.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClosingController::closingChecks
 * @see app/Http/Controllers/ClosingController.php:19
 * @route '/closing-checks/index'
 */
        closingChecksForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: closingChecks.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    closingChecks.form = closingChecksForm
/**
* @see \App\Http\Controllers\ClosingController::markAsClose
 * @see app/Http/Controllers/ClosingController.php:25
 * @route '/closing-checks/mark-close/{id}'
 */
export const markAsClose = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsClose.url(args, options),
    method: 'post',
})

markAsClose.definition = {
    methods: ["post"],
    url: '/closing-checks/mark-close/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClosingController::markAsClose
 * @see app/Http/Controllers/ClosingController.php:25
 * @route '/closing-checks/mark-close/{id}'
 */
markAsClose.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return markAsClose.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClosingController::markAsClose
 * @see app/Http/Controllers/ClosingController.php:25
 * @route '/closing-checks/mark-close/{id}'
 */
markAsClose.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsClose.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClosingController::markAsClose
 * @see app/Http/Controllers/ClosingController.php:25
 * @route '/closing-checks/mark-close/{id}'
 */
    const markAsCloseForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAsClose.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClosingController::markAsClose
 * @see app/Http/Controllers/ClosingController.php:25
 * @route '/closing-checks/mark-close/{id}'
 */
        markAsCloseForm.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAsClose.url(args, options),
            method: 'post',
        })
    
    markAsClose.form = markAsCloseForm
/**
* @see \App\Http\Controllers\StatusController::checkStatus
 * @see app/Http/Controllers/StatusController.php:27
 * @route '/check-status'
 */
export const checkStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkStatus.url(options),
    method: 'get',
})

checkStatus.definition = {
    methods: ["get","head"],
    url: '/check-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StatusController::checkStatus
 * @see app/Http/Controllers/StatusController.php:27
 * @route '/check-status'
 */
checkStatus.url = (options?: RouteQueryOptions) => {
    return checkStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StatusController::checkStatus
 * @see app/Http/Controllers/StatusController.php:27
 * @route '/check-status'
 */
checkStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkStatus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StatusController::checkStatus
 * @see app/Http/Controllers/StatusController.php:27
 * @route '/check-status'
 */
checkStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkStatus.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StatusController::checkStatus
 * @see app/Http/Controllers/StatusController.php:27
 * @route '/check-status'
 */
    const checkStatusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkStatus.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StatusController::checkStatus
 * @see app/Http/Controllers/StatusController.php:27
 * @route '/check-status'
 */
        checkStatusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkStatus.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StatusController::checkStatus
 * @see app/Http/Controllers/StatusController.php:27
 * @route '/check-status'
 */
        checkStatusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkStatus.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkStatus.form = checkStatusForm
/**
* @see \App\Http\Controllers\StatusController::cancelStaleCheck
 * @see app/Http/Controllers/StatusController.php:42
 * @route '/cancel-stale-check/{id}'
 */
export const cancelStaleCheck = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelStaleCheck.url(args, options),
    method: 'post',
})

cancelStaleCheck.definition = {
    methods: ["post"],
    url: '/cancel-stale-check/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StatusController::cancelStaleCheck
 * @see app/Http/Controllers/StatusController.php:42
 * @route '/cancel-stale-check/{id}'
 */
cancelStaleCheck.url = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return cancelStaleCheck.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StatusController::cancelStaleCheck
 * @see app/Http/Controllers/StatusController.php:42
 * @route '/cancel-stale-check/{id}'
 */
cancelStaleCheck.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelStaleCheck.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\StatusController::cancelStaleCheck
 * @see app/Http/Controllers/StatusController.php:42
 * @route '/cancel-stale-check/{id}'
 */
    const cancelStaleCheckForm = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelStaleCheck.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StatusController::cancelStaleCheck
 * @see app/Http/Controllers/StatusController.php:42
 * @route '/cancel-stale-check/{id}'
 */
        cancelStaleCheckForm.post = (args: { id: number | { id: number } } | [id: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelStaleCheck.url(args, options),
            method: 'post',
        })
    
    cancelStaleCheck.form = cancelStaleCheckForm
/**
* @see \App\Http\Controllers\ReportController::report
 * @see app/Http/Controllers/ReportController.php:29
 * @route '/reports/report'
 */
export const report = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: report.url(options),
    method: 'get',
})

report.definition = {
    methods: ["get","head"],
    url: '/reports/report',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportController::report
 * @see app/Http/Controllers/ReportController.php:29
 * @route '/reports/report'
 */
report.url = (options?: RouteQueryOptions) => {
    return report.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::report
 * @see app/Http/Controllers/ReportController.php:29
 * @route '/reports/report'
 */
report.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: report.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportController::report
 * @see app/Http/Controllers/ReportController.php:29
 * @route '/reports/report'
 */
report.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: report.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportController::report
 * @see app/Http/Controllers/ReportController.php:29
 * @route '/reports/report'
 */
    const reportForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: report.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportController::report
 * @see app/Http/Controllers/ReportController.php:29
 * @route '/reports/report'
 */
        reportForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: report.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportController::report
 * @see app/Http/Controllers/ReportController.php:29
 * @route '/reports/report'
 */
        reportForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: report.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    report.form = reportForm
/**
* @see \App\Http\Controllers\ReportController::generateReport
 * @see app/Http/Controllers/ReportController.php:56
 * @route '/reports/generate-report'
 */
export const generateReport = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateReport.url(options),
    method: 'post',
})

generateReport.definition = {
    methods: ["post"],
    url: '/reports/generate-report',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReportController::generateReport
 * @see app/Http/Controllers/ReportController.php:56
 * @route '/reports/generate-report'
 */
generateReport.url = (options?: RouteQueryOptions) => {
    return generateReport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::generateReport
 * @see app/Http/Controllers/ReportController.php:56
 * @route '/reports/generate-report'
 */
generateReport.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateReport.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ReportController::generateReport
 * @see app/Http/Controllers/ReportController.php:56
 * @route '/reports/generate-report'
 */
    const generateReportForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generateReport.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ReportController::generateReport
 * @see app/Http/Controllers/ReportController.php:56
 * @route '/reports/generate-report'
 */
        generateReportForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generateReport.url(options),
            method: 'post',
        })
    
    generateReport.form = generateReportForm
/**
* @see \App\Http\Controllers\ReportController::generatedReport
 * @see app/Http/Controllers/ReportController.php:96
 * @route '/reports/generated-reports'
 */
export const generatedReport = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generatedReport.url(options),
    method: 'get',
})

generatedReport.definition = {
    methods: ["get","head"],
    url: '/reports/generated-reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportController::generatedReport
 * @see app/Http/Controllers/ReportController.php:96
 * @route '/reports/generated-reports'
 */
generatedReport.url = (options?: RouteQueryOptions) => {
    return generatedReport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::generatedReport
 * @see app/Http/Controllers/ReportController.php:96
 * @route '/reports/generated-reports'
 */
generatedReport.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generatedReport.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportController::generatedReport
 * @see app/Http/Controllers/ReportController.php:96
 * @route '/reports/generated-reports'
 */
generatedReport.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generatedReport.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportController::generatedReport
 * @see app/Http/Controllers/ReportController.php:96
 * @route '/reports/generated-reports'
 */
    const generatedReportForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: generatedReport.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportController::generatedReport
 * @see app/Http/Controllers/ReportController.php:96
 * @route '/reports/generated-reports'
 */
        generatedReportForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generatedReport.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportController::generatedReport
 * @see app/Http/Controllers/ReportController.php:96
 * @route '/reports/generated-reports'
 */
        generatedReportForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generatedReport.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    generatedReport.form = generatedReportForm
/**
* @see \App\Http\Controllers\ReportController::downloadReport
 * @see app/Http/Controllers/ReportController.php:122
 * @route '/reports/download-report'
 */
export const downloadReport = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadReport.url(options),
    method: 'get',
})

downloadReport.definition = {
    methods: ["get","head"],
    url: '/reports/download-report',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportController::downloadReport
 * @see app/Http/Controllers/ReportController.php:122
 * @route '/reports/download-report'
 */
downloadReport.url = (options?: RouteQueryOptions) => {
    return downloadReport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::downloadReport
 * @see app/Http/Controllers/ReportController.php:122
 * @route '/reports/download-report'
 */
downloadReport.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadReport.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportController::downloadReport
 * @see app/Http/Controllers/ReportController.php:122
 * @route '/reports/download-report'
 */
downloadReport.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadReport.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportController::downloadReport
 * @see app/Http/Controllers/ReportController.php:122
 * @route '/reports/download-report'
 */
    const downloadReportForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadReport.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportController::downloadReport
 * @see app/Http/Controllers/ReportController.php:122
 * @route '/reports/download-report'
 */
        downloadReportForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadReport.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportController::downloadReport
 * @see app/Http/Controllers/ReportController.php:122
 * @route '/reports/download-report'
 */
        downloadReportForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadReport.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadReport.form = downloadReportForm
/**
 * @see routes/web.php:159
 * @route '/about'
 */
export const about = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: about.url(options),
    method: 'get',
})

about.definition = {
    methods: ["get","head"],
    url: '/about',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:159
 * @route '/about'
 */
about.url = (options?: RouteQueryOptions) => {
    return about.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:159
 * @route '/about'
 */
about.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: about.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:159
 * @route '/about'
 */
about.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: about.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:159
 * @route '/about'
 */
    const aboutForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: about.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:159
 * @route '/about'
 */
        aboutForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: about.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:159
 * @route '/about'
 */
        aboutForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: about.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    about.form = aboutForm
/**
 * @see routes/web.php:163
 * @route '/notifications'
 */
export const notifications = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notifications.url(options),
    method: 'get',
})

notifications.definition = {
    methods: ["get","head"],
    url: '/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:163
 * @route '/notifications'
 */
notifications.url = (options?: RouteQueryOptions) => {
    return notifications.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:163
 * @route '/notifications'
 */
notifications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notifications.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:163
 * @route '/notifications'
 */
notifications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: notifications.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:163
 * @route '/notifications'
 */
    const notificationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: notifications.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:163
 * @route '/notifications'
 */
        notificationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: notifications.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:163
 * @route '/notifications'
 */
        notificationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: notifications.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    notifications.form = notificationsForm
/**
 * @see routes/web.php:168
 * @route '/test'
 */
export const test = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: test.url(options),
    method: 'get',
})

test.definition = {
    methods: ["get","head"],
    url: '/test',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:168
 * @route '/test'
 */
test.url = (options?: RouteQueryOptions) => {
    return test.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:168
 * @route '/test'
 */
test.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: test.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:168
 * @route '/test'
 */
test.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: test.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:168
 * @route '/test'
 */
    const testForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: test.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:168
 * @route '/test'
 */
        testForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: test.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:168
 * @route '/test'
 */
        testForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: test.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    test.form = testForm
/**
 * @see routes/web.php:250
 * @route '/company'
 */
export const company = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: company.url(options),
    method: 'get',
})

company.definition = {
    methods: ["get","head"],
    url: '/company',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:250
 * @route '/company'
 */
company.url = (options?: RouteQueryOptions) => {
    return company.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:250
 * @route '/company'
 */
company.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: company.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:250
 * @route '/company'
 */
company.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: company.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:250
 * @route '/company'
 */
    const companyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: company.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:250
 * @route '/company'
 */
        companyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: company.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:250
 * @route '/company'
 */
        companyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: company.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    company.form = companyForm
/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:21
 * @route '/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:21
 * @route '/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:21
 * @route '/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:21
 * @route '/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:21
 * @route '/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:21
 * @route '/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:21
 * @route '/register'
 */
        registerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    register.form = registerForm
/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::ipPhones
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:26
 * @route '/ip-phones'
 */
export const ipPhones = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ipPhones.url(options),
    method: 'get',
})

ipPhones.definition = {
    methods: ["get","head"],
    url: '/ip-phones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::ipPhones
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:26
 * @route '/ip-phones'
 */
ipPhones.url = (options?: RouteQueryOptions) => {
    return ipPhones.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::ipPhones
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:26
 * @route '/ip-phones'
 */
ipPhones.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ipPhones.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::ipPhones
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:26
 * @route '/ip-phones'
 */
ipPhones.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ipPhones.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\RegisteredUserController::ipPhones
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:26
 * @route '/ip-phones'
 */
    const ipPhonesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ipPhones.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\RegisteredUserController::ipPhones
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:26
 * @route '/ip-phones'
 */
        ipPhonesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ipPhones.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\RegisteredUserController::ipPhones
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:26
 * @route '/ip-phones'
 */
        ipPhonesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ipPhones.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ipPhones.form = ipPhonesForm