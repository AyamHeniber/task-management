import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import { renderWithProviders } from '../../test-utils';
import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';

describe('Login Component', () => {
  it('renders login form', () => {
    renderWithProviders(<Login />);
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<Login />);

    await user.type(screen.getByPlaceholderText(/username/i), 'test');
    await user.type(screen.getByPlaceholderText(/password/i), 'test123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(store.getState().auth.isAuthenticated).toBe(true);
    }, { timeout: 4000 });
  });

  it('handles failed login', async () => {
    server.use(
      http.post('/login', () => {
        return new HttpResponse(null, { status: 401 });
      })
    );

    const user = userEvent.setup();
    const { store } = renderWithProviders(<Login />);

    await user.type(screen.getByPlaceholderText(/username/i), 'wrong');
    await user.type(screen.getByPlaceholderText(/password/i), 'wrong');
    
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(store.getState().auth.isAuthenticated).toBe(false);
    }, { timeout: 3000 });
  });
});
