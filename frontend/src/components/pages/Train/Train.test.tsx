import { render } from '@testing-library/react';
import { Train } from './Train';
import {
  BreakpointState,
  useBreakpoint
} from '@/hooks/useBreakpoint/useBreakpoint';
import { useTrainPageContext } from '@/app/[trainId]/context';

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
const useTrainPageContextMock = useTrainPageContext as jest.MockedFunction<
  typeof useTrainPageContext
>;

describe('Train component', () => {
  it('should render correctly', () => {
    useBreakpointMock.mockReturnValue({ xl: true } as BreakpointState);

    const { container } = render(<Train />);

    expect(container).toMatchSnapshot();
  });

  it('should show demo notice for small screen', () => {
    useBreakpointMock.mockReturnValue({ xl: false } as BreakpointState);

    const { container } = render(<Train />);

    expect(container).toMatchSnapshot();
  });

  it('should render correctly without train data', () => {
    useTrainPageContextMock.mockReturnValue({
      trainData: null,
      setTrainData: jest.fn()
    });

    const { container } = render(<Train />);

    expect(container).toMatchSnapshot();
  });
});
