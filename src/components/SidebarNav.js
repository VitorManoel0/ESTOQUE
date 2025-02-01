import React from 'react'
import { Box, Link as ChakraLink, Stack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const SidebarNav = () => {
  const { asPath } = useRouter()

  return (
    <Stack spacing="6">
      <Stack>
        <Text fontSize="md" fontWeight="bold" color="black.400">
          CADASTRO
        </Text>
        <Stack>
          <ChakraLink
            _hover={{ bg: 'gray.100' }}
            px="4"
            py="2"
            borderRadius={5}
            bg={asPath === '/' ? 'gray.200' : ''}
          >
            <Link href="/">
              <Text fontSize="xs" fontWeight="medium" color="gray.500">
                PRODUTOS
              </Text>
            </Link>
          </ChakraLink>
        </Stack>
        <Stack>
          <ChakraLink
            _hover={{ bg: 'gray.100' }}
            px="4"
            py="2"
            borderRadius={5}
            bg={asPath === '/user' ? 'gray.200' : ''}
          >
            <Link href="/user">
              <Text fontSize="xs" fontWeight="medium" color="gray.500">
                USUÁRIO
              </Text>
            </Link>
          </ChakraLink>
        </Stack>
      </Stack>
      <Stack>
        <Text fontSize="md" fontWeight="bold" color="black.400">
          ESTOQUE
        </Text>
        <Stack>
          <ChakraLink
            _hover={{ bg: 'gray.100' }}
            px="4"
            py="2"
            borderRadius={5}
            bg={asPath === '/balance' ? 'gray.200' : ''}
          >
            <Link href="/balance">
              <Text fontSize="xs" fontWeight="medium" color="gray.500">
                ESTOQUE GERAL
              </Text>
            </Link>
          </ChakraLink>
        </Stack>
      </Stack>
      <Stack>
        <Text fontSize="md" fontWeight="bold" color="black.400">
          PEDIDOS
        </Text>
        <Stack>
          <ChakraLink
            _hover={{ bg: 'gray.100' }}
            px="4"
            py="2"
            borderRadius={5}
            bg={asPath === '/budget' ? 'gray.200' : ''}
          >
            <Link href="/budget">
              <Text fontSize="xs" fontWeight="medium" color="gray.500">
                FAZER ORÇAMENTOS
              </Text>
            </Link>
          </ChakraLink>
          <ChakraLink
            _hover={{ bg: 'gray.100' }}
            px="4"
            py="2"
            borderRadius={5}
            bg={asPath === '/stockEntries' ? 'gray.200' : ''}
          >
            <Link href="/stockEntries">
              <Text fontSize="xs" fontWeight="medium" color="gray.500">
                EFETUAR PEDIDOS
              </Text>
            </Link>
          </ChakraLink>
          <ChakraLink
            _hover={{ bg: 'gray.100' }}
            px="4"
            py="2"
            borderRadius={5}
            bg={asPath === '/viewbudget' ? 'gray.200' : ''}
          >
            <Link href="/viewbudget">
              <Text fontSize="xs" fontWeight="medium" color="gray.500">
                VISUALIZAR PEDIDOS
              </Text>
            </Link>
          </ChakraLink>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default SidebarNav
