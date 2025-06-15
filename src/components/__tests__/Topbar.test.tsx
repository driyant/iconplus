import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Topbar from '../Topbar';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../theme';

function renderTopbar() {
  return render(
    <ChakraProvider theme={theme}>
      <Topbar />
    </ChakraProvider>
  );
}

describe('Topbar', () => {
  beforeEach(() => {
    renderTopbar();
  });

  it('should render menu dropdown', () => {
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('should render avatar', () => {
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
  });
});
