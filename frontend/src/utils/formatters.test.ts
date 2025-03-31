import {
  getFormattedTime,
  getFormattedDate,
  getFormattedDateTime
} from './formatters';

describe('Formatter functions', () => {
  describe('getFormattedTime', () => {
    it('should format time in 24-hour format with hours and minutes', () => {
      const date = new Date(2023, 0, 1, 14, 30, 45); // Jan 1, 2023, 14:30:45
      expect(getFormattedTime(date)).toBe('14:30');
    });

    it('should pad single-digit hours with leading zero', () => {
      const date = new Date(2023, 0, 1, 9, 5, 0); // Jan 1, 2023, 09:05:00
      expect(getFormattedTime(date)).toBe('09:05');
    });

    it('should pad single-digit minutes with leading zero', () => {
      const date = new Date(2023, 0, 1, 12, 5, 0); // Jan 1, 2023, 12:05:00
      expect(getFormattedTime(date)).toBe('12:05');
    });

    it('should handle midnight correctly', () => {
      const date = new Date(2023, 0, 1, 0, 0, 0); // Jan 1, 2023, 00:00:00
      expect(getFormattedTime(date)).toBe('00:00');
    });
  });

  describe('getFormattedDate', () => {
    it('should format date in YYYY-MM-DD format', () => {
      const date = new Date(2023, 0, 1); // Jan 1, 2023
      expect(getFormattedDate(date)).toBe('2023-01-01');
    });

    it('should pad single-digit months with leading zero', () => {
      const date = new Date(2023, 8, 15); // Sep 15, 2023
      expect(getFormattedDate(date)).toBe('2023-09-15');
    });

    it('should pad single-digit days with leading zero', () => {
      const date = new Date(2023, 10, 5); // Nov 5, 2023
      expect(getFormattedDate(date)).toBe('2023-11-05');
    });

    it('should handle leap years correctly', () => {
      const date = new Date(2024, 1, 29); // Feb 29, 2024 (leap year)
      expect(getFormattedDate(date)).toBe('2024-02-29');
    });
  });

  describe('getFormattedDateTime', () => {
    it('should combine formatted date and time with a space separator', () => {
      const date = new Date(2023, 0, 1, 14, 30, 45); // Jan 1, 2023, 14:30:45
      expect(getFormattedDateTime(date)).toBe('2023-01-01 14:30');
    });

    it('should handle edge cases like midnight', () => {
      const date = new Date(2023, 11, 31, 0, 0, 0); // Dec 31, 2023, 00:00:00
      expect(getFormattedDateTime(date)).toBe('2023-12-31 00:00');
    });

    it('should handle edge cases like end of day', () => {
      const date = new Date(2023, 11, 31, 23, 59, 59); // Dec 31, 2023, 23:59:59
      expect(getFormattedDateTime(date)).toBe('2023-12-31 23:59');
    });
  });

  describe('Time zone handling', () => {
    // Note: These tests may be affected by the environment's time zone settings
    // They're included to demonstrate how to test time zone considerations

    it('should use the same format regardless of system time zone', () => {
      // Create a specific UTC time
      const utcDate = new Date(Date.UTC(2023, 0, 1, 12, 0, 0));

      // The formatted time might vary based on the test environment's time zone,
      // but the format should remain consistent
      const formattedTime = getFormattedTime(utcDate);
      expect(formattedTime).toMatch(/^\d{2}:\d{2}$/);

      const formattedDate = getFormattedDate(utcDate);
      expect(formattedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
