// src/theme.ts
import { extendTheme } from '@chakra-ui/react';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/700.css';

const theme = extendTheme({
  initialColorMode: 'light',
  useSystemColorMode: false,
  fonts: {
    heading: 'Open Sans, sans-serif',
    body: 'Open Sans, sans-serif',
  },
  components: {
    // Tambahkan custom components jika diperlukan
  },
});

export default theme;
