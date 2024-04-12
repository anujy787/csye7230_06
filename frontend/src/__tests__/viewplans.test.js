import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import ViewPlans from '../pages/ViewPlans';

// Mocking Axios
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock('lottie-react', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('react-router-dom');

describe('ViewPlans component', () => {
  it('renders the component and displays plan details', async () => {
    // Mock plan data
    const mockPlan = {
      planId: '123',
      createdBy: 'John Doe',
      plannedDate: '2024-05-01',
      planName: 'Summer Vacation',
      source: 'New York',
      destination: 'Los Angeles',
      preferences: 'None',
      status: 'Planned',
      mapLink: 'https://maps.example.com',
      createdAt: '2024-04-01T08:00:00Z',
      updatedAt: '2024-04-05T10:30:00Z',
    };

    // Mock axios response for fetching plan
    axios.get.mockResolvedValueOnce({ data: mockPlan });

    render(<ViewPlans />);

    await waitFor(() => {
      expect(screen.getByText('Travel Plan Details')).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith('YOUR_BACKEND_API_URL/plans/');
  });

  it('displays loading message while fetching plan', async () => {
    // Mock axios response for fetching plan
    axios.get.mockResolvedValueOnce({ data: null });

    render(<ViewPlans />);

    // Ensure loading message is displayed
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for plan details to be displayed
    await waitFor(() => {
      // Ensure loading message is not displayed anymore
      expect(screen.queryByText(<div>Loading...</div>)).toBeNull();
    });
  });

  it('displays default plan details on error', async () => {
    // Mock axios response for fetching plan with error
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch plan'));

    render(<ViewPlans />);

    // Ensure default plan details are displayed
    await waitFor(() => {
      expect(screen.getByText('Travel Plan Details')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('123')).toBeInTheDocument();
    });
  });
});
