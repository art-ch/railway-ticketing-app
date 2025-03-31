import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Clock } from './Clock';
import { getFormattedTime } from '@/utils/formatters';

jest.mock('@/utils/formatters', () => ({
  getFormattedTime: jest.fn()
}));

const getFormattedTimeMock = getFormattedTime as jest.MockedFunction<
  typeof getFormattedTime
>;

describe('Clock Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render correctly with initial time', () => {
    const mockDate = new Date('2023-01-01T12:00:00');
    jest.setSystemTime(mockDate);
    getFormattedTimeMock.mockReturnValue('12:00:00');

    render(<Clock />);

    expect(screen.getByText('12:00:00')).toBeInTheDocument();
    expect(getFormattedTimeMock).toHaveBeenCalledWith(expect.any(Date));
  });

  it('should update time every second', () => {
    const initialDate = new Date('2023-01-01T12:00:00');
    jest.setSystemTime(initialDate);
    getFormattedTimeMock.mockReturnValueOnce('12:00:00');

    render(<Clock />);
    expect(screen.getByText('12:00:00')).toBeInTheDocument();

    getFormattedTimeMock.mockReturnValueOnce('12:00:01');
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('12:00:01')).toBeInTheDocument();

    getFormattedTimeMock.mockReturnValueOnce('12:00:02');
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('12:00:02')).toBeInTheDocument();
  });

  it('should clear interval on unmount', () => {
    getFormattedTimeMock.mockReturnValue('12:00:00');

    const { unmount } = render(<Clock />);

    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();

    clearIntervalSpy.mockRestore();
  });
});
