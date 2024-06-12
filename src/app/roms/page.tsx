"use client";
import React, { useEffect, useState } from "react";
import Modal from "@/components/modal/page_rom";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
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

interface Sala {
  id_sala_cirurgica: number;
  nm_sala_cirurgica: string;
  id_cen_cirurgico: number;
}

interface CentroCirurgico {
  id_cen_cirurgico: number;
  nm_cen_cirurgico: string;
}

const Page = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [centros, setCentros] = useState<CentroCirurgico[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchSalas();
    fetchCentros();
  }, []);

  const fetchSalas = async () => {
    try {
      const response = await axios.get<Sala[]>("https://api-production-58ca.up.railway.app/sala");
      setSalas(response.data);
    } catch (error) {
      console.error("Error fetching salas:", error);
    }
  };

  const fetchCentros = async () => {
    try {
      const response = await axios.get<CentroCirurgico[]>("https://api-production-58ca.up.railway.app/centro");
      setCentros(response.data);
    } catch (error) {
      console.error("Error fetching centros:", error);
    }
  };

  const handleAddRoom = async (roomData: any) => {
    try {
      const response = await axios.post("https://api-production-58ca.up.railway.app/sala", roomData);
      console.log("Sala adicionada com sucesso:", response.data);
      toast.success("Sala adicionada com sucesso!")
      fetchSalas(); 
      setIsModalVisible(false); 
    } catch (error) {
      console.error("Erro ao adicionar sala:", error);
      toast.error("Erro ao adicionar sala.")
    }
  };

  const handleDelete = async (id: number) => {
    confirmAlert({
      title: 'Confirmar Exclusão',
      message: 'Você tem certeza que deseja deletar esta sala?',
      buttons: [
        {
          label: 'Confirmar',
          onClick: async () => {
          try {
            await axios.delete(`https://api-production-58ca.up.railway.app/sala/${id}`);
            console.log("Sala deletada com sucesso!");

            setSalas((prevSalas) => prevSalas.filter((sala) => sala.id_sala_cirurgica !== id));
            toast.success("Sala deletada com sucesso!");
          } catch (error) {
            console.error("Erro ao deletar sala:", error);
            toast.error("Erro ao deletar sala.");
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

  const getCentroNameById = (id_centro: number) => {
    const centro = centros.find((centro) => centro.id_cen_cirurgico === id_centro);
    return centro ? centro.nm_cen_cirurgico : "Desconhecido";
  };

  const handleEditModalOpen = (sala: Sala) => {
    console.log("Editar sala:", sala);
  };

  return (
    <main className="md:mt-5 2xl:mt-0 2xl:h-[91.5vh] w-full flex items-center justify-center">
      <Container>
        <div className="flex justify-between items-center py-2">
          <div className="text-gray-600 text-2xl font-semibold pb-2 mt-8">Listagem de salas</div>
          <Modal onAddRoom={handleAddRoom} />
        </div>
        <div className="bg-[#fff] p-4 rounded-lg shadow-lg">
          <ScrollContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>Sala</Th>
                  <Th>Centro Cirúrgico</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {salas.map((sala) => (
                  <Tr key={sala.id_sala_cirurgica}>
                    <Td width="500px">{sala.nm_sala_cirurgica}</Td>
                    <Td width="500px">{getCentroNameById(sala.id_cen_cirurgico)}</Td>
                    <Td width="5%">
                      <FaTrash onClick={() => handleDelete(sala.id_sala_cirurgica)} style={{ cursor: 'pointer' }} />
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