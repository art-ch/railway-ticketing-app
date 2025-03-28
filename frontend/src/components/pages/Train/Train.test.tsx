import { render } from '@testing-library/react';
import { Train } from './Train';
import {
  BreakpointState,
  useBreakpoint
} from '@/hooks/useBreakpoint/useBreakpoint';

jest.mock('@/app/[trainId]/context', () => ({
  useTrainPageContext: jest.fn().mockReturnValue({
    trainData: { trainId: '1', seats: [{ seatNumber: 1, isBooked: false }] }
  })
}));

jest.mock('@/hooks/useBreakpoint/useBreakpoint', () => ({
  useBreakpoint: jest.fn()
}));

const useBreakpointMock = useBreakpoint as jest.MockedFunction<
  typeof useBreakpoint
>;

describe('Train component', () => {
  it('should render correctly', () => {
    useBreakpointMock.mockReturnValue({ xl: true } as BreakpointState);

    const { container } = render(<Train />);

    expect(container).toMatchSnapshot();
  });

  it('should demo notice for small screen', () => {
    useBreakpointMock.mockReturnValue({ xl: false } as BreakpointState);

    const { container } = render(<Train />);

    expect(container).toMatchSnapshot();
  });
});
