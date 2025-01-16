import {
  Box,
  Button,
  Flex,
  Input,
  Select,
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
  const [client_id, setClientId] = useState('0')
  const [product_id, setProductId] = useState('0')
  const [amount, setAmount] = useState('')
  const [orderItems, setOrderItems] = useState([])
  const [listClients, setListClients] = useState([])
  const [listProducts, setListProducts] = useState([])
  const [budgets, setBudgets] = useState([])

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await api.get('/listar_clientes')
        setListClients(data)
      } catch (error) {
        console.error('Erro ao buscar clientes:', error)
      }
    }

    const fetchBudgets = async () => {
      try {
        const { data } = await api.get('/listar_budgets')
        setBudgets(data)
      } catch (error) {
        console.error('Erro ao buscar orçamentos:', error)
      }
    }

    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/listar_produtos')
        setListProducts(data)
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
      }
    }

    fetchClients()
    fetchProducts()
    fetchBudgets()
  }, [])

  const handleAddItem = () => {
    if (!amount || product_id === '0') {
      return alert('Selecione um produto e insira a quantidade!')
    }

    const existingItem = orderItems.find(
      (item) => item.product_id === product_id
    )
    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.product_id === product_id
            ? { ...item, amount: parseInt(item.amount) + parseInt(amount) }
            : item
        )
      )
    } else {
      setOrderItems([...orderItems, { product_id, amount }])
    }

    setProductId('0')
    setAmount('')
  }

  const handleRemoveItem = (product_id) => {
    setOrderItems(orderItems.filter((item) => item.product_id !== product_id))
  }

  const handleSaveOrder = async () => {
    if (client_id === '0' || orderItems.length === 0) {
      return alert('Selecione um cliente e adicione itens ao pedido!')
    }

    const newOrder = {
      client_id,
      items: orderItems.map((item) => ({
        product_id: item.product_id,
        amount: parseInt(item.amount),
      })),
    }

    try {
      await api.post('/create_budget', newOrder)
      setClientId('0')
      setOrderItems([])
      const { data } = await api.get('/listar_budgets')
      setBudgets(data)
    } catch (error) {
      console.error('Erro ao salvar pedido:', error)
      alert('Erro ao salvar pedido.')
    }
  }

  const handleExportPDF = async (budgetId) => {
    try {
      // Faz a requisição POST para a API
      const response = await api.post(`/export_pdf/${budgetId}`, null, {
        responseType: 'blob', // Garante que a resposta seja um blob (para arquivos)
      })

      // Converte o blob em um URL temporário
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = `orcamento_${budgetId}.pdf` // Define o nome do arquivo
      document.body.appendChild(link)
      link.click()

      // Remove o link após o uso
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      console.log('PDF baixado com sucesso')
    } catch (error) {
      console.error('Erro ao exportar o PDF:', error)
    }
  }

  const handleApproveBudget = async (budgetId) => {
    await api.patch(`/update_budget/${budgetId}`)
    const { data } = await api.get('/listar_budgets')
    setBudgets(data)
  }

  const handleDeleteBudget = async (budgetId) => {
    try {
      await api.delete(`/delete_budget/${budgetId}`)
      const { data } = await api.get('/listar_budgets')
      setBudgets(data)
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error)
      alert('Erro ao excluir orçamento.')
    }
  }

  const getProductById = (id) => {
    console.log(listProducts, 'a')
    const response =
      listProducts.find((product) => product.id == id).name ||
      'Produto não encontrado'

    console.log(response)

    return response
  }

  return (
    <Flex h="100vh" flexDirection="column">
      <Header />

      <Flex w="100%" my="6" maxW={1120} mx="auto" px="6" h="100vh">
        <Sidebar />

        <Box w="100%">
          <SimpleGrid minChildWidth={240} h="fit-content" spacing="6">
            <Select
              value={client_id}
              onChange={(e) => setClientId(e.target.value)}
            >
              <option value="0">Selecione um cliente</option>
              {listClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nome}
                </option>
              ))}
            </Select>

            <Select
              value={product_id}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="0">Selecione um produto</option>
              {listProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </Select>

            <Input
              placeholder="Quantidade"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <Button w="40" onClick={handleAddItem}>
              ADICIONAR ITEM
            </Button>
          </SimpleGrid>

          <Box overflowY="auto" height="40vh">
            <Table mt="6">
              <Thead>
                <Tr>
                  <Th>Produto</Th>
                  <Th>Quantidade</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {orderItems.map((item, i) => (
                  <Tr key={i}>
                    <Td>{getProductById(item.product_id)}</Td>
                    <Td>{item.amount}</Td>
                    <Td textAlign="end">
                      <Button
                        color="red.500"
                        onClick={() => handleRemoveItem(item.product_id)}
                      >
                        REMOVER
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <Button mt="4" colorScheme="green" onClick={handleSaveOrder}>
            SALVAR PEDIDO
          </Button>

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
                  <Box mt="4">
                    <Button
                      size="sm"
                      mr="2"
                      onClick={() => handleExportPDF(budget.pedido.id)}
                    >
                      Exportar PDF
                    </Button>
                    <Button
                      size="sm"
                      mr="2"
                      colorScheme="green"
                      onClick={() => handleApproveBudget(budget.pedido.id)}
                    >
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDeleteBudget(budget.pedido.id)}
                    >
                      Apagar
                    </Button>
                  </Box>
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