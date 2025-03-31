import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { TrainPageProvider, useTrainPageContext } from './context';
import { Train } from 'railway-ticketing-app-sdk';

const mockTrain: Train = {
  trainId: 'train-123',
  trainType: 'express',
  name: 'Express 123',
  departureTime: '10:00',
  arrivalTime: '12:00',
  departureStation: 'London',
  arrivalStation: 'Manchester',
  seats: [{ seatNumber: 1, isBooked: false }]
};

// Test component that uses the context
const TestConsumer = () => {
  const { trainData, setTrainData } = useTrainPageContext();

  return (
    <div>
      <div data-testid="train-name">{trainData?.name || 'No train'}</div>
      <button
        data-testid="update-button"
        onClick={() => setTrainData(trainData ? null : mockTrain)}
      >
        Toggle Train
      </button>
    </div>
  );
};

describe('TrainPageContext', () => {
  it('should provide initial train data to consumers', () => {
    render(
      <TrainPageProvider pageData={mockTrain}>
        <TestConsumer />
      </TrainPageProvider>
    );

    expect(screen.getByTestId('train-name')).toHaveTextContent('Express 123');
  });

  it('should allow updating train data via setTrainData', () => {
    render(
      <TrainPageProvider pageData={mockTrain}>
        <TestConsumer />
      </TrainPageProvider>
    );

    // Initial state
    expect(screen.getByTestId('train-name')).toHaveTextContent('Express 123');

    // Update state
    act(() => {
      screen.getByTestId('update-button').click();
    });

    // State after update
    expect(screen.getByTestId('train-name')).toHaveTextContent('No train');

    // Toggle back
    act(() => {
      screen.getByTestId('update-button').click();
    });

    expect(screen.getByTestId('train-name')).toHaveTextContent('Express 123');
  });

  it('should initialize with null train data when not provided', () => {
    render(
      <TrainPageProvider pageData={null}>
        <TestConsumer />
      </TrainPageProvider>
    );

    expect(screen.getByTestId('train-name')).toHaveTextContent('No train');
  });

  it('should throw an error when useTrainPageContext is used outside of provider', () => {
    // Suppress console.error for this test to avoid noisy output
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useTrainPageContext must be used within a TrainPageProvider');

    // Restore console.error
    console.error = originalError;
  });
});
