import { render } from '@testing-library/react';
import { TrainInfo } from './TrainInfo';
import { useTrainPageContext } from '@/app/[trainId]/context';

jest.mock('@/app/[trainId]/context', () => ({
  useTrainPageContext: jest.fn().mockReturnValue({
    trainData: {
      trainId: '1',
      seats: [{ seatNumber: 1, isBooked: false }],
      trainType: 'local',
      name: 'train-name',
      departureStation: 'Kyiv',
      arrivalStation: 'Odesa',
      departureTime: '2025-03-31T05:05:11Z',
      arrivalTime: '2025-03-31T15:05:11Z'
    }
  })
}));

describe('BookingDataSkeleton component', () => {
  it('should be rendered correctly', () => {
    const { container } = render(<TrainInfo />);

    expect(container).toMatchSnapshot();
  });

  it('should be rendered correctly when there is no data', () => {
    (useTrainPageContext as jest.Mock).mockReturnValue({ trainData: null });

    const { container } = render(<TrainInfo />);

    expect(container).toMatchSnapshot();
  });
});
