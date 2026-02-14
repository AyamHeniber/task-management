import '@testing-library/jest-dom';
import { server } from './mocks/server';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';

// Polyfill ResizeObserver
class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}
globalThis.ResizeObserver = ResizeObserver;
window.ResizeObserver = ResizeObserver;

// Polyfill matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), 
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
