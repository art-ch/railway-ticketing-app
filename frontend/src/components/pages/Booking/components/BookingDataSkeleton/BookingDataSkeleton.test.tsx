import { render } from '@testing-library/react';
import { BookingDataSkeleton } from './BookingDataSkeleton';

describe('BookingDataSkeleton component', () => {
  it('should be rendered correctly', () => {
    const { container } = render(<BookingDataSkeleton />);

    expect(container).toMatchSnapshot();
  });
});
