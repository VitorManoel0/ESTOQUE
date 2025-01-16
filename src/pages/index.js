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
  const [quantity, setQuantity] = useState(0)
  const [listProducts, setListProducts] = useState([])
  const [editingProductId, setEditingProductId] = useState(null) // Armazena o ID do produto em edição
  const [editFields, setEditFields] = useState({
    name: '',
    description: '',
    price: '',
    quantity: 0,
  }) // Campos para edição

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
    if (!name || !description || !price || !quantity) {
      alert('Todos os campos são obrigatórios!')
      return
    }

    try {
      const newProduct = {
        nome: name,
        descricao: description,
        preco: parseFloat(price),
        quantidade: parseInt(quantity),
      }
      const { data } = await api.post('/cadastrar_produto', newProduct)
      // Limpa os campos
      setName('')
      setDescription('')
      setPrice('')
      setQuantity('')
    } catch (error) {
      console.error('Erro ao adicionar produto:', error)
    }
  }

  const removeProduct = async (id) => {
    try {
      await api.delete(`/apagar_produto?id=${id}`) // Usando ID como parâmetro
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
      price: product.price,
      quantity: parseInt(product.quantity),
    })
  }

  const cancelEditing = () => {
    setEditingProductId(null)
    setEditFields({ name: '', description: '', price: '', quantity: 0 })
  }

  const saveProduct = async (id) => {
    fetchProducts()
    if (!id) {
      console.error('ID do produto não encontrado')
      return
    }

    try {
      const newObject = {
        nome: editFields.name,
        descricao: editFields.description,
        preco: parseFloat(editFields.price),
        quantidade: parseInt(editFields.quantity),
      }

      console.log(newObject, 'newObject')

      await api.put(`/editar_produto/${id}`, newObject)

      setListProducts(
        listProducts.map((prod) =>
          prod.id === id
            ? {
                ...prod,
                name: editFields.name,
                description: editFields.description,
                price: parseFloat(editFields.price),
                quantity: parseInt(editFields.quantity),
              }
            : prod
        )
      )
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
