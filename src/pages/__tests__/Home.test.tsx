import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../theme';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router';
import Home from '../Home'; // Adjust the import path as necessary

describe('Home Page', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <Home />
        </ChakraProvider>
      </BrowserRouter>
    );
  });

  it('contains a link to book a meeting room', () => {
    expect(screen.getByRole('link', { name: /Pesan Ruangan/i })).toBeInTheDocument();
  });
});
