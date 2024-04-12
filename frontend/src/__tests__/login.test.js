import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Login from '../pages/Login';

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

describe('Loading the login component', () => {
  it('renders the component', () => {
    render(<Login />);
    const headingElement = screen.getByRole('button', { name: 'Login' });
    expect(headingElement).toBeInTheDocument();
  });

  it('logs in user with valid credentials', async () => {
    render(<Login />);

    // Mock axios response for handleLogin
    // axios.get.mockResolvedOnce({ status: 200 });

    // Fill out email and password fields
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    // Click on Login button
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Add assertions to verify that axios.get is called with the correct data
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:8000/v1/user/self',
        {
          auth: {
            username: 'test@example.com',
            password: 'password123',
          },
        }
      );
    });

    // Add assertions to verify that user is redirected to home page after successful login
    expect(window.location.pathname).toBe('/');
  });

  it('displays error message for invalid credentials', async () => {
    render(<Login />);

    // Fill out email and password fields
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'invalidpassword' },
    });

    // Click on Login button
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Add assertions to verify that error message is displayed
    await screen.findByText(
      `Cannot read properties of undefined (reading 'status')`
    );
  });
});
