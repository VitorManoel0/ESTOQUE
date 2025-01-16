import {
  Box,
  Flex,
  SimpleGrid,
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

const Orders = () => {
  const [listProducts, setListProducts] = useState([])
  const [budgets, setBudgets] = useState([]) // Lista de orçamentos ativos

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/listar_produtos')
        setListProducts(data)
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
      }
    }

    const fetchBudgets = async () => {
      try {
        const { data } = await api.get('/listar_pedidos')
        setBudgets(data)
      } catch (error) {
        console.error('Erro ao buscar orçamentos:', error)
      }
    }

    fetchProducts()
    fetchBudgets()
  }, [])

  const getProductById = (id) => {
    return (
      listProducts.find((product) => product.id === id).name ||
      'Produto não encontrado'
    )
  }

  return (
    <Flex h="100vh" flexDirection="column">
      <Header />

      <Flex w="100%" my="6" maxW={1120} mx="auto" px="6" h="100vh">
        <Sidebar />

        <Box w="100%">
          <Box mt="8">
            <SimpleGrid columns={2} spacing={6}>
              {budgets.map((budget) => (
                <Box key={budget.pedido.id} p="4" shadow="md" borderWidth="1px">
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb="4"
                  >
                    <Box fontWeight="bold" fontSize="lg">
                      Cliente: {budget.pedido.clientName}
                    </Box>
                    <Box fontSize="lg" color="gray.600">
                      Valor: {budget.valor.toFixed(2)}
                    </Box>
                  </Flex>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Produto</Th>
                        <Th>Quantidade</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {budget.pedido.items.map((item, i) => (
                        <Tr key={i}>
                          <Td>{getProductById(item.product_id)}</Td>
                          <Td>{item.amount}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </Box>
      </Flex>
    </Flex>
  )
}

export default Orders
