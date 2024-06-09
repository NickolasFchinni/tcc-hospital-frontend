import React, { useEffect, useState } from "react";
import axios from "axios";
import addPatientIcon from "../../assets/icons/Union.png";
import Image from 'next/image';

interface Provider {
  id_prestador: number;
  nm_prestador: string;
}

interface User {
  id_usuario: number;
  id_prestador: number;
  ds_mail: string;
  ds_senha: string;
  Dt_cadastro: string;
  Sn_ativo: string;
}

interface ModalProps {
  onAddUser: (userData: User) => Promise<void>;
  onUpdateUser?: (userData: User) => Promise<void>;
  initialUser?: User | undefined;
}

const Modal: React.FC<ModalProps> = ({ onAddUser, onUpdateUser, initialUser }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<number | undefined>(undefined);
  const [isActive, setIsActive] = useState<string>("S");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (initialUser) {
      setSelectedProvider(initialUser.id_prestador);
      setIsActive(initialUser.Sn_ativo);
      setEmail(initialUser.ds_mail);
      setIsEditing(true); 
      setIsModalVisible(true); 
    } else {
      setIsEditing(false); 
    }
  }, [initialUser]);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await axios.get<Provider[]>("https://api-production-58ca.up.railway.app/worker");
      setProviders(response.data);
    } catch (error) {
      console.error('Erro ao buscar prestadores:', error);
    }
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    clearFormFields();
  };

  const clearFormFields = () => {
    setSelectedProvider(undefined);
    setIsActive("S");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const formatDateToMySQL = (date: Date): string => {
    const pad = (num: number): string => (num < 10 ? `0${num}` : `${num}`);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    
    const currentDateTime = new Date();
    const userData: User = {
      id_usuario: initialUser?.id_usuario || 0, 
      id_prestador: selectedProvider || 0,
      ds_mail: email,
      ds_senha: password,
      Dt_cadastro: formatDateToMySQL(currentDateTime),
      Sn_ativo: isActive,
    };

    try {
      if (initialUser && onUpdateUser) {
        await onUpdateUser(userData);
      } else {
        await onAddUser(userData);
      }

      clearFormFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Erro ao criar/atualizar usuário:", error);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsModalVisible(false);
      clearFormFields();
    }
  };

  return (
    <div>
      <div style={{ cursor: 'pointer' }} onClick={openModal} className="flex justify-center content-center">
        <Image src={addPatientIcon} alt="Ícone de Adicionar Paciente" className="mr-2 w-7 h-6"/>
        <button className="font-semibold text-custom-teal">
          Adicionar Usuário
        </button>
      </div>
      {isModalVisible ? (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center" onClick={handleOverlayClick}>
          <div className="bg-white rounded-lg p-6 w-[766px] h-[430px] relative">
            <h1 className="text-center text-2xl font-bold mb-4 mt-4 text-blue-500">
              Criar Perfil de Usuário
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-wrap justify-between px-6">
              <div className="flex flex-col md:w-1/2 mb-4">
                <label htmlFor="provider">Prestador:</label>
                <select
                  id="provider"
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(parseInt(e.target.value))}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[320px]"
                  required
                >
                  <option value="">Selecione</option>
                  {providers.map((provider) => (
                    <option key={provider.id_prestador} value={provider.id_prestador}>
                      {provider.nm_prestador}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col md:w-1/2 mb-4">
                <label htmlFor="isActive">Ativo:</label>
                <select
                  id="isActive"
                  value={isActive}
                  onChange={(e) => setIsActive(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[191px]"
                  required
                >
                  <option value="S">Sim</option>
                  <option value="N">Não</option>
                </select>
              </div>
              <div className="flex flex-col md:w-1/2 mb-4">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[320px]"
                  required
                />
              </div>
              <div className="flex flex-col md:w-1/2 mb-4">
                <label htmlFor="password">Senha:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[320px]"
                  required
                />
              </div>
              <div className="flex flex-col md:w-1/2 mb-4">
                <label htmlFor="confirmPassword">Confirmar Senha:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[320px]"
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
      ) : null}
    </div>
  );
};

export default Modal;
