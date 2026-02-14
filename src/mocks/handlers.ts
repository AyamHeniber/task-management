import { http, HttpResponse } from 'msw';
import type { Task } from '../features/tasks/tasksSlice';

// Key for localStorage persistence
const TASKS_STORAGE_KEY = 'mock_tasks';

const getTasks = (): Task[] => {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);

    // Default Initial Data
    const initialTasks: Task[] = [
        { id: '1', title: 'Task 1', description: 'Description 1', status: 'todo' },
        { id: '2', title: 'Task 2', description: 'Description 2', status: 'in-progress' },
    ];
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(initialTasks));
    return initialTasks;
};

const saveTasks = (tasks: Task[]) => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

export const handlers = [
    // Login
    http.post('/login', async ({ request }) => {
        const { username, password } = (await request.json()) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        if (username === 'test' && password === 'test123') {
            return HttpResponse.json({
                id: 'u1',
                username: 'test',
                token: 'mock-jwt-token-123456',
            });
        }

        return new HttpResponse(null, { status: 401 });
    }),

    // Get Tasks
    http.get('/tasks', () => {
        return HttpResponse.json(getTasks());
    }),

    // Create Task
    http.post('/tasks', async ({ request }) => {
        const newTask = (await request.json()) as Task;
        const tasks = getTasks();
        const taskWithId = { ...newTask, id: Date.now().toString() };
        tasks.push(taskWithId);
        saveTasks(tasks);
        return HttpResponse.json(taskWithId, { status: 201 });
    }),

    // Update Task
    http.put('/tasks/:id', async ({ request, params }) => {
        const { id } = params;
        const updatedTask = (await request.json()) as Task;
        const tasks = getTasks();
        const index = tasks.findIndex((t) => t.id === id);

        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updatedTask };
            saveTasks(tasks);
            return HttpResponse.json(tasks[index]);
        }

        return new HttpResponse(null, { status: 404 });
    }),

    // Delete Task
    http.delete('/tasks/:id', ({ params }) => {
        const { id } = params;
        let tasks = getTasks();
        tasks = tasks.filter((t) => t.id !== id);
        saveTasks(tasks);
        return HttpResponse.json({ success: true });
    }),
];
