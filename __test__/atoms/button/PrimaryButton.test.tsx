import { render, screen } from '@testing-library/react';
import { PrimaryButton } from '../../../src/components/atoms/button/PrimaryButton';

describe('PrimaryButton', () => {
  it('renders a child', () => {
    // For Jest+RTL demonstration purpose only
    // This test should not be done by us, but by chakra-ui.
    render(<PrimaryButton onClick={() => {}}>Hello</PrimaryButton>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
