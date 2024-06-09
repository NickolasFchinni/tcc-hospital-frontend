import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import addPatientIcon from "../../assets/icons/Union.png";
import Image from 'next/image';

interface Proposal {
  CO_PROCEDIMENTO: string;
  NO_PROCEDIMENTO: string;
}

interface Provider {
  id_prestador: number;
  nm_prestador: string;
}

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

interface ModalProps {
  onAddWarning: (warningData: Warning) => Promise<void>;
}

interface Material {
  id: string;
  name: string;
  quantity_available: number;
}

const Modal: React.FC<ModalProps> = ({ onAddWarning }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [patient, setPatient] = useState<string>("");
  const [rooms, setRooms] = useState<string>("");
  const [surgeons, setSurgeons] = useState<string>("");
  const [patients, setPatients] = useState<any[]>([]);
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [room, setRoom] = useState<any[]>([]);
  const [warningType, setWarningType] = useState("");
  const [surgeon, setSurgeon] = useState<Provider[]>([]);
  const [specialty, setSpecialty] = useState("");
  const [surgeryProposal, setSurgeryProposal] = useState<Proposal[]>(Array(4).fill({ CO_PROCEDIMENTO: "", NO_PROCEDIMENTO: "" }));
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [laterality, setLaterality] = useState("");
  const [cti, setCti] = useState("");
  const [equipments, setEquipments] = useState<boolean[]>(Array(8).fill(false));
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);
  const [quantity, setQuantity] = useState<number[]>(Array(4).fill(0));
  const [materialQuantities, setMaterialQuantities] = useState<{ [key: string]: number }>({});
  const [prestadorName, setPrestadorName] = useState<string | null>(null);
  const [requester, setRequester] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [anestesia, setAnestesia] = useState<string>("");
  const [hemo, setHemo] = useState<string>("");
  const [biopsia, setBiopsia] = useState<string>("");
  const [idUsuario, setIdUsuario] = useState<number>(0);

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchRoom();
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          setPrestadorName(decodedToken.nome_prestador);
          setIdUsuario(decodedToken.id_usuario);
        } catch (error) {
          console.error("Erro ao decodificar token JWT:", error);
        }
      } else {
        console.error("Token não encontrado");
      }
    };
    
    fetchToken();
  }, []);

  useEffect(() => {
    if (patient && Array.isArray(patients)) {
      const selectedPatient = patients.find(p => p.nm_paciente === patient);
      if (selectedPatient) {
        fetchProposals(selectedPatient.tp_sexo);
      }
    }
  }, [patient, patients]);

  useEffect(() => {
    if (surgeryProposal[0].CO_PROCEDIMENTO) {
      fetchCompatibleMaterials(surgeryProposal[0].CO_PROCEDIMENTO);
    }
  }, [surgeryProposal]);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("https://api-production-58ca.up.railway.app/worker/medicos");
      setSurgeon(response.data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      setSurgeon([]); // Certifique-se de definir como um array vazio em caso de erro
    }
  };

  useEffect(() => {
    const initialQuantities: { [key: string]: number } = {};
    materials.forEach(material => {
      initialQuantities[material.COD_PROCEDIMENTO_COMPATIVEL] = 0; // Inicialize com a quantidade padrão desejada
    });
    setMaterialQuantities(initialQuantities);
  }, [materials]);

  const fetchRoom = async () => {
    try {
      const response = await axios.get("https://api-production-58ca.up.railway.app/sala");
      setRoom(response.data);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      setRoom([]);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get("https://api-production-58ca.up.railway.app/patient");
      setPatients(response.data);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      setPatients([]);
    }
  };

  const fetchProposals = async (gender: string) => {
    try {
      const response = await axios.get(`https://api-production-58ca.up.railway.app/procedimento?sexo=${gender}`);
      setProposals(response.data);
    } catch (error) {
      console.error("Failed to fetch proposals:", error);
    }
  };

  const fetchCompatibleMaterials = async (procedureId: string) => {
    try {
      const response = await axios.get(`https://api-production-58ca.up.railway.app/material?procedureId=${procedureId}`);
      setMaterials(response.data);
    } catch (error) {
      console.error("Failed to fetch compatible materials:", error);
    }
  };

  const openModal = () => {
    setIsModalVisible(true);
    setRequester(prestadorName || "");
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedPatient = patients.find(p => p.nm_paciente === patient);
    const selectedProvider = surgeon.find(p => p.id_prestador.toString() === surgeons);

    const warningData: Warning = {
      id_aviso_cirurgia: 0, // replace with actual ID if available
      id_paciente: selectedPatient ? selectedPatient.id_paciente : 0, // use selectedPatient's ID
      tp_aviso: warningType,
      dt_cadastro: new Date().toISOString().slice(0, 19).replace('T', ' '),
      dt_agendamento: date,
      dt_tempo_previsto: duration,
      id_prestador: selectedProvider ? selectedProvider.id_prestador : 0, // replace with selected surgeon's ID
      tp_anestesia: anestesia,
      sn_reserva_cti: cti,
      tp_lateralidade: laterality,
      sn_biopsia: biopsia, // replace with actual value
      sn_reserva_hemocomponentes: hemo, // replace with actual value
      ds_justificativa: description,
      id_usuario: idUsuario,
      id_procedimento: surgeryProposal ? String(surgeryProposal.CO_PROCEDIMENTO) : "",
    };

    try {
        await onAddWarning(warningData);

      setIsModalVisible(false);
    } catch (error) {
      console.error("Erro ao criar/atualizar paciente:", error);
    }
  };
