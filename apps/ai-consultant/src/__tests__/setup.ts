// Setup file for Jest tests
// This file runs before each test suite

// Increase timeout for async operations
jest.setTimeout(10000);

// Mock console methods to reduce noise in test output
global.console = {
    ...console,
    // Uncomment to suppress console.log in tests
    // log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    // Keep error for debugging
    error: console.error,
};
