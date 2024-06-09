"use client"
import React, { useEffect, useState } from "react";
import Modal from "@/components/modal/page_patient";
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

const formatCPF = (cpf: string) => {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phoneNumber;
};

interface Patient {
  id_paciente: number;
  nm_paciente: string;
  nr_cpf: string;
  nr_telefone: string;
  dt_nascimento: string;
  tp_sexo: 'M' | 'F';
}

const Page = () => {
  const [data, setData] = useState<Patient[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState<Patient | null>(null);

  useEffect(() => {
    fetchData(); 
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<Patient[]>("https://api-production-58ca.up.railway.app//patient");
      const formattedData = response.data.map(item => ({
        ...item,
        dt_nascimento: formatBirthDate(item.dt_nascimento),
        tp_sexo: item.tp_sexo === 'M' ? 'Masculino' : 'Feminino',
        nr_cpf: formatCPF(item.nr_cpf),
      }));
      setData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddPatient = async (patientData: Patient) => {
    try {
      const response = await axios.post("https://api-production-58ca.up.railway.app/patient", patientData);
      console.log("Paciente criado com sucesso:", response.data);
      toast.success("Paciente criado com sucesso.");
      fetchData();
    } catch (error) {
      console.error("Erro ao criar paciente:", error);
      toast.error("Erro ao criar paciente.")
    }
  };

  const handleUpdatePatient = async (patientData: Patient) => {
    try {
      const response = await axios.put(`https://api-production-58ca.up.railway.app/patient/${patientData.id_paciente}`, patientData);
      console.log("Paciente atualizado com sucesso:", response.data);
      toast.success("Paciente atualizado com sucesso.");
      fetchData(); 
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
      toast.error("Erro ao atualizar paciente.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      console.log("Deleting patient with ID:", id);
      await axios.delete(`https://api-production-58ca.up.railway.app/patient/${id}`);
      console.log("Patient deleted successfully!");
  
      setData(prevData => prevData.filter(patient => patient.id_paciente !== id));
      toast.success("Paciente deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar paciente:", error);
      toast.error("Erro ao deletar paciente.");
    }
  };

  const handleEditModalOpen = (patient: Patient) => {
    setModalData(patient); 
    setIsModalVisible(true); 
  };
  

  return (
    <main className="h-full w-full flex items-center justify-center">
      <Container>
      <div className="flex items-center">
        <h1 className="text-gray-300 text-4xl font-bold">Sistema de controle de Hospitais | Página inicial</h1>
      </div>

        
      </Container>
      <ToastContainer />
    </main>
  );
};

export default ProtectedRoute(Page);