//    setPatients([]);
 //   setDate("");
 //   setDuration("");
  //  setWarningType("");
  //  setSurgeon([]);
 //   setRoom([]);
   // setSpecialty("");
 //   setSurgeryProposal(Array(4).fill({ CO_PROCEDIMENTO: "", NO_PROCEDIMENTO: "" }));
   // setLaterality("");
 //   setEquipments(Array(8).fill(false));
//    setSelectedMaterials([]);
  //  setQuantity(Array(4).fill(0));
    //setRequester("");
  //  closeModal();
 // };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsModalVisible(false);
    }
  };

  return (
    <div>
      <div style={{ cursor: 'pointer' }} onClick={openModal} className="flex justify-center content-center">
        <Image src={addPatientIcon} alt="Ícone de Adicionar Paciente" className="mr-2 w-7 h-6"/>
        <button className="font-semibold text-custom-teal">
          Criar aviso de cirurgia
        </button>
      </div>
      {isModalVisible ? (
        <div className="fixed inset-0 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center" onClick={handleOverlayClick}>
          <div className="bg-white rounded w-[920px] max-h-[500px] overflow-y-auto px-10 shadow-xl">
            <h1 className="text-center text-2xl font-bold mb-4 mt-4 text-blue-500">
              Aviso de Cirurgia
            </h1>
            <form
              onSubmit={handleSubmit}
              className="flex flex-wrap justify-between"
            >
              <div className="flex flex-col w-full md:w-1/4">
                <label htmlFor="patient" className="font-semibold">Paciente:</label>
                <select
                  id="patient"
                  value={patient}
                  onChange={(e) => setPatient(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[203px]"
                >
                  <option value="">Selecione o paciente</option>
                  {patients.map((p) => (
                    <option key={p.nr_cpf} value={p.nm_paciente}>
                      {p.nm_paciente}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col w-full md:w-1/4 ">
                <label htmlFor="date" className="font-semibold ml-9">Data:</label>
                <input
                  type="date"
                  id="birthDate"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[150px] ml-9"
                  required
                />
              </div>
              <div className="flex flex-col w-full md:w-1/4">
                <label htmlFor="duration" className="font-semibold ml-5">Duração:</label>
                <input
                  type="time"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[150px] ml-5"
                />
              </div>
              <div className="flex flex-col w-full md:w-1/4">
                <label htmlFor="cti" className="font-semibold">Precisa de reserva de CTI:</label>
                <select
                  id="cti"
                  value={cti}
                  onChange={(e) => setCti(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[203px]"
                >
                  <option value="">Selecione uma opção</option>
                  <option value="S">Sim</option>
                  <option value="N">Não</option>
                </select>
              </div>
              <div className="flex flex-col w-full md:w-1/3 mt-3">
                <label htmlFor="surgeryProposal1" className="font-semibold">Proposta Cirúrgica:</label>
                <select
                  id="surgeryProposal1"
                  value={surgeryProposal[0].CO_PROCEDIMENTO}
                  onChange={(e) => {
                    const updatedProposals = [...surgeryProposal];
                    updatedProposals[0] = proposals.find(p => p.CO_PROCEDIMENTO === e.target.value) || { CO_PROCEDIMENTO: "", NO_PROCEDIMENTO: "" };
                    setSurgeryProposal(updatedProposals);
                  }}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[223px]"
                >
                  <option value="">Selecione uma proposta</option>
                  {proposals.map((p) => (
                    <option key={p.CO_PROCEDIMENTO} value={p.CO_PROCEDIMENTO}>
                      {p.NO_PROCEDIMENTO}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col w-full md:w-1/3 mt-3">
                <label htmlFor="laterality" className="font-semibold">Lateralidade:</label>
                <select
                  id="laterality"
                  value={laterality}
                  onChange={(e) => setLaterality(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[223px]"
                >
                  <option value="">Selecione a lateralidade</option>
                  <option value="Esquerdo">Esquerdo</option>
                  <option value="Direito">Direito</option>
                </select>
              </div>
              <div className="flex flex-col w-full md:w-1/3 mt-3">
                <label htmlFor="surgeon" className="font-semibold">Médico responsável:</label>
                <select
                  id="surgeon"
                  value={surgeons}
                  onChange={(e) => setSurgeons(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[223px]"
                >
                  <option value="">Selecione o médico responsável</option>
                  {surgeon.map((s) => (
                    <option key={s.id_prestador} value={s.id_prestador}>
                      {s.nm_prestador}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col w-full md:w-3/3 mt-3 outline outline-teal-700 outline-1 rounded p-2">
                <fieldset>
                  <legend className="mb-2 text-lg font-semibold text-teal-500">Materiais Compatíveis:</legend>
                  {materials.map((material) => (
                  <div key={material.COD_PROCEDIMENTO_COMPATIVEL} className="mb-2 items-center justify-between">
                    <label htmlFor={`material-${material.COD_PROCEDIMENTO_COMPATIVEL}`} className="mr-2">
                      {material.NO_PROCEDIMENTO_COMPATIVEL} (Disponível: {material.QT_PERMITIDA})
                    </label>
                    <div className="flex items-center mb-5">
                      <legend className="font-semibold">Quantidade:</legend>
                      <input
                        type="number"
                        id={`material-${material.id}`}
                        value={materialQuantities[material.COD_PROCEDIMENTO_COMPATIVEL] || 0}
                        onChange={(e) => {
                          const quantity = Number(e.target.value);
                          setMaterialQuantities(prevQuantities => ({
                            ...prevQuantities,
                            [material.COD_PROCEDIMENTO_COMPATIVEL]: quantity,
                          }));
                        }}
                        min={0}
                        max={material.QT_PERMITIDA}
                        className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[60px] ml-3 "
                      />
                    </div>
                  </div>
                ))}
                </fieldset>
              </div>
              <div className="flex flex-col w-full mt-3">
                <label htmlFor="description" className="font-semibold">Justificativa:</label>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 h-[60px]"
                />
              </div>
              <div className="flex flex-col w-full mt-3">
                <label htmlFor="anestesia" className="font-semibold">Anestesia:</label>
                <input
                  type="text"
                  id="anestesia"
                  value={anestesia}
                  onChange={(e) => setAnestesia(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2"
                />
              </div>
              <div className="flex flex-col w-full md:w-1/2 mt-2">
                <label htmlFor="hemo" className="font-semibold">Hemocomponentes:</label>
                <select
                  id="hemo"
                  value={hemo}
                  onChange={(e) => setHemo(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[203px]"
                >
                  <option value="">Selecione uma opção</option>
                  <option value="S">Sim</option>
                  <option value="N">Não</option>
                </select>
              </div>
              <div className="flex flex-col w-full md:w-1/2 mt-2">
                <label htmlFor="biopsia" className="font-semibold">Biópsia:</label>
                <select
                  id="biopsia"
                  value={biopsia}
                  onChange={(e) => setBiopsia(e.target.value)}
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[203px]"
                >
                  <option value="">Selecione uma opção</option>
                  <option value="S">Sim</option>
                  <option value="N">Não</option>
                </select>
              </div>
              <div className="flex flex-col w-full md:w-1/2 mt-3">
              
                <label className="font-semibold">Tipo de aviso:</label>
                <div className="flex mt-2">
                  <label className="inline-flex items-center mr-4">
                    <input
                      type="radio"
                      id="urgente"
                      name="tipo"
                      value="urgente"
                      checked={warningType === 'urgente'}
                      onChange={(e) => setWarningType(e.target.value)}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2">Urgente</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      id="agendado"
                      name="tipo"
                      value="agendado"
                      checked={warningType === 'agendado'}
                      onChange={(e) => setWarningType(e.target.value)}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2">Agendado</span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col w-full md:w-1/2 mt-3 mb-4 items-end">
                <label htmlFor="requester" className="font-semibold">Solicitante:</label>
                <input
                  type="text"
                  id="requester"
                  value={requester}
                  readOnly
                  className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[223px]"
                />
              </div>
              <button
                onClick={closeModal}
                className="bg-red-500 text-white py-2 px-4 my-4 rounded self-end"
              >
                Cancelar
              </button>
              <button type="submit" className="w-[180px] bg-gradient-to-b from-cyan-600 to-blue-800 text-white py-2 px-4 my-4 rounded self-end">
                Salvar
              </button>
              
            </form>
          </div>
          
        </div>
      ) : null}
    </div>
  );
};

export default Modal;
