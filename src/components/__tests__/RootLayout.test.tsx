import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import RootLayout from '../RootLayout';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../theme';
import { MemoryRouter } from 'react-router';

describe('RootLayout Component', () => {
  it('renders without crashing', () => {
    render(
      <ChakraProvider theme={theme}>
        <MemoryRouter>
          <RootLayout />
        </MemoryRouter>
      </ChakraProvider>
    );
  });
});
