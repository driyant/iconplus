import { Box, VStack, IconButton } from '@chakra-ui/react';
import { FiHome, FiFileText } from 'react-icons/fi';
import { Link, useLocation } from 'react-router';

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <Box
      as="nav"
      position="fixed"
      left={0}
      top="60px"
      h="calc(100vh - 60px)"
      w="60px"
      bg="white"
      borderRight="1px solid #E5EAF2"
      pt={6}
      zIndex={100}
      display="flex"
      flexDirection="column"
      alignItems="center"
      boxShadow={'0 0 10px rgba(0, 0, 0, 0.1)'}
      data-testid="sidebar"
    >
      <VStack spacing={4} w="100%">
        <Link to="/">
          <IconButton
            aria-label="Home"
            icon={<FiHome />}
            fontSize="xl"
            variant="ghost"
            color={pathname === '/' ? 'white' : '#4B5563'}
            bg={pathname === '/' ? '#4B98B6' : 'transparent'}
            _hover={{
              bg: pathname === '/' ? '#4B98B6' : 'gray.100',
              color: pathname === '/' ? 'white' : '#1876A1',
            }}
            borderRadius="md"
            w="40px"
            h="40px"
            data-testid="sidebar-home-button"
          />
        </Link>
        <Link to="/book-meeting">
          <IconButton
            aria-label="Document"
            icon={<FiFileText />}
            fontSize="xl"
            variant="ghost"
            color={pathname.startsWith('/book-meeting') ? 'white' : '#4B5563'}
            bg={pathname.startsWith('/book-meeting') ? '#4B98B6' : 'transparent'}
            _hover={{
              bg: pathname.startsWith('/book-meeting') ? '#4B98B6' : 'gray.100',
              color: pathname.startsWith('/book-meeting') ? 'white' : '#1876A1',
            }}
            borderRadius="md"
            w="40px"
            h="40px"
            data-testid="sidebar-booked-meeting-button"
          />
        </Link>
      </VStack>
    </Box>
  );
};

export default Sidebar;
