import { render, screen } from '@testing-library/react';
import VerifyEmail from '../pages/VerifyEmail';

it('renders welcome message', () => {
  render(<VerifyEmail />);
  const headingElement = screen.getByText('login');
  expect(headingElement).toBeInTheDocument();
});
