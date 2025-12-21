import { render, screen } from '@testing-library/react';

describe('Jest works', () => {
  it('renders test text', () => {
    render(<div>Hello Jest</div>);
    expect(screen.getByText('Hello Jest')).toBeInTheDocument();
  });
});