import React, { useMemo } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

export default function ThemeProviderWithAppearance({ children }: { children: React.ReactNode }) {
  const defaultTheme = createTheme({
    colorSchemes: { light: true, dark: true },
    cssVariables: {
      colorSchemeSelector: 'data-mui-color-scheme',
    },
    // typography: {
    //   fontFamily: 'Segoe UI Emoji'
    // }
  });
  

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
