import { describe, expect, it } from 'vitest';
import {
  getMasterOfficeUrl,
  getMasterMeetingRoomsUrl,
  getMasterOfMealTypeUrl,
  time,
} from '../constant';

describe('constant', () => {
  it('should have correct API URLs', () => {
    expect(getMasterOfficeUrl).toBe(
      'https://6666c7aea2f8516ff7a4e261.mockapi.io/api/dummy-data/masterOffice'
    );
    expect(getMasterMeetingRoomsUrl).toBe(
      'https://6666c7aea2f8516ff7a4e261.mockapi.io/api/dummy-data/masterMeetingRooms'
    );
    expect(getMasterOfMealTypeUrl).toBe(
      'https://6686cb5583c983911b03a7f3.mockapi.io/api/dummy-data/masterJenisKonsumsi'
    );
  });

  it('should have correct time options', () => {
    expect(time.length).toBe(24);
    expect(time[0]).toEqual({ label: '00:00', value: '00:00' });
    expect(time[time.length - 1]).toEqual({ label: '23:00', value: '23:00' });
  });
});
