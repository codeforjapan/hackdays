import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '../../../src/pages/index';
describe('Index page', () => {
  it('should render index', () => {
    render(<Home />);
    // render welcome text
    expect(screen.getByText('Find wonderful projects')).toBeInTheDocument();
  });
  it('should show index', () => {
    render(<Home />);
    expect(screen.getByText('Find wonderful projects')).toBeInTheDocument();
  });
});
