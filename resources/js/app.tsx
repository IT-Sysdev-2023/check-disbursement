import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { initializeTheme } from './hooks/use-appearance';

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

        const defaultTheme = createTheme({
            colorSchemes: { light: true, dark: true },
            cssVariables: {
              colorSchemeSelector: 'data-mui-color-scheme',
            },
            // typography: {
            //   fontFamily: 'Segoe UI Emoji'
            // }
          });

        root.render(
            <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <App {...props} />
          </ThemeProvider>
            // <ThemeProviderWithAppearance>
            //   <App {...props} />
            // </ThemeProviderWithAppearance>
          );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
