import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookMeeting from '../BookMeeting';
import theme from '../../theme';

vi.mock('@fontsource/open-sans/400.css', () => ({}));
vi.mock('@fontsource/open-sans/700.css', () => ({}));
vi.mock('@chakra-ui/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@chakra-ui/react')>();
  return {
    ...actual,
    useToast: () => vi.fn(),
    extendTheme: actual.extendTheme,
  };
});

const mockFetch = vi.fn();
global.fetch = mockFetch;
vi.spyOn(console, 'error').mockImplementation(() => {});

const renderBookMeeting = () => {
  return render(
    <ChakraProvider theme={theme} resetCSS>
      <BookMeeting />
    </ChakraProvider>
  );
};

describe('BookMeeting Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockImplementation((url) => {
      if (url.includes('masterOffice') || url.includes('/mockApi/masterOffice.json')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: '1', officeName: 'UID BALI' },
              { id: '2', officeName: 'UID JAKARTA' },
            ]),
        });
      }
      if (url.includes('masterMeetingRooms') || url.includes('/mockApi/masterMeetingRooms.json')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: '101', roomName: 'Ruang Ganesha', officeId: '1', capacity: 10 },
            ]),
        });
      }
      if (
        url.includes('masterJenisKonsumsi') ||
        url.includes('/mockApi/masterJenisKonsumsi.json')
      ) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { name: 'Snack Siang', maxPrice: 10000 },
              { name: 'Makan Siang', maxPrice: 20000 },
              { name: 'Snack Sore', maxPrice: 15000 },
            ]),
        });
      }
      return Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' }),
      });
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should render without crashing', async () => {
    renderBookMeeting();
    expect(screen.getByText(/Informasi Ruang Meeting/i)).toBeInTheDocument();
  });

  it('should handle API fetch errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error')); // mock Error masterOffice
    mockFetch.mockRejectedValueOnce(new Error('Network error')); // mock Error masterMeetingRooms
    mockFetch.mockRejectedValueOnce(new Error('Network error')); // mock Error masterJenisKonsumsi
    renderBookMeeting();
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });

  it('should load and display initial data input unit', async () => {
    const response = await mockFetch('/api/masterOffice');
    const data = await response.json();
    expect(response.ok).toBe(true);
    expect(data).toEqual([
      { id: '1', officeName: 'UID BALI' },
      { id: '2', officeName: 'UID JAKARTA' },
    ]);
  });

  it('should load and display initial data input room', async () => {
    const response = await mockFetch('/api/masterMeetingRooms');
    const data = await response.json();
    expect(response.ok).toBe(true);
    expect(data).toEqual([{ id: '101', roomName: 'Ruang Ganesha', officeId: '1', capacity: 10 }]);
  });

  it('should load and display initial data input meal', async () => {
    const response = await mockFetch('/api/masterJenisKonsumsi');
    const data = await response.json();
    expect(response.ok).toBe(true);
    expect(data).toEqual([
      { name: 'Snack Siang', maxPrice: 10000 },
      { name: 'Makan Siang', maxPrice: 20000 },
      { name: 'Snack Sore', maxPrice: 15000 },
    ]);
  });

  it('option pilih unit should have length > 1', async () => {
    const { getByTestId } = renderBookMeeting();
    await waitFor(() => {
      const unitSelect = getByTestId('unit-select') as HTMLSelectElement;
      expect(unitSelect.options.length).toBeGreaterThan(1);
      expect(unitSelect.options[1].textContent).toBe('UID BALI');
      expect(unitSelect.options[2].textContent).toBe('UID JAKARTA');
    });
  });

  it('should filter rooms when unit is selected', async () => {
    renderBookMeeting();

    await waitFor(() => {
      expect(screen.getByText('UID BALI')).toBeInTheDocument();
    });

    // Select unit
    fireEvent.change(screen.getByTestId('unit-select'), {
      target: { value: '1' },
    });

    await waitFor(() => {
      expect(screen.getByText('Ruang Ganesha')).toBeInTheDocument();
    });
  });

  it('should update capacity when room is selected', async () => {
    renderBookMeeting();

    // Select unit first
    await waitFor(() => {
      expect(screen.getByText('UID BALI')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('unit-select'), {
      target: { value: '1' },
    });

    // select room
    await waitFor(() => {
      expect(screen.getByText('Ruang Ganesha')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/Ruang Meeting/i), {
      target: { value: 'Ruang Ganesha' },
    });

    expect(screen.getByLabelText(/Kapasitas/i)).toHaveValue('10');
  });

  it('should calculate total price correctly', async () => {
    renderBookMeeting();

    // Load data
    await waitFor(() => {
      expect(screen.getByText('UID BALI')).toBeInTheDocument();
    });

    // Fill form
    fireEvent.change(screen.getByTestId('unit-select'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Ruang Meeting/i), {
      target: { value: 'Ruang Ganesha' },
    });
    fireEvent.change(screen.getByLabelText(/Jumlah Peserta/i), {
      target: { value: '5' },
    });
    // Select meals
    fireEvent.click(screen.getByLabelText(/Snack Siang/i));
    fireEvent.click(screen.getByLabelText(/Makan Siang/i));

    await waitFor(() => {
      expect(screen.getByLabelText(/Nominal Konsumsi/i)).toHaveValue('150.000');
    });
  });

  it('should submit the form and cover handleSubmitForm', async () => {
    renderBookMeeting();

    // Wait data
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'UID BALI' })).toBeInTheDocument();
    });

    // Unit
    fireEvent.change(screen.getByTestId('unit-select'), { target: { value: '1' } });

    // Wait for room meeting
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Ruang Ganesha' })).toBeInTheDocument();
    });

    // Choose Room Meeting
    fireEvent.change(screen.getByLabelText(/Ruang Meeting/i), {
      target: { value: 'Ruang Ganesha' },
    });

    // Date
    fireEvent.change(screen.getByLabelText(/Tanggal Rapat/i), { target: { value: '2025-12-31' } });

    // Time start
    fireEvent.change(screen.getByLabelText(/Waktu Mulai/i), { target: { value: '10:00' } });

    // Time end
    await waitFor(() => {
      expect(
        screen.getByLabelText(/Waktu Selesai/i).querySelectorAll('option').length
      ).toBeGreaterThan(1);
    });

    // Pilih Waktu Selesai
    fireEvent.change(screen.getByLabelText(/Waktu Selesai/i), { target: { value: '12:00' } });

    // Capacity
    fireEvent.change(screen.getByLabelText(/Jumlah Peserta/i), { target: { value: '5' } });

    // Choose meals
    fireEvent.click(screen.getByLabelText(/Snack Siang/i));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Simpan/i })).toBeEnabled();
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Simpan/i }));

    await waitFor(() => {
      // Reset form
      expect(screen.getByTestId('unit-select')).toHaveValue('');
    });
  });

  it('should auto-select meals based on timeStart and timeEnd', async () => {
    renderBookMeeting();

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'UID BALI' })).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId('unit-select'), { target: { value: '1' } });
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Ruang Ganesha' })).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/Ruang Meeting/i), {
      target: { value: 'Ruang Ganesha' },
    });

    // Only Snack Siang meeting: (start 09:00, end 10:00) ---
    fireEvent.change(screen.getByLabelText(/Waktu Mulai/i), { target: { value: '09:00' } });
    fireEvent.change(screen.getByLabelText(/Waktu Selesai/i), { target: { value: '10:00' } });
    await waitFor(() => {
      expect(screen.getByLabelText(/Snack Siang/i)).toBeChecked();
      expect(screen.getByLabelText(/Makan Siang/i)).not.toBeChecked();
      expect(screen.getByLabelText(/Snack Sore/i)).not.toBeChecked();
    });

    // Lunch + Afternoon break snack (start 10:00, end 12:00) ---
    fireEvent.change(screen.getByLabelText(/Waktu Mulai/i), { target: { value: '10:00' } });
    fireEvent.change(screen.getByLabelText(/Waktu Selesai/i), { target: { value: '12:00' } });
    await waitFor(() => {
      expect(screen.getByLabelText(/Snack Siang/i)).toBeChecked();
      expect(screen.getByLabelText(/Makan Siang/i)).toBeChecked();
      expect(screen.getByLabelText(/Snack Sore/i)).not.toBeChecked();
    });

    // Lunch meeting between (start 11:00, end 14:00) ---
    fireEvent.change(screen.getByLabelText(/Waktu Mulai/i), { target: { value: '11:00' } });
    fireEvent.change(screen.getByLabelText(/Waktu Selesai/i), { target: { value: '14:00' } });
    await waitFor(() => {
      expect(screen.getByLabelText(/Snack Siang/i)).not.toBeChecked();
      expect(screen.getByLabelText(/Makan Siang/i)).toBeChecked();
      expect(screen.getByLabelText(/Snack Sore/i)).not.toBeChecked();
    });

    // Lunch + Snack Sore meeting: (start: 14:00, end 17:00) ---
    fireEvent.change(screen.getByLabelText(/Waktu Mulai/i), { target: { value: '14:00' } });
    fireEvent.change(screen.getByLabelText(/Waktu Selesai/i), { target: { value: '17:00' } });
    await waitFor(() => {
      expect(screen.getByLabelText(/Snack Siang/i)).not.toBeChecked();
      expect(screen.getByLabelText(/Makan Siang/i)).toBeChecked();
      expect(screen.getByLabelText(/Snack Sore/i)).toBeChecked();
    });

    // Only Snack Sore (start 15:00, end 17:00) ---
    fireEvent.change(screen.getByLabelText(/Waktu Mulai/i), { target: { value: '15:00' } });
    fireEvent.change(screen.getByLabelText(/Waktu Selesai/i), { target: { value: '17:00' } });
    await waitFor(() => {
      expect(screen.getByLabelText(/Snack Siang/i)).not.toBeChecked();
      expect(screen.getByLabelText(/Makan Siang/i)).not.toBeChecked();
      expect(screen.getByLabelText(/Snack Sore/i)).toBeChecked();
    });

    // All meals meeting: (start 09:00, end 17:00) ---
    fireEvent.change(screen.getByLabelText(/Waktu Mulai/i), { target: { value: '09:00' } });
    fireEvent.change(screen.getByLabelText(/Waktu Selesai/i), { target: { value: '17:00' } });
    await waitFor(() => {
      expect(screen.getByLabelText(/Snack Siang/i)).toBeChecked();
      expect(screen.getByLabelText(/Makan Siang/i)).toBeChecked();
      expect(screen.getByLabelText(/Snack Sore/i)).toBeChecked();
    });
  });

  it('should allow manual check and uncheck Snack Sore checkbox', async () => {
    renderBookMeeting();

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'UID BALI' })).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId('unit-select'), { target: { value: '1' } });
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Ruang Ganesha' })).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/Ruang Meeting/i), {
      target: { value: 'Ruang Ganesha' },
    });

    expect(screen.getByLabelText(/Snack Sore/i)).not.toBeChecked();

    fireEvent.click(screen.getByLabelText(/Snack Sore/i));
    expect(screen.getByLabelText(/Snack Sore/i)).toBeChecked();

    fireEvent.click(screen.getByLabelText(/Snack Sore/i));
    expect(screen.getByLabelText(/Snack Sore/i)).not.toBeChecked();
  });
});
