import { createInertiaApp } from '@inertiajs/react';
import { configureEcho } from '@laravel/echo-react';
import { CssBaseline, createTheme } from '@mui/material';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import '../css/app.css';
import { initializeTheme } from './hooks/use-appearance';
import DialogsProvider from './pages/retrievedData/components/dialogs/dialogsProvider';
import NotificationsProvider from './pages/retrievedData/components/notifications/notificationsProvider';
import { dataGridCustomizations } from './themes/customizations/dataGridCustomizations';
import { formInputCustomizations } from './themes/customizations/formInputCustomizations';
import AppTheme from './themes/shared-theme/AppTheme';

configureEcho({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});

const appName = import.meta.env.VITE_APP_NAME || 'Check Disbursement';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // const defaultTheme = createTheme({
        //     colorSchemes: { light: true, dark: true },
        //     cssVariables: {
        //         colorSchemeSelector: 'data-mui-color-scheme',
        //     },
        //     components: {
        //         ...dataGridCustomizations,
        //         ...formInputCustomizations,
        //     },
        //     typography: {
        //       fontFamily: 'Roboto'
        //     }
        // });

        const themeComponents = {
            ...dataGridCustomizations,
            ...formInputCustomizations,
            // ...datePickersCustomizations,
        };

        root.render(
            // <ThemeProvider theme={defaultTheme}>
            <AppTheme themeComponents={themeComponents}>
                <CssBaseline />
                <NotificationsProvider>
                    <DialogsProvider>
                        <BrowserRouter>
                            <App {...props} />
                        </BrowserRouter>
                    </DialogsProvider>
                </NotificationsProvider>
            </AppTheme>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
