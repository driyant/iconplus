import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme'; // pastikan path theme sesuai project kamu

describe('App Component', () => {
  it('renders without crashing', () => {
    render(
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    );
    expect(screen.getByText(/Pesan Ruangan/i)).toBeInTheDocument();
  });
});
