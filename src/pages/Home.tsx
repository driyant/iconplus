import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Text,
  Link,
} from '@chakra-ui/react';
import TopMainHeader from '../components/TopMainHeader';

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
        <Link href="/book-meeting">
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
