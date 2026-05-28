import { vi, describe, it, expect } from 'vitest';
import { ApiError } from '../ApiError';

vi.mock('@/config/env', () => ({
  default: {
    TWELVE_DATA_API_KEY: 'test-api-key',
    IS_DEV: false,
    IS_PROD: true,
  },
}));

// Prevent axios-retry from wrapping the adapter in a way that interferes
vi.mock('axios-retry', () => ({
  default: vi.fn(),
  isNetworkError: vi.fn(() => false),
  exponentialDelay: vi.fn(),
}));

// Import after mocks are hoisted
const { default: apiClient } = await import('../client');

// Reach into the interceptor manager to grab the registered handlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reqHandlers = (apiClient.interceptors.request as any).handlers as Array<{
  fulfilled: (config: Record<string, unknown>) => Record<string, unknown>;
}>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resHandlers = (apiClient.interceptors.response as any).handlers as Array<{
  fulfilled: (response: Record<string, unknown>) => unknown;
}>;

const requestFulfilled = reqHandlers[0].fulfilled;
const responseFulfilled = resHandlers[0].fulfilled;

describe('apiClient — request interceptor', () => {
  it('injects apikey into request params', () => {
    const config = { params: { symbol: 'AAPL' } };
    const result = requestFulfilled(config);
    expect(result.params).toEqual({ symbol: 'AAPL', apikey: 'test-api-key' });
  });

  it('creates params object when none exist', () => {
    const config = {};
    const result = requestFulfilled(config);
    expect((result.params as Record<string, string>).apikey).toBe('test-api-key');
  });
});

describe('apiClient — response interceptor', () => {
  it('passes through a successful response unchanged', () => {
    const response = { data: { status: 'ok', values: [] } };
    const result = responseFulfilled(response);
    expect(result).toBe(response);
  });

  it('throws ApiError when body contains { status: "error", code: <number> }', async () => {
    const response = {
      data: { status: 'error', code: 429, message: 'Too many requests' },
    };
    await expect(responseFulfilled(response) as Promise<unknown>).rejects.toBeInstanceOf(ApiError);
  });

  it('sets the correct status and message on the thrown ApiError', async () => {
    const response = {
      data: { status: 'error', code: 429, message: 'Too many requests' },
    };
    await expect(responseFulfilled(response) as Promise<unknown>).rejects.toMatchObject({
      status: 429,
      message: 'Too many requests',
    });
  });
});
