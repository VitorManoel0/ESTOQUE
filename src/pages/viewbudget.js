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
  Select,
  Button,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import api from '../../services/api'

const Orders = () => {
  const [listProducts, setListProducts] = useState([])
  const [budgets, setBudgets] = useState([])
  const [filteredBudgets, setFilteredBudgets] = useState([])
  const [paymentFilter, setPaymentFilter] = useState('')
  const [deliveryFilter, setDeliveryFilter] = useState('')

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
        const budgetsWithStatus = data.map((budget) => ({
          ...budget,
        }))

        setBudgets(budgetsWithStatus)
        setFilteredBudgets(budgetsWithStatus)
      } catch (error) {
        console.error('Erro ao buscar orçamentos:', error)
      }
    }

    fetchProducts()
    fetchBudgets()
  }, [])

  const getProductById = (id) => {
    return (
      listProducts.find((product) => product.id === id)?.name ||
      'Produto não encontrado'
    )
  }

  const updateBudgetStatus = async (id, field, value) => {
    try {
      setBudgets((prev) =>
        prev.map((budget) =>
          budget.pedido.id === id ? { ...budget, [field]: value } : budget
        )
      )

      console.log(id, field, value)

      await api.put(`/atualizar_pedido/${id}`, {
        [field]: value,
      })

      const { data } = await api.get('/listar_pedidos')
      const budgetsWithStatus = data.map((budget) => ({
        ...budget,
      }))

      setBudgets(budgetsWithStatus)
      setFilteredBudgets(budgetsWithStatus)

      console.log(`Status ${field} atualizado para: ${value}`)
    } catch (error) {
      console.error(`Erro ao atualizar ${field}:`, error)
    }
  }

  const applyFilters = () => {
    const filtered = budgets.filter(
      (budget) =>
        (!paymentFilter || budget.statusPagamento === paymentFilter) &&
        (!deliveryFilter || budget.statusEntrega === deliveryFilter)
    )
    setFilteredBudgets(filtered)
  }

  return (
    <Flex h="100vh" flexDirection="column">
      <Header />

      <Flex w="100%" my="6" maxW={1120} mx="auto" px="6" h="100vh">
        <Sidebar />

        <Box w="100%">
          <Box mb="4">
            <Flex gap="4">
              <Select
                placeholder="Filtrar por Status de Pagamento"
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="AGUARDANDO">AGUARDANDO PGTO</option>
                <option value="PAGO">PAGO</option>
              </Select>
              <Select
                placeholder="Filtrar por Status de Entrega"
                onChange={(e) => setDeliveryFilter(e.target.value)}
              >
                <option value="AGUARDANDO">AGUARDANDO</option>
                <option value="ENTREGUE">ENTREGUE</option>
                <option value="RETIRADO">RETIRADO</option>
              </Select>
              <Button onClick={applyFilters}>Aplicar Filtros</Button>
            </Flex>
          </Box>
          <Box mt="8">
            <SimpleGrid columns={2} spacing={6}>
              {filteredBudgets.map((budget) => (
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
                  <Flex mt="4" gap="4">
                    <Select
                      value={budget.statusPagamento}
                      onChange={(e) =>
                        updateBudgetStatus(
                          budget.pedido.id,
                          'statusPagamento',
                          e.target.value
                        )
                      }
                    >
                      <option value="AGUARDANDO">AGUARDANDO PGTO</option>
                      <option value="PAGO">PAGO</option>
                    </Select>
                    <Select
                      value={budget.statusEntrega}
                      onChange={(e) =>
                        updateBudgetStatus(
                          budget.pedido.id,
                          'statusEntrega',
                          e.target.value
                        )
                      }
                    >
                      <option value="AGUARDANDO">AGUARDANDO</option>
                      <option value="ENTREGUE">ENTREGUE</option>
                      <option value="RETIRADO">RETIRADO</option>
                    </Select>
                  </Flex>
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
