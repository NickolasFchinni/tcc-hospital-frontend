import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Image from 'next/image';
import addPatientIcon from "../../assets/icons/Union.png";

interface CentroCirurgico {
  id_cen_cirurgico: number;
  nm_cen_cirurgico: string;
}

interface ModalProps {
  onAddRoom: (roomData: any) => Promise<void>;
}

const Modal: React.FC<ModalProps> = ({ onAddRoom }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [namerom, setNameRom] = useState("");
  const [numberrom, setNumberRom] = useState("");
  const [surgerycenter, setSurgeryCenter] = useState("");
  const [newcenter, setNewCenter] = useState("");
  const [centros, setCentros] = useState<CentroCirurgico[]>([]);
  const [deleteCenter, setDeleteCenter] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCentros();
  }, []);

  const fetchCentros = async () => {
    try {
      const response = await axios.get<CentroCirurgico[]>("https://api-production-58ca.up.railway.app/centro");
      setCentros(response.data);
    } catch (error) {
      console.error("Error fetching centros:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const nomeSalaCirurgica = `Sala ${numberrom}`;

      const centroSelecionado = centros.find((centro) => centro.nm_cen_cirurgico === surgerycenter);
      if (!centroSelecionado) {
        throw new Error("Centro cirúrgico não encontrado.");
      }

      const data = {
        nm_sala_cirurgica: nomeSalaCirurgica,
        id_cen_cirurgico: centroSelecionado.id_cen_cirurgico,
      };

      await onAddRoom(data); 
      setNameRom("");
      setNumberRom("");
      setSurgeryCenter("");
      setNewCenter("");
      setIsModalVisible(false); 
    } catch (error) {
      console.error("Erro ao criar sala e centro cirúrgico:", error);
    }
  };

  const handleAddNewCenter = async () => {
    if (!newcenter.trim()) {
      console.error("Nome do centro cirúrgico não pode estar vazio.");
      return;
    }

    try {
      const response = await axios.post("https://api-production-58ca.up.railway.app/centro", { nm_cen_cirurgico: newcenter });
      console.log("Centro cirúrgico criado com sucesso:", response.data);
      fetchCentros(); 
      setNewCenter(""); 
    } catch (error) {
      console.error("Erro ao criar centro cirúrgico:", error);
    }
  };

  const handleDeleteCenter = async () => {
    try {
      if (!deleteCenter) {
        throw new Error("Nenhum centro cirúrgico selecionado para deletar.");
      }

      const response = await axios.delete(`https://api-production-58ca.up.railway.app/centro/${deleteCenter}`);
      console.log("Centro cirúrgico deletado com sucesso:", response.data);
      fetchCentros();
      setDeleteCenter(""); 
    } catch (error) {
      console.error("Erro ao deletar centro cirúrgico:", error);
    }
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setNameRom("");
    setNumberRom("");
    setSurgeryCenter("");
    setNewCenter("");
    setDeleteCenter("");
    setIsModalVisible(false);
  };


  return (
    <div>
      <div style={{ cursor: 'pointer' }} onClick={openModal} className="flex justify-center content-center">
        <Image src={addPatientIcon} alt="Ícone de Adicionar Paciente" className="mr-2 w-7 h-6"/>
        <button className="font-semibold text-custom-teal">
          Adicionar nova sala ou centro cirúrgico
        </button>
      </div>
      {isModalVisible ? (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div ref={modalRef} className="bg-white rounded-lg p-6 w-[650px] h-[450px] relative">
            <h1 className="text-center text-2xl font-bold mb-4 mt-4 text-blue-500">
              Sala de cirurgia
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-wrap justify-between ml-1">
              <div className="flex flex-col md:w-1/2">
                <label htmlFor="namerom">Nome da sala</label>
                <input
                  placeholder="Nome da sala..."
                  type="text"
                  id="namerom"
                  value={namerom}
                  onChange={(e) => setNameRom(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[400px]"
                />
              </div>
              <div className="flex flex-col w-full md:w-1/2 ps-[125px]">
                <label htmlFor="numberrom">Número</label>
                <input
                  placeholder="Número..."
                  type="text"
                  id="numberrom"
                  value={numberrom}
                  onChange={(e) => setNumberRom(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[100px]"
                />
              </div>
              <div className="flex flex-col w-full md:w-1/1 mt-2">
                <label htmlFor="surgerycenter">Centro Cirúrgico</label>
                <select
                  id="surgerycenter"
                  value={surgerycenter}
                  onChange={(e) => setSurgeryCenter(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[500px]"
                >
                  <option value="">Selecione o centro cirúrgico...</option>
                  {centros.map((centro) => (
                    <option key={centro.id_cen_cirurgico} value={centro.nm_cen_cirurgico}>
                      {centro.nm_cen_cirurgico}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col w-full md:w-1/1 mt-2">
                <label htmlFor="newcenter">Criar novo centro</label>
                <div className="flex">
                  <input
                    placeholder="Insira o nome do novo centro cirúrgico..."
                    type="text"
                    id="newcenter"
                    value={newcenter}
                    onChange={(e) => setNewCenter(e.target.value)}
                    className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[450px]"
                  />
                  <button
                    className="ml-3 mt-[0.50rem] bg-blue-500 text-white py-1 rounded w-[30px] h-[30px]"
                    type="button"
                    onClick={handleAddNewCenter}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex flex-col w-full md:w-1/1 mt-2">
                <label htmlFor="deletecenter">Deletar centro</label>
                <div className="flex">
                  <select
                    id="deletecenter"
                    value={deleteCenter}
                    onChange={(e) => setDeleteCenter(e.target.value)}
                    className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[450px]"
                  >
                    <option value="">Selecione o centro cirúrgico para deletar...</option>
                    {centros.map((centro) => (
                      <option key={centro.id_cen_cirurgico} value={centro.id_cen_cirurgico}>
                        {centro.nm_cen_cirurgico}
                      </option>
                    ))}
                  </select>
                  <button
                    className="ml-3 mt-[0.40rem] bg-red-500 text-white py-1 rounded w-[30px] h-[30px]"
                    type="button"
                    onClick={handleDeleteCenter}
                  >
                    -
                  </button>
                </div>
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

