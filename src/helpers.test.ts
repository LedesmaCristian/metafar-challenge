import { describe, it, expect } from 'vitest';
import { intervalToMs } from '@/helpers';

describe('intervalToMs', () => {
  it.each([
    ['5min', 300_000],
    ['15min', 900_000],
    ['30min', 1_800_000],
    ['1h', 3_600_000],
    ['2h', 7_200_000],
    ['4h', 14_400_000],
    ['1day', 86_400_000],
  ] as const)('maps "%s" → %i ms', (interval, expected) => {
    expect(intervalToMs(interval)).toBe(expected);
  });

  it('throws on an unknown interval', () => {
    expect(() => intervalToMs('99h')).toThrow('Unknown interval: "99h"');
  });

  it('throws and includes valid values in the error message', () => {
    expect(() => intervalToMs('1week')).toThrow('1week');
  });
});
