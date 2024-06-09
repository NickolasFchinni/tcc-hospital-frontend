import React, { useEffect, useState } from "react";
import axios from "axios";
import addPatientIcon from "../../assets/icons/Union.png";
import Image from 'next/image';
import { FaEdit } from "react-icons/fa";

interface Patient {
  id_paciente: number;
  nm_paciente: string;
  nr_cpf: string;
  ds_cep: string;
  nm_mae: string;
  nr_telefone: string;
  dt_nascimento: string;
  tp_sexo: 'M' | 'F';
  tp_estado_civil: string
  nr_cns: string
}

interface ModalProps {
  onAddPatient: (patientData: Patient) => Promise<void>;
  onUpdatePatient?: (patientData: Patient) => Promise<void>;
  initialPatient: Patient | null;
}

const normalizeCpf = (cpf: string) => cpf.replace(/[^\d]/g, "");

const normalizePhone = (phone: string) => phone.replace(/[^\d]/g, "");

const normalizeCep = (cep: string) => cep.replace(/[^\d]/g, "");

const Modal: React.FC<ModalProps> = ({ onAddPatient, onUpdatePatient, initialPatient }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [cep, setCep] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [cpf, setCpf] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [cns, setCns] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    if (initialPatient) {
      setPatientName(initialPatient.nm_paciente);
      setMotherName(initialPatient.nm_mae);
      setCep(initialPatient.ds_cep);
      setBirthDate(initialPatient.dt_nascimento);
      setCpf(initialPatient.nr_cpf);
      setMaritalStatus(initialPatient.tp_estado_civil);
      setCns(initialPatient.nr_cns);
      setPhone(initialPatient.nr_telefone);
      setGender(initialPatient.tp_sexo === "M" ? "Masculino" : "Feminino");
      setIsEditing(true); 
      setIsModalVisible(true); 
    } else {
      setIsEditing(false); 
    }
  }, [initialPatient]);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    clearFormFields();
  };

  const clearFormFields = () => {
    setPatientName("");
    setMotherName("");
    setCep("");
    setBirthDate("");
    setCpf("");
    setMaritalStatus("");
    setCns("");
    setPhone("");
    setGender("");
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const patientData: Patient = {
      id_paciente: initialPatient?.id_paciente || 0,
      nm_paciente: patientName,
      nm_mae: motherName,
      ds_cep: normalizeCep(cep),
      dt_nascimento: birthDate,
      nr_cpf: normalizeCpf(cpf),
      tp_estado_civil: maritalStatus,
      nr_cns: cns,
      nr_telefone: normalizePhone(phone),
      tp_sexo: gender === "Masculino" ? "M" : "F",
    };

    try {
      if (initialPatient && onUpdatePatient) {
        await onUpdatePatient(patientData);
      } else {
        await onAddPatient(patientData);
      }

      clearFormFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Erro ao criar/atualizar paciente:", error);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsModalVisible(false);
      clearFormFields();
      setIsEditing(false);
    }
  };

  return (
    <div>
      <div style={{ cursor: 'pointer' }} onClick={openModal} className="flex justify-center content-center">
        <Image src={addPatientIcon} alt="Ícone de Adicionar Paciente" className="mr-2 w-7 h-6"/>
        <button className="font-semibold text-custom-teal">
          Adicionar Paciente
        </button>
      </div>
      {isModalVisible ? (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center" onClick={handleOverlayClick}>
          <div className="bg-white rounded-lg p-6 w-[766px] h-[430px] relative">
            <h1 className="text-center text-2xl font-bold mb-4 mt-4 text-blue-500">
              Paciente
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-wrap justify-between px-6">
              <div className="flex flex-col md:w-1/2 mb-4">
                <label htmlFor="patientName">Nome do Paciente:</label>
                <input
                  type="text"
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[320px]"
                  required
                />
              </div>
              <div className="flex flex-col md:w-1/2 mb-4">
                <label htmlFor="motherName">Nome da Mãe:</label>
                <input
                  type="text"
                  id="motherName"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[320px]"
                  required
                />
              </div>
              <div className="flex flex-col md:w-1/4 mb-4">
                <label htmlFor="cep">CEP:</label>
                <input
                  type="text"
                  id="cep"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[150px]"
                  required
                />
              </div>
              <div className="flex flex-col md:w-1/4 mb-4">
                <label htmlFor="birthDate">Dt. Nascimento</label>
                <input
                  type="date"
                  id="birthDate"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[150px]"
                  required
                />
              </div>
              <div className="flex flex-col md:w-1/4 mb-4">
                <label htmlFor="cpf">CPF:</label>
                <input
                  type="text"
                  id="cpf"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[150px]"
                  required
                />
              </div>
              <div className="flex flex-col md:w-1/4 mb-4">
                <label htmlFor="maritalStatus">Estado Civil:</label>
                <select
                  id="maritalStatus"
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[150px]"
                  required
                  >
                  <option value="">Selecione</option>
                  <option value="Solteiro">Solteiro</option>
                  <option value="Casado">Casado</option>
                  <option value="Divorciado">Divorciado</option>
                  <option value="Viúvo">Viúvo</option>
                </select>
              </div>
              <div className="flex flex-col md:w-1/3 mb-4">
                <label htmlFor="cns">Número do CNS:</label>
                <input
                  type="text"
                  id="cns"
                  value={cns}
                  onChange={(e) => setCns(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[191px]"
                  required
                />
              </div>
              <div className="flex flex-col md:w-1/3 mb-4">
                <label htmlFor="phone">Telefone:</label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[191px]"
                  required
                />
              </div>
              <div className="flex flex-col md:w-1/3 mb-4">
                <label htmlFor="gender">Sexo:</label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[191px]"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>
              <button
                type="submit"
                className="font-semibold bg-gradient-to-b from-cyan-600 to-blue-800 text-white py-2 px-5 rounded mt-5"
              >
                Enviar
              </button>
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 bg-gray-500 text-white py-1 px-2 rounded"
              >
                Fechar
              </button>
            </form>
          </div>
        </div>
      ): null}
    </div>
  );
};

export default Modal;


