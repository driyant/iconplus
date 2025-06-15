import { Box } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router';

const RootLayout = () => {
  return (
    <>
      <Topbar />
      <Sidebar />
      <Box marginTop="60px" marginLeft="60px" minH="calc(100vh - 60px)" bg="#f7f7f7" p={2}>
        <Box mx="1rem">
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default RootLayout;
