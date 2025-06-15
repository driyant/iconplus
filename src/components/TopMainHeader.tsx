import { Box } from '@chakra-ui/react';

const TopMainHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        {children}
      </Box>
    </>
  );
};

export default TopMainHeader;
