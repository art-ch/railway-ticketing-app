import { render } from '@testing-library/react';
import { Header } from './Header';

describe('Header component', () => {
  it('should render correctly', () => {
    const { container } = render(<Header bookingId={'1'} />);

    expect(container).toMatchSnapshot();
  });

  it('should render correctly without bookingid', () => {
    const { container } = render(<Header />);

    expect(container).toMatchSnapshot();
  });
});
