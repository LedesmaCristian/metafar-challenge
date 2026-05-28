import { ApiError } from '../ApiError';

describe('ApiError', () => {
  const error = new ApiError(429, '429', 'Too Many Requests');

  it('is an instance of Error', () => {
    expect(error).toBeInstanceOf(Error);
  });

  it('is an instance of ApiError', () => {
    expect(error).toBeInstanceOf(ApiError);
  });

  it('sets name to "ApiError"', () => {
    expect(error.name).toBe('ApiError');
  });

  it('sets status correctly', () => {
    expect(error.status).toBe(429);
  });

  it('sets code correctly', () => {
    expect(error.code).toBe('429');
  });

  it('sets message correctly', () => {
    expect(error.message).toBe('Too Many Requests');
  });
});
