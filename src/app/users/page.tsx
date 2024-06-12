"use client"
import React, { useEffect, useState } from "react";
import Modal from "@/components/modal/page_profile";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "@/components/ProtectedRoute"
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';   

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
  word-break: break-all;
`;

const Thead = styled.thead``;

const Tbody = styled.tbody``;

const Tr = styled.tr``;

const Th = styled.th`
  text-align: start;
  border-bottom: inset;
  padding-bottom: 5px;
`;

const Td = styled.td`
  padding: 15px 0;
  text-align: start;
  margin: 5px;
`;

const ScrollContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const formatBirthDate = (birthDateString: string) => {
  const birthDate = new Date(birthDateString);
  const day = birthDate.getDate().toString().padStart(2, '0');
  const month = (birthDate.getMonth() + 1).toString().padStart(2, '0');
  const year = birthDate.getFullYear().toString();
  return `${day}/${month}/${year}`;
};

interface User {
  id_usuario: number;
  id_prestador: number;
  ds_mail: string;
  ds_senha: string;
  Dt_cadastro: string;
  Sn_ativo: string;
  nome_prestador: string;
}

const Page = () => {
  const [data, setData] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState<User | null>(null);

  const addUser = async (userData: User) => {
    try {
      const response = await axios.post("https://api-production-58ca.up.railway.app/user", userData);
      console.log("Usuário criado com sucesso:", response.data);
      toast.success("Usuário criado com sucesso!");
      fetchData();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      toast.error("Erro ao criar usuário.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<User[]>("https://api-production-58ca.up.railway.app/user");
      const formattedData = response.data.map(item => ({
        ...item,
        dt_nascimento: formatBirthDate(item.Dt_cadastro),
      }));
      setData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Erro ao buscar dados.");
    }
  };

  const handleUpdateUser = async (userData: User) => {
    try {
      const response = await axios.put(`https://api-production-58ca.up.railway.app/user/${userData.id_usuario}`, userData);
      console.log("Usuário atualizado com sucesso:", response.data);
      toast.success("Usuário atualizado com sucesso!");
      fetchData(); 
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  };

  const handleDelete = async (id: number) => {
    confirmAlert({
      title: 'Confirmar Exclusão',
      message: 'Você tem certeza que deseja deletar este usuário?',
      buttons: [
        {
          label: 'Confirmar',
          onClick: async () => {
          try {
            console.log("Apagando usuário com ID:", id);
            await axios.delete(`https://api-production-58ca.up.railway.app/user/${id}`);
            console.log("User deleted successfully!");
        
            setData(prevData => prevData.filter(user => user.id_usuario !== id));
            toast.success("Usuário deletado com sucesso!");
          } catch (error) {
            console.error("Erro ao deletar usuário:", error);
            toast.error("Erro ao deletar usuário.");
          }
          }
        },
        {
          label: 'Cancelar',
          onClick: () => {}
        }
      ]
    });
  };

  const handleEditModalOpen = (user: User) => {
    setModalData(user); 
    setIsModalVisible(true); 
  };

  return (
    <main className="md:mt-5 2xl:mt-0 2xl:h-[91.5vh] w-full flex items-center justify-center">
      <Container>
        <div className="flex justify-between items-center py-2">
          <div className="text-gray-600 text-2xl font-semibold pb-2">Listagem de usuários</div>
          <Modal onAddUser={addUser} onUpdateUser={handleUpdateUser} initialUser={modalData}/>
        </div>

        <div className="bg-[#fff] p-4 rounded-lg shadow-lg	">
          <ScrollContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>Prestador</Th>
                  <Th>Dt. Cadastro</Th>
                  <Th>Ativo</Th>
                  <Th>Email</Th>
                  <Th></Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((item, i) => (
                  <Tr key={i}>
                    <Td width="200px">{item.nome_prestador}</Td> 
                    <Td width="200px">{formatBirthDate(item.Dt_cadastro)}</Td> 
                    <Td width="200px">{item.Sn_ativo === 'S' ? 'Sim' : 'Não'}</Td> 
                    <Td width="200px">{item.ds_mail}</Td>
                    <Td width="5%">
                      <FaEdit onClick={() => handleEditModalOpen(item)} style={{ cursor: 'pointer' }} />
                    </Td>
                    <Td width="5%">
                      <FaTrash onClick={() => handleDelete(item.id_usuario)} style={{ cursor: 'pointer' }} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ScrollContainer>
        </div>
      </Container>
      <ToastContainer />
    </main>
  );
};

export default ProtectedRoute(Page);
