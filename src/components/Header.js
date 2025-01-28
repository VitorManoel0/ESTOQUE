import {
  Avatar,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import React from 'react'
import { useSidebarContext } from '../contexts/SidebarContext'
import { FiMenu } from 'react-icons/fi'

const Header = () => {
  const isMobile = useBreakpointValue({
    base: true,
    lg: false,
  })

  const { onOpen } = useSidebarContext()

  return (
    <Flex
      as="header"
      w="100%"
      maxW={1120}
      h="20"
      mx="auto"
      px="2"
      py="2"
      align="center"
      boxShadow="0 1px 0 #ccc"
      color="gray.500"
      fontWeight="bold"
    >
      {isMobile && (
        <IconButton
          icon={<Icon as={FiMenu} />}
          onClick={onOpen}
          variant="unstyled"
          fontSize="20"
          mr="2"
        ></IconButton>
      )}
      <Image
        src="/logo_meire.png"
        alt="Company Logo"
        h="8"
        objectFit="contain"
      />
      <Flex ml="auto">
        <HStack>
          <Text>Meire & Pinho locadora</Text>
          <Avatar size="md" name="Meire & Pinho locadora" />
        </HStack>
      </Flex>
    </Flex>
  )
}

export default Header
