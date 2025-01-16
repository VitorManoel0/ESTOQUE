import {
  Box,
  Flex,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import api from '../../services/api'

const Balance = () => {
  const [listProducts, setListProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/listar_produtos_estoque') //
      const productsWithBalance = data.map((prod) => ({
        product_id: prod.id,
        product_name: prod.name,
        amount: prod.quantity || 0, 
      }))
      setListProducts(productsWithBalance)
      setFilteredProducts(productsWithBalance)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(listProducts)
      return
    }

    const newFilteredProducts = listProducts.filter((item) =>
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProducts(newFilteredProducts)
  }, [searchTerm, listProducts])

  return (
    <Flex h="100vh" flexDirection="column">
      <Header />

      <Flex w="100%" my="6" maxW={1120} mx="auto" px="6" h="100vh">
        <Sidebar />

        <Box w="100%">
          <Box mb="6">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome do produto"
            />
          </Box>

          <Box overflowY="auto" height="80vh">
            <Table mt="6">
              <Thead>
                <Tr>
                  <Th fontWeight="bold" fontSize="14px">
                    Nome
                  </Th>
                  <Th fontWeight="bold" fontSize="14px">
                    Qtd.
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredProducts.map((item, i) => (
                  <Tr key={i}>
                    <Td color="gray.500">{item.product_name}</Td>
                    <Td color="gray.500">{item.amount}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Flex>
    </Flex>
  )
}

export default Balance
