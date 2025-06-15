/**
 * Function that returns an array of end time options that only includes times after the selected start time.
 * @param timeList - Array of time objects (e.g., [{label, value}, ...])
 * @param timeStart - The selected start time value (string)
 * @returns Array of end time options
 * @example
 * const time = [
 *   { label: '01:00', value: '01:00' },
 *   { label: '02:00', value: '02:00' },
 * ]
 */
export function getTimeEndOptions(timeList: { label: string; value: string }[], timeStart: string) {
  const startIdx = timeList.findIndex((t) => t.value === timeStart);
  return startIdx >= 0 ? timeList.slice(startIdx + 1) : timeList;
}

/**
 * Function that parses a time in string format (HH:mm) as an input and returns HH in integer format.
 * @param time - Time in string format (e.g., "01:00")
 * @returns Hour in integer format (e.g., 1 for "01:00")
 * @example
 * const hour = parseTimeToHour("01:00"); // returns 1
 * const hour = parseTimeToHour("14:00"); // returns 14
 */

export function parseTimeToHour(time: string): number {
  return parseInt(time.split(':')[0], 10);
}
