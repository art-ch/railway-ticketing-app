import { render } from '@testing-library/react';
import { PassengerInfo } from './PassengerInfo';
import { PassengerDetails } from 'railway-ticketing-app-sdk';

describe('Passenger Info component', () => {
  it('should render correctly', () => {
    const passengerInfo = {
      name: 'gdjskalg',
      email: 'fgdjsalkg@gmail.com',
      phone: '5784397654645'
    } as PassengerDetails;

    const { container } = render(
      <PassengerInfo passengerInfo={passengerInfo} />
    );

    expect(container).toMatchSnapshot();
  });
});
