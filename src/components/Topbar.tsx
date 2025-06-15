import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { FiBell, FiChevronDown } from 'react-icons/fi';

const Topbar = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bgGradient="linear(to-r, #1CB5E0, #1876A1)"
      color="white"
      boxShadow="md"
      px={6}
      py={3}
      height={'60px'}
      zIndex={1000}
    >
      <Flex align="center" justify="space-between">
        {/* Left Section */}
        <HStack spacing={3} align="center" data-testid="logo">
          <Image src="/icon.png" alt="Logo" boxSize="40px" />
          <Box lineHeight="1">
            <Text fontSize="lg" fontWeight="bold">
              iMeeting
            </Text>
            <Text fontSize="xs" fontWeight="medium" opacity={0.8}>
              PLN
            </Text>
          </Box>
        </HStack>

        {/* Right Section */}
        <HStack spacing={4} data-testid="user-menu">
          <IconButton
            icon={<FiBell />}
            aria-label="Notifications"
            variant="ghost"
            _hover={{ bg: 'whiteAlpha.300' }}
            color={'white'}
          />
          <Avatar size="sm" name="John Doe" src="https://randomuser.me/api/portraits/men/32.jpg" />
          <Text fontSize="sm" fontWeight="medium">
            John Doe
          </Text>
          <Menu>
            <MenuButton as={HStack} cursor="pointer" spacing={2}>
              <FiChevronDown />
            </MenuButton>
            <MenuList color={'black'}>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Topbar;
