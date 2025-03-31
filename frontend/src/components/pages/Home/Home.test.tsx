import {
  BreakpointState,
  useBreakpoint
} from '@/hooks/useBreakpoint/useBreakpoint';
import { render } from '@testing-library/react';
import { Home } from './Home';
import { Train } from 'railway-ticketing-app-sdk';

jest.mock('@/hooks/useBreakpoint/useBreakpoint', () => ({
  useBreakpoint: jest.fn().mockReturnValue({ xl: true } as BreakpointState)
}));

jest.mock('./components/Clock/Clock', () => ({
  Clock: () => <div>Clock</div>
}));

jest.mock('@/utils/formatters', () => ({
  getFormattedTime: jest.fn().mockReturnValue('12:00')
}));

const useBreakpointMock = useBreakpoint as jest.MockedFunction<
  typeof useBreakpoint
>;

describe('Home component', () => {
  // Store the original Date
  const originalDate = global.Date;

  // Setup mock date before tests
  beforeAll(() => {
    // Mock the Date to return a fixed date
    const mockDate = new Date('2023-01-01T12:00:00Z');
    global.Date = class extends Date {
      constructor() {
        super();
        return mockDate;
      }

      static now() {
        return mockDate.getTime();
      }
    } as DateConstructor;
  });

  // Restore original Date after tests
  afterAll(() => {
    global.Date = originalDate;
  });

  const trainList = [
    { trainId: '1', seats: [{ seatNumber: 1, isBooked: false }] }
  ] as Train[];

  it('should render correctly', () => {
    const { container } = render(<Home trainList={trainList} />);

    expect(container).toMatchSnapshot();
  });

  it('should show demo notice for small screen', () => {
    useBreakpointMock.mockReturnValue({ xl: false } as BreakpointState);

    const { container } = render(<Home trainList={trainList} />);

    expect(container).toMatchSnapshot();
  });
});
