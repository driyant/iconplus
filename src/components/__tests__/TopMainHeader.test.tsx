import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import TopMainHeader from '../TopMainHeader';

describe('TopMainHeader', () => {
  it('should render children', () => {
    const children = <div>Test children</div>;
    const { getByText } = render(<TopMainHeader>{children}</TopMainHeader>);
    expect(getByText('Test children')).toBeInTheDocument();
  });
});
