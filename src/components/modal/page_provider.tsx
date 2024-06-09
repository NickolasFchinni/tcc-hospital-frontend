import React, { useEffect, useState } from "react";
import axios from "axios";
import addPatientIcon from "../../assets/icons/Union.png";
import Image from 'next/image';
import { FaEdit } from "react-icons/fa";

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

interface Especialidade {
  id_especialidade: number;
  ds_especialidade: string;
}

interface ModalProps {
  onAddProvider: (providerData: Provider) => Promise<void>;
  onUpdateProvider?: (patientData: Provider) => Promise<void>;
  initialProvider: Provider | null;
}

const normalizeCpf = (cpf: string) => cpf.replace(/[^\d]/g, "");

const normalizeCep = (cep: string) => cep.replace(/[^\d]/g, "");

const Modal: React.FC<ModalProps> = ({ onAddProvider, onUpdateProvider, initialProvider }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [providerName, setProviderName] = useState("");
  const [cep, setCep] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [cpf, setCpf] = useState("");
  const [tipoPrestador, setTipoPrestador] = useState("");
  const [codConselho, setCodConselho] = useState("");
  const [especialidade, setEspecialidade] = useState<number | undefined>(undefined);
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);

  useEffect(() => {
    fetchEspecialidades(); 
  }, []);

  useEffect(() => {
    if (initialProvider) {
      setProviderName(initialProvider.nm_prestador);
      setCep(initialProvider.ds_cep);
      setBirthDate(initialProvider.dt_nascimento);
      setCpf(initialProvider.nr_cpf);
      setTipoPrestador(initialProvider.ds_tip_presta);
      setCodConselho(initialProvider.ds_codigo_conselho);
      setEspecialidade(initialProvider.id_especialidade);
      setIsEditing(true); 
      setIsModalVisible(true); 
    } else {
      setIsEditing(false); 
    }
  }, [initialProvider]);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    clearFormFields();
  };

  const clearFormFields = () => {
    setProviderName("");
    setCep("");
    setBirthDate("");
    setCpf("");
    setTipoPrestador("");
    setCodConselho("");
    setEspecialidade(undefined);
  };

  const fetchEspecialidades = async () => {
    try {
      const response = await axios.get<Especialidade[]>("http://localhost:8700/especialidade");
      setEspecialidades(response.data); 
    } catch (error) {
      console.error('Erro ao buscar especialidades:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const providerData: Provider = {
      id_prestador: initialProvider?.id_prestador || 0,
      nm_prestador: providerName,
      ds_cep: normalizeCep(cep),
      dt_nascimento: birthDate,
      nr_cpf: normalizeCpf(cpf),
      ds_tip_presta: tipoPrestador,
      ds_codigo_conselho: codConselho,
      id_especialidade: especialidade || 0,
    };

    try {
      if (initialProvider && onUpdateProvider) {
        await onUpdateProvider(providerData);
      } else {
        await onAddProvider(providerData);
      }

      clearFormFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Erro ao criar/atualizar prestador:", error);
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
        <Image src={addPatientIcon} alt="Ícone de Adicionar Prestador" className="mr-2 w-7 h-6"/>
        <button className="font-semibold text-custom-teal">
          Adicionar Prestador
        </button>
      </div>
      {isModalVisible ? (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center" onClick={handleOverlayClick}>
          <div className="bg-white rounded-lg p-6 w-[766px] h-[430px] relative">
            <h1 className="text-center text-2xl font-bold mb-4 mt-4 text-blue-500">
              Prestador
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-wrap justify-between px-6">
              <div className="flex flex-col md:w-1/2 mb-4">
                <label htmlFor="providerName">Nome do Prestador:</label>
                <input
                  type="text"
                  id="providerName"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[320px]"
                  required
                />
              </div>
              <div className="flex flex-col md:w-1/2 mb-4">
                <label htmlFor="tipoPrestador">Tipo Prestador</label>
                <select
                  id="tipo"
                  value={tipoPrestador}
                  onChange={(e) => setTipoPrestador(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[191px]"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Médico">Médico</option>
                  <option value="Operacional">Operacional</option>
                  <option value="Administrativo">Administrativo</option>
                </select>
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
                <label htmlFor="especialidade">Especialidade</label>
                <select
                  id="especialidade"
                  value={especialidade}
                  onChange={(e) => setEspecialidade(parseInt(e.target.value))}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[150px]"
                  required
                >
                  <option value="">Selecione</option>
                  {especialidades.map((especialidade) => (
                    <option key={especialidade.id_especialidade} value={especialidade.id_especialidade}>
                      {especialidade.ds_especialidade}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col md:w-1/3 mb-4">
                <label htmlFor="codConselho">Código do Conselho</label>
                <input
                  type="text"
                  id="cns"
                  value={codConselho}
                  onChange={(e) => setCodConselho(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[191px]"
                  required
                />
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
