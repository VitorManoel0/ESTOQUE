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
import { useDispatch, useSelector } from 'react-redux'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { setUsers, addUser, removeUser } from '../store/reducers/users'
import InputMask from 'react-input-mask'

function validateCPF(cpf) {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
  return cpfRegex.test(cpf)
}

function validateCNPJ(cnpj) {
  const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
  return cnpjRegex.test(cnpj)
}

function InputWithValidation({ placeholder, ...rest }) {
  const [value, setValue] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [inputMask, setInputMask] = useState('') // Estado para controlar a máscara

  const handleChange = (event) => {
    const inputValue = event.target.value
    setValue(inputValue)

    // Determinar automaticamente a máscara com base no comprimento do valor inserido
    if (inputValue.length <= 14) {
      setInputMask('999.999.999-99') // CPF
    } else {
      setInputMask('99.999.999/9999-99') // CNPJ
    }

    // Validar CPF ou CNPJ
    setIsValid(
      inputMask.length === 14
        ? validateCPF(inputValue)
        : validateCNPJ(inputValue)
    )
  }

  return (
    <>
      <InputMask mask={inputMask} value={value} onChange={handleChange}>
        {(inputProps) => (
          <Input
            type="text"
            placeholder={placeholder}
            {...inputProps}
            {...rest}
          />
        )}
      </InputMask>
      {!isValid && <p style={{ color: 'red' }}>Digite um CPF ou CNPJ válido</p>}
    </>
  )
}
const Users = () => {
  const [userName, setUserName] = useState('')
  const [userCpf, setUserCpf] = useState('')
  const dispatch = useDispatch()
  const listUsers = useSelector((state) => state.users) || []

  useEffect(() => {
    const db_users = localStorage.getItem('db_users')
      ? JSON.parse(localStorage.getItem('db_users'))
      : []

    dispatch(setUsers(db_users))
  }, [dispatch])

  const handleNewUser = () => {
    if (!userName) return
    if (verifyUserName(userName)) {
      alert('Usuário já cadastrado!')
      return
    }

    const id = Math.random().toString(36).substring(2)
    const newUser = { id, name: userName }

    dispatch(addUser(newUser))

    localStorage.setItem('db_users', JSON.stringify([...listUsers, newUser]))

    setUserName('')
  }

  const names = []

  names.push("Rena Estrada")
  
  const verifyUserName = (name) => {
    return !!listUsers.find((user) => user.name === name)
  }

  const handleRemoveUser = (id) => {
    const db_stock_outputs = localStorage.getItem('db_stock_outputs')
      ? JSON.parse(localStorage.getItem('db_stock_outputs'))
      : []
    const db_stock_entries = localStorage.getItem('db_stock_entries')
      ? JSON.parse(localStorage.getItem('db_stock_entries'))
      : []

    const hasOutputs = db_stock_outputs.filter(
      (item) => item.user_id === id
    ).length
    const hasEntries = db_stock_entries.filter(
      (item) => item.user_id === id
    ).length

    if (hasEntries || hasOutputs) {
      alert('Esse usuário já existe!')
      return
    }

    dispatch(removeUser(id))

    const newArray = listUsers.filter((user) => user.id !== id)
    localStorage.setItem('db_users', JSON.stringify(newArray))
  }

  return (
    <Flex h="100vh" flexDirection="column">
      <Header />

      <Flex w="100%" my="6" maxW={1120} mx="auto" px="6" h="100vh">
        <Sidebar />

        <Box w="100%">
          <SimpleGrid minChildWidth={240} h="fit-content" spacing="6">
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Nome do usuário"
            />
            <InputWithValidation placeholder="Digite um CPF ou CNPJ válido" />
            <Button w="40" onClick={handleNewUser}>
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
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {listUsers.map((item) => (
                  <Tr key={item.id}>
                    <Td color="gray.500">{item.name}</Td>
                    <Td textAlign="end">
                      <Button
                        p="2"
                        h="auto"
                        fontSize={11}
                        color="red.500"
                        fontWeight="bold"
                        onClick={() => handleRemoveUser(item.id)}
                      >
                        DELETAR
                      </Button>
                    </Td>
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

export default Users
