import React from 'react';
import { render } from '@testing-library/react';
import TrainPage from './page';
import { Train } from '@/components/pages/Train/Train';

jest.mock('@/components/pages/Train/Train', () => ({
  Train: jest.fn(() => <div data-testid="mocked-train-component" />)
}));

const TrainMock = Train as jest.Mock;

describe('TrainPage', () => {
  beforeEach(() => {
    TrainMock.mockClear();
  });

  it('should render without crashing', async () => {
    const { container } = render(await TrainPage());
    expect(container).toBeInTheDocument();
  });

  it('should render the Train component', async () => {
    const { getByTestId } = render(await TrainPage());
    expect(getByTestId('mocked-train-component')).toBeInTheDocument();
  });
});
