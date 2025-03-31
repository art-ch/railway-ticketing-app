import { render } from '@testing-library/react';
import { Seat } from './Seat';

describe('Seat component', () => {
  it('should render correctly when seat is not booked', () => {
    const { container } = render(
      <Seat trainId="1" seat={{ seatNumber: 1, isBooked: false }} />
    );

    expect(container).toMatchSnapshot();
  });

  it('should render correctly when seat is booked', () => {
    const { container } = render(
      <Seat
        trainId="1"
        seat={{ seatNumber: 1, isBooked: true, bookingId: '1' }}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
