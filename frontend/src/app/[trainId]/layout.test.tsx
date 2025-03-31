import { render, screen } from '@testing-library/react';
import TrainPageLayout, { generateMetadata } from './layout';
import { fetchTrain } from './utils/utils';
import { notFound } from 'next/navigation';
import { getFormattedTime } from '@/utils/formatters';
import { TrainPageData } from './context';

// Mock dependencies
jest.mock('./utils/utils', () => ({
  fetchTrain: jest.fn()
}));

jest.mock('next/navigation', () => ({
  notFound: jest.fn()
}));

jest.mock('@/utils/formatters', () => ({
  getFormattedTime: jest.fn()
}));

jest.mock('./context', () => ({
  TrainPageProvider: ({
    children,
    pageData
  }: {
    children: React.ReactNode;
    pageData: TrainPageData;
  }) => (
    <div
      data-testid="train-page-provider"
      data-page-data={JSON.stringify(pageData)}
    >
      {children}
    </div>
  )
}));

describe('TrainPageLayout', () => {
  const mockTrainInfo = {
    trainId: '123',
    departureStation: 'London',
    arrivalStation: 'Manchester',
    departureTime: '2023-05-15T10:30:00Z',
    name: 'Express Train',
    trainType: 'High Speed'
  };

  const mockParams = { trainId: '123' };
  const mockChildren = <div data-testid="children-content">Child Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
    (getFormattedTime as jest.Mock).mockReturnValue('10:30 AM');
  });

  it('should render train information correctly', async () => {
    (fetchTrain as jest.Mock).mockResolvedValue(mockTrainInfo);

    render(
      await TrainPageLayout({ children: mockChildren, params: mockParams })
    );

    expect(fetchTrain).toHaveBeenCalledWith('123');
    expect(
      screen.getByText('London → Manchester, 10:30 AM')
    ).toBeInTheDocument();
    expect(screen.getByText('Express Train')).toBeInTheDocument();
    expect(screen.getByText('High Speed')).toBeInTheDocument();
    expect(screen.getByTestId('train-page-provider')).toHaveAttribute(
      'data-page-data',
      JSON.stringify(mockTrainInfo)
    );
    expect(screen.getByTestId('children-content')).toBeInTheDocument();
  });

  it('should call notFound when train info is not available', async () => {
    (fetchTrain as jest.Mock).mockResolvedValue(null);

    try {
      await TrainPageLayout({ children: mockChildren, params: mockParams });
      // If we reach here, the test should fail because notFound should have been called
      fail('Expected notFound to be called');
    } catch {
      // This is expected
    }

    expect(fetchTrain).toHaveBeenCalledWith('123');
    expect(notFound).toHaveBeenCalled();
  });

  describe('generateMetadata', () => {
    it('should return correct metadata for a train', async () => {
      const metadata = await generateMetadata({ params: mockParams });

      expect(metadata).toEqual({
        title: 'Train | 123',
        description: 'Information about train 123'
      });
    });
  });
});
