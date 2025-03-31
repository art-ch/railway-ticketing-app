import React from 'react';
import { render } from '@testing-library/react';
import HomePage from '@/app/page';
import { fetchTrainList } from './utils/utils';
import { HomeProps } from '@/components/pages/Home/Home';

jest.mock('./utils/utils', () => ({
  fetchTrainList: jest.fn()
}));

jest.mock('@/components/pages/Home/Home', () => ({
  Home: ({ trainList }: HomeProps) => (
    <div data-testid="home-component" data-train-count={trainList.length}>
      Home Component
    </div>
  )
}));

const fetchTrainListMock = fetchTrainList as jest.Mock;

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch a train list and passes it to Home component', async () => {
    const mockTrainList = [
      { id: '1', name: 'Express 101' },
      { id: '2', name: 'Local 202' }
    ];

    fetchTrainListMock.mockResolvedValue(mockTrainList);

    const { getByTestId } = render(await HomePage());

    expect(fetchTrainListMock).toHaveBeenCalledTimes(1);

    const homeComponent = getByTestId('home-component');
    expect(homeComponent).toHaveAttribute('data-train-count', '2');
  });

  it('should handle empty train list correctly', async () => {
    fetchTrainListMock.mockResolvedValue([]);

    const { getByTestId } = render(await HomePage());

    const homeComponent = getByTestId('home-component');
    expect(homeComponent).toHaveAttribute('data-train-count', '0');
  });

  it('should handle errors in fetching train list', async () => {
    // Mock console.error to prevent test output pollution
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    fetchTrainListMock.mockRejectedValue(new Error('Failed to fetch'));

    await expect(async () => {
      render(await HomePage());
    }).rejects.toThrow('Failed to fetch');

    expect(fetchTrainListMock).toHaveBeenCalledTimes(1);

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
