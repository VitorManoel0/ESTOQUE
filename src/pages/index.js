import {
  Box,
  Button,
  Flex,
  Input,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import api from '../../services/api'

const Produtos = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [listProducts, setListProducts] = useState([])
  const [editingProductId, setEditingProductId] = useState(null)
  const [replacement, setReplacement] = useState('')
  const [editFields, setEditFields] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    replacement: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/listar_produtos')
      setListProducts(data)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    }
  }

  const handleNewProduct = async () => {
    if (!name || !description || !price || !quantity || !replacement) {
      alert('Todos os campos são obrigatórios!')
      return
    }

    try {
      const newProduct = {
        nome: name,
        descricao: description,
        preco: parseFloat(price),
        quantidade: parseInt(quantity),
        reposicao: parseInt(replacement),
      }
      const { data } = await api.post('/cadastrar_produto', newProduct)
      setName('')
      setDescription('')
      setPrice('')
      setQuantity('')
      setReplacement('')
      fetchProducts()
    } catch (error) {
      console.error('Erro ao adicionar produto:', error)
    }
  }

  const removeProduct = async (id) => {
    try {
      await api.delete(`/apagar_produto?id=${id}`)
      setListProducts(listProducts.filter((prod) => prod.id !== id))
    } catch (error) {
      console.error('Erro ao remover produto:', error)
    }
  }

  const startEditingProduct = (product) => {
    setEditingProductId(product.id)
    setEditFields({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      replacement: product.replacement.toString(),
    })
  }

  const cancelEditing = () => {
    setEditingProductId(null)
    setEditFields({
      name: '',
      description: '',
      price: '',
      quantity: '',
      replacement: '',
    })
  }

  const saveProduct = async (id) => {
    if (!id) {
      console.error('ID do produto não encontrado')
      return
    }

    try {
      const updatedProduct = {
        nome: editFields.name,
        descricao: editFields.description,
        preco: parseFloat(editFields.price),
        quantidade: parseInt(editFields.quantity),
        reposicao: parseInt(editFields.replacement),
      }

      await api.put(`/editar_produto/${id}`, updatedProduct)
      fetchProducts()
      cancelEditing()
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
    }
  }

  return (
    <Flex h="100vh" flexDirection="column">
      <Header />
      <Flex w="100%" my="6" maxW={1120} mx="auto" px="6" h="100vh">
        <Sidebar />
        <Box w="100%">
          <SimpleGrid minChildWidth={240} h="fit-content" spacing="6">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do produto"
            />
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do produto"
              maxLength={66}
            />
            <Input
              value={price}
              type="number"
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Preço do produto"
            />
            <Input
              value={replacement}
              type="number"
              onChange={(e) => setReplacement(e.target.value)}
              placeholder="Reposição da Unidade"
            />
            <Input
              value={quantity}
              type="number"
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantidade"
            />
            <Button w="40" onClick={handleNewProduct}>
              CADASTRAR
            </Button>
          </SimpleGrid>
          <Box overflowY="auto" height="80vh">
            <Table mt="6">
              <Thead>
                <Tr>
                  <Th fontWeight="bold" fontSize="14px">
                    Nome
                  </Th>
                  <Th fontWeight="bold" fontSize="14px">
                    Descrição
                  </Th>
                  <Th fontWeight="bold" fontSize="14px">
                    Preço
                  </Th>
                  <Th fontWeight="bold" fontSize="14px">
                    Reposição
                  </Th>
                  <Th fontWeight="bold" fontSize="14px">
                    Qtd
                  </Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {listProducts.map((item) => (
                  <Tr key={item.id}>
                    {editingProductId === item.id ? (
                      <>
                        <Td>
                          <Input
                            value={editFields.name}
                            onChange={(e) =>
                              setEditFields((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                          />
                        </Td>
                        <Td>
                          <Input
                            value={editFields.description}
                            maxLength={66}
                            onChange={(e) =>
                              setEditFields((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                          />
                        </Td>
                        <Td>
                          <Input
                            value={editFields.price}
                            type="number"
                            onChange={(e) =>
                              setEditFields((prev) => ({
                                ...prev,
                                price: e.target.value,
                              }))
                            }
                          />
                        </Td>
                        <Td>
                          <Input
                            value={editFields.replacement}
                            type="number"
                            onChange={(e) =>
                              setEditFields((prev) => ({
                                ...prev,
                                replacement: e.target.value,
                              }))
                            }
                          />
                        </Td>
                        <Td>
                          <Input
                            value={editFields.quantity}
                            type="number"
                            onChange={(e) =>
                              setEditFields((prev) => ({
                                ...prev,
                                quantity: e.target.value,
                              }))
                            }
                          />
                        </Td>
                        <Td textAlign="end">
                          <Button
                            colorScheme="blue"
                            onClick={() => saveProduct(item.id)}
                          >
                            SALVAR
                          </Button>
                          <Button colorScheme="gray" onClick={cancelEditing}>
                            CANCELAR
                          </Button>
                        </Td>
                      </>
                    ) : (
                      <>
                        <Td color="gray.500">{item.name}</Td>
                        <Td color="gray.500">{item.description}</Td>
                        <Td color="gray.500">
                          {item.price !== undefined && item.price !== null
                            ? `R$ ${item.price.toFixed(2)}`
                            : 'Preço não informado'}
                        </Td>
                        <Td color="gray.500">
                          {item.replacement !== undefined && item.replacement !== null
                            ? `R$ ${item.replacement.toFixed(2)}`
                            : 'Reposição não informada'}
                        </Td>
                        <Td color="gray.500">{item.quantity}</Td>
                        <Td textAlign="end">
                          <Button
                            colorScheme="yellow"
                            onClick={() => startEditingProduct(item)}
                          >
                            EDITAR
                          </Button>
                          <Button
                            colorScheme="red"
                            onClick={() => removeProduct(item.id)}
                          >
                            DELETAR
                          </Button>
                        </Td>
                      </>
                    )}
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

export default Produtos