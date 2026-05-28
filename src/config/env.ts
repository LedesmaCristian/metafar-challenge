// Validates required env vars at module-load time so the app fails fast with
// a clear message instead of a cryptic API error at runtime.

const env = {
  TWELVE_DATA_API_KEY: import.meta.env.VITE_TWELVE_DATA_API_KEY as string,
  IS_DEV: import.meta.env.DEV as boolean,
  IS_PROD: import.meta.env.PROD as boolean,
} as const;

if (!env.TWELVE_DATA_API_KEY) {
  throw new Error(
    '[metafar] Missing VITE_TWELVE_DATA_API_KEY. ' +
      'Copy .env.example to .env and set your Twelve Data API key.',
  );
}

export default env;
