import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactUs from '../pages/ContactUs';

jest.mock('lottie-react', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('react-router-dom');

it('Render', () => {
  render(<ContactUs />);
  const headingElement = screen.getByText('Contact Us');
  expect(headingElement).toBeInTheDocument();
});

it('Verify Email present', () => {
  render(<ContactUs />);
  const headingElement = screen.getByText('ventureVerse@gmail.com');
  expect(headingElement).toBeInTheDocument();
});

it('submits form with valid data', async () => {
  render(<ContactUs />);

  // Fill in form fields
  fireEvent.change(screen.getByPlaceholderText('Name'), {
    target: { value: 'John Doe' },
  });
  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: 'john.doe@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('Message'), {
    target: { value: 'This is a test message' },
  });

  // Submit the form
  fireEvent.click(screen.getByRole('button'));
});
