import authReducer, { login, logout } from './authSlice';
import { describe, it, expect } from 'vitest';

describe('auth reducer', () => {
    const initialState = {
        user: null,
        isAuthenticated: false,
    };

    it('should handle initial state', () => {
        expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle login', () => {
        const user = { id: '1', username: 'test', token: 'token' };
        const actual = authReducer(initialState, login(user));
        expect(actual.isAuthenticated).toEqual(true);
        expect(actual.user).toEqual(user);
    });

    it('should handle logout', () => {
        const startState = {
            user: { id: '1', username: 'test', token: 'token' },
            isAuthenticated: true,
        };
        const actual = authReducer(startState, logout());
        expect(actual.isAuthenticated).toEqual(false);
        expect(actual.user).toEqual(null);
    });
});
