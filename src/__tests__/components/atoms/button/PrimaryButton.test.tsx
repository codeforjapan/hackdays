import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { PrimaryButton } from '../../../../components/atoms/button/PrimaryButton';

describe('PrimaryButton', () => {
  it('renders a child', () => {
    const mockCallback = jest.fn();
    render(<PrimaryButton onClick={mockCallback}>Hello</PrimaryButton>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('calls onClick handler when it is clicked', async () => {
    const mockCallback = jest.fn();
    render(<PrimaryButton onClick={mockCallback}>Hello</PrimaryButton>);
    await userEvent.click(screen.getByRole('button'));
    expect(mockCallback).toBeCalledTimes(1);
  });
});
