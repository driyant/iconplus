import { describe, expect, it } from 'vitest';
import Sidebar from '../Sidebar';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../theme';
import { MemoryRouter } from 'react-router';

function renderSidebar(path = '/') {
  return render(
    <ChakraProvider theme={theme}>
      <MemoryRouter initialEntries={[path]}>
        <Sidebar />
      </MemoryRouter>
    </ChakraProvider>
  );
}

describe('Sidebar', () => {
  // Reset the document body before each test
  it('renders without crashing', () => {
    renderSidebar();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
  it('contains navigation links', () => {
    renderSidebar();
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
  it('Home button is active on root path', () => {
    renderSidebar('/');
    const homeBtn = screen.getByTestId('sidebar-home-button');
    const docBtn = screen.getByTestId('sidebar-booked-meeting-button');
    expect(homeBtn).toBeInTheDocument();
    expect(docBtn).toBeInTheDocument();
    expect(homeBtn).toHaveAttribute('aria-label', 'Home');
    expect(docBtn).toHaveAttribute('aria-label', 'Document');
  });

  it('Document button is active on /book-meeting path', () => {
    renderSidebar('/book-meeting');
    const homeBtn = screen.getByTestId('sidebar-home-button');
    const docBtn = screen.getByTestId('sidebar-booked-meeting-button');
    expect(homeBtn).toBeInTheDocument();
    expect(docBtn).toBeInTheDocument();
    expect(homeBtn).toHaveAttribute('aria-label', 'Home');
    expect(docBtn).toHaveAttribute('aria-label', 'Document');
  });

  it('renders navigation and both buttons', () => {
    renderSidebar('/');
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-home-button')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-booked-meeting-button')).toBeInTheDocument();
  });
});
