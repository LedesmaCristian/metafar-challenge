export function getCurrentDay() {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 16);

  return formattedDate;
}

const INTERVAL_MS_MAP: Record<string, number> = {
  '5min':  300_000,
  '15min': 900_000,
  '30min': 1_800_000,
  '1h':    3_600_000,
  '2h':    7_200_000,
  '4h':    14_400_000,
  '1day':  86_400_000,
};

export function intervalToMs(interval: string): number {
  const ms = INTERVAL_MS_MAP[interval];
  if (ms === undefined) {
    throw new Error(`Unknown interval: "${interval}". Valid values: ${Object.keys(INTERVAL_MS_MAP).join(', ')}`);
  }
  return ms;
}
