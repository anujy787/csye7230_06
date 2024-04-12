import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import ForgotPassword from '../pages/ForgotPassword';

// Mocking Axios
jest.mock('axios', () => ({
  post: jest.fn(),
}));

jest.mock('lottie-react', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('react-router-dom');

describe('ForgotPassword component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders forgot password form', () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByPlaceholderText('Email');
    const resetButton = screen.getByText('Reset Password');
    const loginLink = screen.getByText('Forgot Password');

    expect(emailInput).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
  });

  it('updates email state on input change', () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByPlaceholderText('Email');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  it('handles password reset request successfully', async () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByPlaceholderText('Email');
    const resetButton = screen.getByText('Reset Password');

    // Mock successful reset password request
    axios.post.mockResolvedValueOnce({ status: 200 });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(resetButton);

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8000/v1/user/reset-password',
      {
        email: 'test@example.com',
      }
    );

    await waitFor(() => {
      const successMessage = screen.getByText(
        'Password reset email sent successfully.'
      );
      expect(successMessage).toBeInTheDocument();
    });
  });

  it('handles failed password reset request', async () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByPlaceholderText('Email');
    const resetButton = screen.getByText('Reset Password');

    // Mock failed reset password request
    axios.post.mockRejectedValueOnce(
      new Error('Failed to send reset password email.')
    );

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(resetButton);

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8000/v1/user/reset-password',
      {
        email: 'test@example.com',
      }
    );

    await waitFor(() => {
      const errorMessage = screen.getByText(
        'Failed to send reset password email.'
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
