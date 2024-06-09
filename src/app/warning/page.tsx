"use client"
import React, { useEffect, useState } from "react";
import Modal from "@/components/modal/page";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import ProtectedRoute from "@/components/ProtectedRoute";

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
}

const Page = () => {
  const [data, setData] = useState<Warning[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState<Warning | null>(null);

  useEffect(() => {
    fetchData(); 
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<Warning[]>("https://api-production-58ca.up.railway.app/aviso");
      const formattedData = response.data.map(item => ({
        ...item,
        dt_agendamento: formatBirthDate(item.dt_agendamento),
        dt_cadastro: formatBirthDate(item.dt_cadastro),
      }));
      setData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddWarning = async (warningData: Warning) => {
    try {
      const response = await axios.post("https://api-production-58ca.up.railway.app/aviso", warningData);
      console.log("Aviso criado com sucesso:", response.data);
      fetchData();
    } catch (error) {
      console.error("Erro ao criar aviso:", error);
      toast.error("Erro ao criar aviso.")
    }
  };

  const handleCombinedAddWarning = async (warningData: Warning) => {
    await handleAddWarning(warningData);
  };

  const handleDelete = async (id: number) => {
    try {
      console.log("Deleting warning with ID:", id);
      await axios.delete(`https://api-production-58ca.up.railway.app/aviso/${id}`);
      console.log("Warning deleted successfully!");

      setData(prevData => prevData.filter(warning => warning.id_aviso_cirurgia !== id));
    } catch (error) {
      console.error("Erro ao deletar aviso:", error);
      toast.error("Erro ao deletar aviso.");
    }
  };
 

  return (
    <main className="2xl:h-full w-full flex items-center justify-center">
      <Container>
        <div className="flex justify-between items-center py-2">
          <div className="text-gray-600 text-2xl font-semibold pb-2">Listagem de avisos</div>
          <Modal onAddWarning={handleCombinedAddWarning}/>
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
                    <Td width="200px">{item.id_procedimento}</Td>
                    <Td width="200px">{item.id_prestador}</Td>
                    <Td width="200px">{item.id_paciente}</Td>
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


