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

const Usuarios = () => {
  const [name, setName] = useState('')
  const [cpfCnpj, setCpfCnpj] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [listUsers, setListUsers] = useState([])
  const [editingUserId, setEditingUserId] = useState(null)
  const [editFields, setEditFields] = useState({
    name: '',
    cpfCnpj: '',
    phone: '',
    email: '',
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/listar_clientes')
      setListUsers(data)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    }
  }

  const handleNewUser = async () => {
    if (!name || !cpfCnpj || !phone || !email) {
      alert('Todos os campos são obrigatórios!')
      return
    }

    try {
      const newUser = {
        nome: name,
        cpf_cnpj: cpfCnpj,
        telefone: phone,
        email: email,
      }
      await api.post('/cadastrar_clientes', newUser)
      fetchUsers()
      setName('')
      setCpfCnpj('')
      setPhone('')
      setEmail('')
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error)
    }
  }

  const removeUser = async (id) => {
    try {
      await api.delete(`/apagar_clientes?id=${id}`)
      fetchUsers()
    } catch (error) {
      console.error('Erro ao remover usuário:', error)
    }
  }

  const startEditingUser = (user) => {
    setEditingUserId(user.id)
    setEditFields({
      name: user.nome,
      cpfCnpj: user.cpf_cnpj,
      phone: user.telefone,
      email: user.email,
    })
  }

  const cancelEditing = () => {
    setEditingUserId(null)
    setEditFields({ name: '', cpfCnpj: '', phone: '', email: '' })
  }

  const saveUser = async (id) => {
    if (!id) {
      console.error('ID do usuário não encontrado')
      return
    }

    try {
      const updatedUser = {
        nome: editFields.name,
        cpf_cnpj: editFields.cpfCnpj,
        telefone: editFields.phone,
        email: editFields.email,
      }

      await api.put(`/editar_cliente/${id}`, updatedUser)
      setListUsers(
        listUsers.map((user) =>
          user.id === id
            ? {
                ...user,
                nome: editFields.name,
                cpf_cnpj: editFields.cpfCnpj,
                telefone: editFields.phone,
                email: editFields.email,
              }
            : user
        )
      )
      cancelEditing()
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
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
              placeholder="Nome do usuário"
            />
            <Input
              value={cpfCnpj}
              onChange={(e) => setCpfCnpj(e.target.value)}
              placeholder="CPF/CNPJ"
            />
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Telefone"
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <Button w="40" onClick={handleNewUser}>
              CADASTRAR
            </Button>
          </SimpleGrid>

          <Box overflowY="auto" height="80vh">
            <Table mt="6">
              <Thead>
                <Tr>
                  <Th>Nome</Th>
                  <Th>CPF/CNPJ</Th>
                  <Th>Telefone</Th>
                  <Th>Email</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {listUsers.map((user) => (
                  <Tr key={user.id}>
                    {editingUserId === user.id ? (
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
                            value={editFields.cpfCnpj}
                            onChange={(e) =>
                              setEditFields((prev) => ({
                                ...prev,
                                cpfCnpj: e.target.value,
                              }))
                            }
                          />
                        </Td>
                        <Td>
                          <Input
                            value={editFields.phone}
                            onChange={(e) =>
                              setEditFields((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                          />
                        </Td>
                        <Td>
                          <Input
                            value={editFields.email}
                            onChange={(e) =>
                              setEditFields((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                          />
                        </Td>
                        <Td>
                          <Button colorScheme="blue" onClick={() => saveUser(user.id)}>
                            SALVAR
                          </Button>
                          <Button colorScheme="gray" onClick={cancelEditing}>
                            CANCELAR
                          </Button>
                        </Td>
                      </>
                    ) : (
                      <>
                        <Td>{user.nome}</Td>
                        <Td>{user.cpf_cnpj}</Td>
                        <Td>{user.telefone}</Td>
                        <Td>{user.email}</Td>
                        <Td>
                          <Button
                            colorScheme="yellow"
                            onClick={() => startEditingUser(user)}
                          >
                            EDITAR
                          </Button>
                          <Button colorScheme="red" onClick={() => removeUser(user.id)}>
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

export default Usuarios
