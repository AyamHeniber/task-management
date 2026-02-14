import { screen, waitFor, fireEvent, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from './Dashboard';
import { renderWithProviders } from '../../test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';

// Mock antd message
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
    },
  };
});

import { message } from 'antd';

vi.setConfig({ testTimeout: 10000 });

describe('Dashboard Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    cleanup();
  });

  it('renders dashboard with tasks', async () => {
    renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: {
          user: { id: '1', username: 'test', token: 'token' },
          isAuthenticated: true,
        },
      },
    });

    expect(await screen.findByRole('heading', { name: /projects/i })).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/task 1/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('can open create task modal', async () => {
    renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: {
          user: { id: '1', username: 'test', token: 'token' },
          isAuthenticated: true,
        },
      },
    });

    const newBtn = await screen.findByRole('button', { name: /new task/i });
    fireEvent.click(newBtn);

    expect(await screen.findByText(/execute new plan/i, {}, { timeout: 4000 })).toBeInTheDocument(); 
  });

  it('can create a new task', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: {
          user: { id: '1', username: 'test', token: 'token' },
          isAuthenticated: true,
        },
      },
    });

    const newBtn = await screen.findByRole('button', { name: /new task/i });
    fireEvent.click(newBtn);

    expect(await screen.findByText(/execute new plan/i, {}, { timeout: 4000 })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/objective title/i), 'New Task Title');
    await user.type(screen.getByLabelText(/context & details/i), 'New Task Description');
    
    const submitBtn = await screen.findByRole('button', { name: /execute plan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.queryByText(/execute new plan/i)).not.toBeInTheDocument();
    }, { timeout: 4000 });
  });

  it('can delete a task', async () => {
    renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: {
          user: { id: '1', username: 'test', token: 'token' },
          isAuthenticated: true,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
    });

    const task1Card = screen.getByText("Task 1").closest('.ant-card');
    const deleteBtn = within(task1Card as HTMLElement).getByTestId("delete-task-1");
    fireEvent.click(deleteBtn);

    const confirmBtn = await screen.findByRole('button', { name: /yes/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    });
  });

  it('can edit a task', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: {
          user: { id: '1', username: 'test', token: 'token' },
          isAuthenticated: true,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
    });

    const task1Card = screen.getByText("Task 1").closest('.ant-card');
    const editBtn = within(task1Card as HTMLElement).getByTestId("edit-task-1");
    fireEvent.click(editBtn);

    expect(await screen.findByText(/edit strategy/i, {}, { timeout: 4000 })).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/objective title/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Task Title');

    const submitBtn = await screen.findByRole('button', { name: /update strategy/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
       expect(screen.queryByText(/edit strategy/i)).not.toBeInTheDocument();
    });
  });

  it('displays error message when fetching tasks fails', async () => {
    server.use(
      http.get('/tasks', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: {
          user: { id: '1', username: 'test', token: 'token' },
          isAuthenticated: true,
        },
      },
    });

    await waitFor(() => {
      expect(message.error).toHaveBeenCalled();
    });
  });

  it('displays error message when creating a task fails', async () => {
    server.use(
      http.post('/tasks', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: {
          user: { id: '1', username: 'test', token: 'token' },
          isAuthenticated: true,
        },
      },
    });

    fireEvent.click(await screen.findByRole('button', { name: /new task/i }));
    const titleInput = await screen.findByLabelText(/objective title/i);
    const descInput = await screen.findByLabelText(/context & details/i);
    
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descInput, { target: { value: 'Desc' } });
    
    fireEvent.click(await screen.findByRole('button', { name: /execute plan/i }));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalled();
    });
  });

  it('can search for tasks', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: {
          user: { id: '1', username: 'test', token: 'token' },
          isAuthenticated: true,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search tasks/i);
    await user.type(searchInput, 'Task 1');

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
    });
  });

  it('can logout', async () => {
    const { store } = renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: {
          user: { id: '1', username: 'test', token: 'token' },
          isAuthenticated: true,
        },
      },
    });

    const logoutBtn = await screen.findByRole('button', { name: /logout/i });
    fireEvent.click(logoutBtn);
    
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });

  it('shows skeleton when loading', async () => {
    renderWithProviders(<Dashboard />, {
      preloadedState: {
        tasks: {
          tasks: [],
          loading: true,
          error: null
        }
      }
    });

    const skeletons = await screen.findAllByTestId('skeleton-task');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
