import React, { type PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import authReducer from './features/auth/authSlice';
import tasksReducer from './features/tasks/tasksSlice';
import { ThemeProvider } from './context/ThemeContext';
import type { RootState } from './app/store';

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({ 
      reducer: { 
        auth: authReducer, 
        tasks: tasksReducer 
      } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      preloadedState 
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<object>): React.JSX.Element {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
