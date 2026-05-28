// Wraps Twelve Data (and HTTP) errors with structured metadata, enabling
// consumers to branch on status/code without string-parsing the message.

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
    // Restore prototype chain (required when extending built-ins in TS)
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
