"use client"
import React, { useEffect, useState } from "react";
import Modal from "@/components/modal/page_provider";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import ProtectedRoute from "@/components/ProtectedRoute";
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
  return `${year}-${month}-${day}`;
};

const formatBirthDateForDisplay = (birthDateString: string) => {
  const birthDate = new Date(birthDateString);
  const day = birthDate.getDate().toString().padStart(2, '0');
  const month = (birthDate.getMonth() + 1).toString().padStart(2, '0');
  const year = birthDate.getFullYear().toString();
  return `${day}/${month}/${year}`;
};

const formatCPF = (cpf: string) => {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

interface Provider {
  id_prestador: number;
  nm_prestador: string;
  nr_cpf: string;
  ds_tip_presta: string;
  dt_nascimento: string;
  ds_codigo_conselho: string;
  ds_cep: string;
  id_especialidade: number;
}

const Page = () => {
  const [data, setData] = useState<Provider[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState<Provider | null>(null);
  const [especialidades, setEspecialidades] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
    fetchEspecialidades();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<Provider[]>("https://api-production-58ca.up.railway.app/worker");
      const formattedData = response.data.map(item => ({
        ...item,
        dt_nascimento: formatBirthDate(item.dt_nascimento),
        nr_cpf: formatCPF(item.nr_cpf),
      }));
      setData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchEspecialidades = async () => {
    try {
      const response = await axios.get<any[]>("https://api-production-58ca.up.railway.app/especialidade");
      setEspecialidades(response.data);
    } catch (error) {
      console.error('Error fetching especialidades:', error);
    }
  };

  const handleAddProvider = async (providerData: Provider) => {
    try {
      const response = await axios.post("https://api-production-58ca.up.railway.app/worker", providerData);
      console.log("Prestador criado com sucesso:", response.data);
      toast.success("Prestador criado com sucesso!");
      fetchData(); 
    } catch (error) {
      console.error("Erro ao criar prestador:", error);
      toast.error("Erro ao criar prestador.");
    }
  };

  const handleUpdateProvider = async (providerData: Provider) => {
    try {
      const response = await axios.put(`https://api-production-58ca.up.railway.app/worker/${providerData.id_prestador}`, providerData);
      console.log("Prestador atualizado com sucesso:", response.data);
      toast.success("Prestador atualizado com sucesso!");
      fetchData(); 
    } catch (error) {
      console.error("Erro ao atualizar prestador:", error);
      toast.error("Erro ao atualizar prestador.");
    }
  };

  const handleDelete = (id: number) => {
    confirmAlert({
      title: 'Confirmar Exclusão',
      message: 'Você tem certeza que deseja deletar este prestador?',
      buttons: [
        {
          label: 'Confirmar',
          onClick: async () => {
            try {
              console.log("Deleting worker with ID:", id);
              await axios.delete(`https://api-production-58ca.up.railway.app/worker/${id}`);
              console.log("Patient deleted successfully!");
      
              setData(prevData => prevData.filter(provider => provider.id_prestador !== id));
              toast.success("Prestador deletado com sucesso!");
            } catch (error) {
              console.error("Erro ao deletar prestador:", error);
              toast.error("Erro ao deletar prestador.");
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

  const handleEditModalOpen = (provider: Provider) => {
    setModalData(provider); 
    setIsModalVisible(true); 
  };

  const formatTipoPrestador = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'medico':
        return 'Médico';
      case 'operacional':
        return 'Operacional';
      case 'administrativo':
        return 'Administrativo';
      default:
        return tipo; 
    }
  };

  return (
    <main className="md:mt-5 2xl:mt-0 2xl:h-[91.5vh] w-full flex items-center justify-center">
      <Container>
        <div className="flex justify-between items-center py-2">
          <div className="text-gray-600 text-2xl font-semibold pb-2">Listagem de prestadores</div>
          <Modal onAddProvider={handleAddProvider} onUpdateProvider={handleUpdateProvider} initialProvider={modalData} />
        </div>

        <div className="bg-[#fff] p-4 rounded-lg shadow-lg	">
          <ScrollContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>Nome</Th>
                  <Th>CPF</Th>
                  <Th>Dt. Nascimento</Th>
                  <Th>Área de Atuação</Th>
                  <Th>Especialidade</Th>
                  <Th></Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((item, i) => (
                  <Tr key={i}>
                    <Td width="200px">{item.nm_prestador}</Td>
                    <Td width="200px">{item.nr_cpf}</Td>
                    <Td width="200px">{formatBirthDateForDisplay(item.dt_nascimento)}</Td>
                    <Td width="200px">{formatTipoPrestador(item.ds_tip_presta)}</Td>
                    <Td width="270px">
                      {especialidades.find((especialidade) => especialidade.id_especialidade === item.id_especialidade)?.ds_especialidade || ''}
                    </Td>
                    <Td width="5%">
                      <FaEdit onClick={() => handleEditModalOpen(item)} style={{ cursor: 'pointer' }} />
                    </Td>
                    <Td width="5%">
                      <FaTrash onClick={() => handleDelete(item.id_prestador)} style={{ cursor: 'pointer' }} />
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
