"use client"
import React, { useEffect, useState } from "react";
import Modal from "@/components/modal/page";
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
  padding: 15px 20px 15px 0;
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

interface Warning {
  id_aviso_cirurgia: number;
  id_paciente: number;
  tp_aviso: string;
  dt_cadastro: string;
  dt_agendamento: string;
  dt_tempo_previsto: string;
  id_prestador: number;
  tp_anestesia: string;
  sn_reserva_cti: string;
  sn_biopsia: string;
  sn_reserva_hemocomponentes: string;
  ds_justificativa: string;
  id_usuario: number;
  id_procedimento: string;
  tp_lateralidade: string;
  nome_procedimento?: string;
  materiais: {
      id_material: string,
      nr_quantidade: number
    }[];
}

interface MaterialData {
  id_aviso_cirurgia: number; 
  id_material: number; 
  quantidade: number;
}

interface Patient {
  id_paciente: number;
  nm_paciente: string;
}

interface Provider {
  id_prestador: number;
  nm_prestador: string;
}

const Page = () => {
  const [data, setData] = useState<Warning[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState<Warning | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    fetchData(); 
    fetchPatients();
    fetchProviders();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get<Patient[]>("https://api-production-58ca.up.railway.app/patient");
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await axios.get<Provider[]>("https://api-production-58ca.up.railway.app/worker");
      setProviders(response.data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const handleAddWarning = async (warningData: Warning) => {
    try {
      const response = await axios.post("https://api-production-58ca.up.railway.app/aviso", warningData);
      console.log("Aviso criado com sucesso:", response.data);
      const idAvisoCirurgia = response.data.id_aviso_cirurgia;

      const assocData = {
        id_aviso_cirurgia: idAvisoCirurgia,
        id_procedimento: warningData.id_procedimento, 
        tp_lateralidade: warningData.tp_lateralidade,
      };

      const response2 = await axios.post("https://api-production-58ca.up.railway.app/aviso2", assocData);
      console.log("Aviso associado à cirurgia com sucesso:", response2.data);

      const response3 = await axios.post("https://api-production-58ca.up.railway.app/materiais", {
        materiais: warningData.materiais.map(material => ({
          id_aviso_cirurgia: idAvisoCirurgia,
          id_material: material.id_material,
          nr_quantidade: material.nr_quantidade || 0
        }))
      });
      console.log("Materiais associados à cirurgia com sucesso:", response3.data);

      toast.success("Aviso criado com sucesso!");
      fetchData();
    } catch (error) {
      console.error("Erro ao criar aviso:", error);
      toast.error("Erro ao criar aviso.")
    }
  };

  const handleDelete = async (id: number) => {
    confirmAlert({
      title: 'Confirmar Exclusão',
      message: 'Você tem certeza que deseja deletar este aviso?',
      buttons: [
        {
          label: 'Confirmar',
          onClick: async () => {
          try {

            await axios.delete(`https://api-production-58ca.up.railway.app/materiais/${id}`);
            console.log("Warning materials deleted successfully!");

            await axios.delete(`https://api-production-58ca.up.railway.app/aviso2/${id}`);
            console.log("Surgery warning deleted successfully!");

            await axios.delete(`https://api-production-58ca.up.railway.app/aviso/${id}`);
            console.log("Warning deleted successfully!");
            
            toast.success("Aviso deletado com sucesso!");
            setData(prevData => prevData.filter(warning => warning.id_aviso_cirurgia !== id));
          } catch (error) {
            console.error("Erro ao deletar aviso:", error);
            toast.error("Erro ao deletar aviso.");
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

  const getPatientName = (id: number) => {
    const patient = patients.find(p => p.id_paciente === id);
    return patient ? patient.nm_paciente : "Desconhecido";
  };

  const getProviderName = (id: number) => {
    const provider = providers.find(p => p.id_prestador === id);
    return provider ? provider.nm_prestador : "Desconhecido";
  };

  const fetchData = async () => {
    try {
      const response = await axios.get<Warning[]>("https://api-production-58ca.up.railway.app/aviso");
      const formattedData = await Promise.all(response.data.map(async item => {
        try {
          const responseAviso2 = await axios.get(`https://api-production-58ca.up.railway.app/aviso2/2/${item.id_aviso_cirurgia}`);
          const id_procedimento = responseAviso2.data.id_procedimento; // Supondo que id_procedimento seja retornado corretamente
          if (id_procedimento) {
            const responseProcedimento = await axios.get(`https://api-production-58ca.up.railway.app/procedimentos/${id_procedimento}`);
            return {
              ...item,
              dt_agendamento: formatBirthDate(item.dt_agendamento),
              dt_cadastro: formatBirthDate(item.dt_cadastro),
              nome_procedimento: responseProcedimento.data.NO_PROCEDIMENTO 
            };
          } else {
            return {
              ...item,
              dt_agendamento: formatBirthDate(item.dt_agendamento),
              dt_cadastro: formatBirthDate(item.dt_cadastro),
              nome_procedimento: "" 
            };
          }
        } catch (error) {
          console.error(`Error fetching aviso2 or procedimento: ${error}`);
          return {
            ...item,
            dt_agendamento: formatBirthDate(item.dt_agendamento),
            dt_cadastro: formatBirthDate(item.dt_cadastro),
            nome_procedimento: "" 
          };
        }
      }));
      setData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  return (
    <main className="md:mt-5 2xl:mt-0 2xl:h-[91.5vh] w-full flex items-center justify-center">
      <Container>
        <div className="flex justify-between items-center py-2">
          <div className="text-gray-600 text-2xl font-semibold pb-2">Listagem de avisos</div>
          <Modal onAddWarning={handleAddWarning}/>
        </div>

        <div className="bg-[#fff] p-4 rounded-lg shadow-lg	">
          <ScrollContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>Cirurgia</Th>
                  <Th>Médico Responsável</Th>
                  <Th>Paciente</Th>
                  <Th>Dt. Agendamento</Th>
                  <Th></Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((item, i) => (
                  <Tr key={i}>
                    <Td width="600px">{item.nome_procedimento}</Td>
                    <Td width="250px">{getProviderName(item.id_prestador)}</Td>
                    <Td width="250px">{getPatientName(item.id_paciente)}</Td>
                    <Td width="200px">{item.dt_agendamento}</Td>
                    <Td width="5%">
                      <FaTrash onClick={() => handleDelete(item.id_aviso_cirurgia)} style={{ cursor: 'pointer' }} />
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


