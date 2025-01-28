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
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import api from '../../services/api';

const Usuarios = () => {
  const [name, setName] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [listUsers, setListUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFields, setEditFields] = useState({
    name: '',
    cpfCnpj: '',
    phone: '',
    email: '',
  });
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/listar_clientes');
      setListUsers(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os usuários.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatCpfCnpj = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      // Formata CPF: 000.000.000-00
      return cleaned
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else {
      // Formata CNPJ: 00.000.000/0000-00
      return cleaned
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
  };

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      // Formata telefone: (XX) XXXX-XXXX
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    } else {
      // Formata celular: (XX) XXXXX-XXXX
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    }
  };

  const handleNewUser = async () => {
    if (!name || !cpfCnpj || !phone || !email) {
      toast({
        title: 'Atenção',
        description: 'Todos os campos são obrigatórios!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const newUser = {
        nome: name,
        cpf_cnpj: cpfCnpj.replace(/\D/g, ''), // Remove formatação antes de enviar
        telefone: phone.replace(/\D/g, ''), // Remove formatação antes de enviar
        email: email,
      };
      await api.post('/cadastrar_clientes', newUser);
      fetchUsers();
      setName('');
      setCpfCnpj('');
      setPhone('');
      setEmail('');
      toast({
        title: 'Sucesso',
        description: 'Usuário cadastrado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível cadastrar o usuário.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const removeUser = async (id) => {
    try {
      await api.delete(`/apagar_clientes?id=${id}`);
      fetchUsers();
      toast({
        title: 'Sucesso',
        description: 'Usuário removido com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o usuário.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const startEditingUser = (user) => {
    setEditingUserId(user.id);
    setEditFields({
      name: user.nome,
      cpfCnpj: user.cpf_cnpj,
      phone: user.telefone,
      email: user.email,
    });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditFields({ name: '', cpfCnpj: '', phone: '', email: '' });
  };

  const saveUser = async (id) => {
    if (!id) {
      console.error('ID do usuário não encontrado');
      return;
    }

    try {
      const updatedUser = {
        nome: editFields.name,
        cpf_cnpj: editFields.cpfCnpj.replace(/\D/g, ''),
        telefone: editFields.phone.replace(/\D/g, ''),
        email: editFields.email,
      };

      await api.put(`/editar_cliente/${id}`, updatedUser);
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
      );
      cancelEditing();
      toast({
        title: 'Sucesso',
        description: 'Usuário atualizado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o usuário.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

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
              onChange={(e) => setCpfCnpj(formatCpfCnpj(e.target.value))}
              placeholder="CPF/CNPJ"
              maxLength={18}
            />
            <Input
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="Telefone"
              maxLength={15}
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
                                cpfCnpj: formatCpfCnpj(e.target.value),
                              }))
                            }
                            maxLength={18}
                          />
                        </Td>
                        <Td>
                          <Input
                            value={editFields.phone}
                            onChange={(e) =>
                              setEditFields((prev) => ({
                                ...prev,
                                phone: formatPhone(e.target.value),
                              }))
                            }
                            maxLength={15}
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
                          <Button
                            colorScheme="blue"
                            onClick={() => saveUser(user.id)}
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
                        <Td>{user.nome}</Td>
                        <Td>{formatCpfCnpj(user.cpf_cnpj)}</Td>
                        <Td>{formatPhone(user.telefone)}</Td>
                        <Td>{user.email}</Td>
                        <Td>
                          <Button
                            colorScheme="yellow"
                            onClick={() => startEditingUser(user)}
                          >
                            EDITAR
                          </Button>
                          <Button
                            colorScheme="red"
                            onClick={() => removeUser(user.id)}
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
  );
};

export default Usuarios;