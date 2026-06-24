import React from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme } from '@/lib/theme';
import { resetAllStores } from './helpers';

import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

interface AllProvidersProps {
  children: React.ReactNode;
  initialEntries?: string[];
}

/**
 * Wrap children with all providers needed for component tests.
 */
function AllProviders({
  children,
  initialEntries = ['/'],
}: AllProvidersProps): React.ReactElement {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

/**
 * Custom render that wraps components with all required providers.
 */
function customRender(
  ui: React.ReactElement,
  options?: RenderOptions & { initialEntries?: string[] }
): RenderResult {
  const { initialEntries, ...renderOptions } = options ?? {};
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders initialEntries={initialEntries}>{children}</AllProviders>
    ),
    ...renderOptions,
  });
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };
export { AllProviders };
export { resetAllStores };
