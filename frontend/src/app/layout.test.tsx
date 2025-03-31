import { render } from '@testing-library/react';
import RootLayout from './layout';

jest.mock('next/font/google', () => ({
  Noto_Sans: () => ({ variable: 'mock-noto-sans-class' }),
  Doto: () => ({ variable: 'mock-doto-class' })
}));

jest.mock('@/components/ui/sonner', () => ({
  Toaster: () => <div data-testid="mock-toaster" />
}));

describe('RootLayout component', () => {
  describe('RootLayout', () => {
    it('should render children correctly', () => {
      const { getByTestId } = render(
        <RootLayout>
          <div data-testid="child-content">Test Content</div>
        </RootLayout>
      );

      expect(getByTestId('child-content')).toBeInTheDocument();
      expect(getByTestId('child-content')).toHaveTextContent('Test Content');
    });

    it('should include the Toaster component', () => {
      const { getByTestId } = render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      );

      expect(getByTestId('mock-toaster')).toBeInTheDocument();
    });
  });
});
