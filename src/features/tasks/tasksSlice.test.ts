import tasksReducer, { setTasks, addTask, updateTask, deleteTask, type Task } from './tasksSlice';
import { describe, it, expect } from 'vitest';

describe('tasks reducer', () => {
    const initialState = {
        tasks: [],
        loading: false,
        error: null,
    };

    const sampleTask: Task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
    };

    it('should handle initial state', () => {
        expect(tasksReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle setTasks', () => {
        const actual = tasksReducer(initialState, setTasks([sampleTask]));
        expect(actual.tasks).toEqual([sampleTask]);
    });

    it('should handle addTask', () => {
        const actual = tasksReducer(initialState, addTask(sampleTask));
        expect(actual.tasks).toHaveLength(1);
        expect(actual.tasks[0]).toEqual(sampleTask);
    });

    it('should handle updateTask', () => {
        const startState = { ...initialState, tasks: [sampleTask] };
        const updatedTask = { ...sampleTask, title: 'Updated' };
        const actual = tasksReducer(startState, updateTask(updatedTask));
        expect(actual.tasks[0].title).toEqual('Updated');
    });

    it('should handle deleteTask', () => {
        const startState = { ...initialState, tasks: [sampleTask] };
        const actual = tasksReducer(startState, deleteTask(sampleTask.id));
        expect(actual.tasks).toHaveLength(0);
    });
});
