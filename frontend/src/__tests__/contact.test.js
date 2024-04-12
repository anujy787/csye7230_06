import { render, screen } from '@testing-library/react';
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
