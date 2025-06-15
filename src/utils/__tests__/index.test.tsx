// Create unit tests for the utils functions
import { describe } from 'vitest';
import { getTimeEndOptions, parseTimeToHour } from '../index';

describe('utils', () => {
  it('getTimeEndOptions should return options after the selected start time', () => {
    const timeList = [
      { label: '01:00', value: '01:00' },
      { label: '02:00', value: '02:00' },
      { label: '03:00', value: '03:00' },
      { label: '04:00', value: '04:00' },
      { label: '05:00', value: '05:00' },
    ];
    const timeStart = '02:00';
    const expected = [
      { label: '03:00', value: '03:00' },
      { label: '04:00', value: '04:00' },
      { label: '05:00', value: '05:00' },
    ];
    const result = getTimeEndOptions(timeList, timeStart);
    expect(result).toEqual(expected);
  });
  it('parseTimeToHour should return the hour part of the time string', () => {
    const time1 = '01:00';
    const time2 = '14:30';
    const time3 = '23:59';
    const time4 = '00:00';

    expect(parseTimeToHour(time1)).toBe(1);
    expect(parseTimeToHour(time2)).toBe(14);
    expect(parseTimeToHour(time3)).toBe(23);
    expect(parseTimeToHour(time4)).toBe(0);
  });
});
