import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text } from '@chakra-ui/react';
import TopMainHeader from '../components/TopMainHeader';
import { Link } from 'react-router';

const Home = () => {
  return (
    <>
      <TopMainHeader>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="#333">
            Ruang Meeting
          </Text>
          <Breadcrumb color="gray.500" fontSize="sm">
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Ruang Meeting</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
        <Link to="/book-meeting">
          <Button
            fontSize="14px"
            colorScheme="teal"
            borderRadius="md"
            leftIcon={<span style={{ fontWeight: 'bold', fontSize: '14px' }}>+</span>}
          >
            Pesan Ruangan
          </Button>
        </Link>
      </TopMainHeader>
    </>
  );
};

export default Home;
