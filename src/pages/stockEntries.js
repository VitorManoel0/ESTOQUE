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

  useEffect(() => {
    // Fetch clientes
    const fetchClients = async () => {
      try {
        const { data } = await api.get('/listar_clientes')
        setListClients(data)
      } catch (error) {
        console.error('Erro ao buscar clientes:', error)
      }
    }

    // Fetch produtos
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

    console.log(listClients)
  }, [])

  const handleAddItem = () => {
    if (!amount || product_id === '0') {
      return alert('Selecione um produto e insira a quantidade!')
    }

    const existingItem = orderItems.find(
      (item) => item.product_id === product_id
    )
    if (existingItem) {
      // Atualizar a quantidade do item existente
      setOrderItems(
        orderItems.map((item) =>
          item.product_id === product_id
            ? { ...item, amount: parseInt(item.amount) + parseInt(amount) }
            : item
        )
      )
    } else {
      // Adicionar novo item à lista de itens do pedido
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

    console.log(orderItems, 'orderItems')

    const newOrder = {
      client_id,
      items: orderItems.map((item) => ({
        product_id: item.product_id,
        amount: parseInt(item.amount),
      })),
    }

    try {
      const response = await api.post('/create_orders', newOrder)

      if (response.status == 200){
        alert('Pedido salvo com sucesso!')
        console.log(response.data)
      }


      // Limpar os campos
      setClientId('0')
      setOrderItems([])
    } catch (error) {
      alert(error.response.data.detail)
    }
  }

  const getProductById = (id) => {
    return (
      listProducts.find((product) => product.id == id)?.name ||
      'Produto não encontrado'
    )
  }

  return (
    <Flex h="100vh" flexDirection="column">
      <Header />

      <Flex w="100%" my="6" maxW={1120} mx="auto" px="6" h="100vh">
        <Sidebar />

        <Box w="100%">
          <SimpleGrid minChildWidth={240} h="fit-content" spacing="6">

            {/* Seleção do Produto */}
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

            {/* Quantidade */}
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

          {/* Lista de Itens do Pedido */}
          <Box overflowY="auto" height="40vh">
            <Table mt="6">
              <Thead>
                <Tr>
                  <Th fontWeight="bold" fontSize="14px">
                    Produto
                  </Th>
                  <Th fontWeight="bold" fontSize="14px">
                    Quantidade
                  </Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {orderItems.map((item, i) => (
                  <Tr key={i}>
                    <Td color="gray.500">{getProductById(item.product_id)}</Td>
                    <Td color="gray.500">{item.amount}</Td>
                    <Td textAlign="end">
                      <Button
                        p="2"
                        h="auto"
                        fontSize={11}
                        color="red.500"
                        fontWeight="bold"
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
          
          {/* Seleção do Cliente */}
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

          {/* Botão para Salvar o Pedido */}
          <Button mt="4" colorScheme="green" onClick={handleSaveOrder}>
            SALVAR PEDIDO
          </Button>
        </Box>
      </Flex>
    </Flex>
  )
}

export default Orders
