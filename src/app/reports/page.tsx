"use client"
import ProtectedRoute from "@/components/ProtectedRoute";
import Image from 'next/image';
import justify from '../../assets/icons/homem-de-negocios.png';
import pork from '../../assets/icons/recibo.png';
import clipBoard from '../../assets/icons/relatorio.png';
import date from '../../assets/icons/calendario.png';
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface ReportData {
  id_paciente: number;
  nm_paciente: string;
  DT_NASCIMENTO: string;
  nr_cpf: string;
  TP_SEXO: string;
  DT_AGENDAMENTO: string;
  NO_PROCEDIMENTO: string;
  tp_lateralidade: string;
  MEDICO: string;
  nm_sala_cirurgica: string;
}

interface ReportData {
  id_paciente: number;
  nm_paciente: string;
  DT_NASCIMENTO: string;
  nr_cpf: string;
  TP_SEXO: string;
  DT_AGENDAMENTO: string;
  NO_PROCEDIMENTO: string;
  tp_lateralidade: string;
  MEDICO: string;
  nm_sala_cirurgica: string;
}

interface ReportDataJustify {
  id_aviso_cirurgia: number;
  nm_paciente: string;
  DT_NASCIMENTO: string;
  DT_AGENDADO: string;
  NO_PROCEDIMENTO: string;
  nm_prestador: string;
  ds_justificativa: string
}

interface ReportDataMoney {
  AVISO_CIRURGIA: number;
  PACIENTE: string;
  DT_AGENDADO: string;
  COD_PROCEDIMENTO: string;
  NOME_PROCEDIMENTO: string;
  MEDICO: string;
  VALOR_CIRURGIA: string
}


function Page() {
  const [birthDateFilterDataFirst, setBirthDateFilterFirst] = useState("");
  const [birthDateFilterDataSecond, setBirthDateFilterSecond] = useState("");
  const [birthDateJustifyDataFirst, setBirthDateJustifyFirst] = useState("");
  const [birthDateJustifyDataSecond, setBirthDateJustifySecond] = useState("");
  const [birthDateMoneyDataFirst, setBirthDateMoneyFirst] = useState("");
  const [birthDateMoneyDataSecond, setBirthDateMoneySecond] = useState("");
  const [data, setData] = useState<ReportData[]>([]);
  const [dataDate, setDataDate] = useState<ReportData[]>([]);
  const [dataJustify, setDataJustify] = useState<ReportDataJustify[]>([]);
  const [dataMoney, setDataMoney] = useState<ReportDataMoney[]>([]);

  useEffect(() => {
    fetchData();
    fetchData2(birthDateFilterDataFirst, birthDateFilterDataSecond);
    fetchData3(birthDateJustifyDataFirst, birthDateJustifyDataSecond);
    fetchData4(birthDateMoneyDataFirst, birthDateMoneyDataSecond);
  }, [birthDateFilterDataFirst, birthDateFilterDataSecond, birthDateJustifyDataFirst, birthDateJustifyDataSecond, birthDateMoneyDataFirst, birthDateMoneyDataSecond]);

  const fetchData = async () => {
    try {
      const response = await axios.get<ReportData[]>("https://api-production-58ca.up.railway.app/report/first");
      setData(response.data);
      console.log('Dados recebidos:', response.data); 
    } catch (error) {
      console.error('Error fetching Reports:', error);
    }
  };

  const fetchData2 = async (startDate: string, endDate: string) => {
    try {
      const response = await axios.get<ReportData[]>(`https://api-production-58ca.up.railway.app/report/second?startDate=${startDate}&endDate=${endDate}`);
      setDataDate(response.data);
      console.log('Dados recebidos:', response.data); 
    } catch (error) {
      console.error('Error fetching Reports:', error);
    }
  };

  const fetchData3 = async (startDate: string, endDate: string) => {
    try {
      const response = await axios.get<ReportDataJustify[]>(`https://api-production-58ca.up.railway.app/report/third?startDate=${startDate}&endDate=${endDate}`);
      setDataJustify(response.data);
      console.log('Dados recebidos:', response.data); 
    } catch (error) {
      console.error('Error fetching Reports:', error);
    }
  };

  const fetchData4 = async (startDate: string, endDate: string) => {
    try {
      const response = await axios.get<ReportDataMoney[]>(`https://api-production-58ca.up.railway.app/report/fourth?startDate=${startDate}&endDate=${endDate}`);
      setDataMoney(response.data);
      console.log('Dados recebidos:', response.data); 
    } catch (error) {
      console.error('Error fetching Reports:', error);
    }
  };

  const formatCPF = (cpf: string | undefined): string => {
    if (!cpf) {
      return ""; 
    }
    const cleanCpf = cpf.replace(/\D/g, '');
    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };
  const generatePDF = (title: string) => {
    console.log('Gerando PDF...');
    const doc = new jsPDF('landscape');
  
    doc.setFont("helvetica", "bold"); 
    doc.setFontSize(16); 
    doc.text(title, doc.internal.pageSize.width / 2, 15, { align: "center" });

    const headers = [
      ["Nome Paciente", "Data Nascimento", "CPF", "Sexo",
       "Data Agendamento", "Procedimento", "Lateralidade", "Médico", "Sala Cirúrgica"]
    ];

    const rows = data.map((item) => [
      item.nm_paciente,
      item.DT_NASCIMENTO, 
      formatCPF(item.nr_cpf),
      item.TP_SEXO, 
      item.DT_AGENDAMENTO,
      item.NO_PROCEDIMENTO,
      item.tp_lateralidade,
      item.MEDICO,
      item.nm_sala_cirurgica,
    ]);
  
    console.log('Linhas do PDF:', rows);

    (doc as any).autoTable({
      head: headers,
      body: rows,
      startY: 30, 
      theme: 'striped', 
      headStyles: { fillColor: [22, 160, 133] }, 
      styles: { overflow: 'linebreak', cellWidth: 'wrap' }, 
      columnStyles: {
        0: { cellWidth: 30 },  
        1: { cellWidth: 25 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 60 },
        6: { cellWidth: 24 },
        7: { cellWidth: 30 },
        8: { cellWidth: 25 }
      }
    });

    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  };

  const generatePDFDate = (title: string) => {
    console.log('Gerando PDF...');
    const doc = new jsPDF('landscape');
  
    doc.setFont("helvetica", "bold"); 
    doc.setFontSize(16); 
    doc.text(title, doc.internal.pageSize.width / 2, 15, { align: "center" });

    const headers = [
      ["Nome Paciente", "Data Nascimento", "CPF", "Sexo",
       "Data Agendamento", "Procedimento", "Lateralidade", "Médico", "Sala Cirúrgica"]
    ];

    const rows = dataDate.map((item) => [
      item.nm_paciente,
      item.DT_NASCIMENTO, 
      formatCPF(item.nr_cpf),
      item.TP_SEXO, 
      item.DT_AGENDAMENTO,
      item.NO_PROCEDIMENTO,
      item.tp_lateralidade,
      item.MEDICO,
      item.nm_sala_cirurgica,
    ]);
  
    console.log('Linhas do PDF:', rows);

    (doc as any).autoTable({
      head: headers,
      body: rows,
      startY: 30, 
      theme: 'striped', 
      headStyles: { fillColor: [22, 160, 133] }, 
      styles: { overflow: 'linebreak', cellWidth: 'wrap' }, 
      columnStyles: {
        0: { cellWidth: 30 },  
        1: { cellWidth: 25 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 60 },
        6: { cellWidth: 24 },
        7: { cellWidth: 30 },
        8: { cellWidth: 25 }
      }
    });

    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  };

  const generatePDFMoney = (title: string) => {
    console.log('Gerando PDF...');
    const doc = new jsPDF('landscape');
  
    doc.setFont("helvetica", "bold"); 
    doc.setFontSize(16); 
    doc.text(title, doc.internal.pageSize.width / 2, 15, { align: "center" });

    const headers = [
      ["Nome Paciente", "Dt. Agendamento", "Médico", "Procedimento", "Valor da Cirurgia"]
    ];

    const rows = dataMoney.map((item) => [
      item.PACIENTE,
      item.DT_AGENDADO,
      item.MEDICO,
      item.NOME_PROCEDIMENTO,
      item.VALOR_CIRURGIA,
    ]);
  
    console.log('Linhas do PDF:', rows);

    (doc as any).autoTable({
      head: headers,
      body: rows,
      startY: 30, 
      theme: 'striped', 
      headStyles: { fillColor: [22, 160, 133] }, 
      styles: { overflow: 'linebreak', cellWidth: 'wrap' }, 
      columnStyles: {
        0: { cellWidth: 45 },  
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 120 },
        4: { cellWidth: 35 },
      }
    });

    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  };

  const generatePDFJustify = (title: string) => {
    console.log('Gerando PDF...');
    const doc = new jsPDF('landscape');
  
    doc.setFont("helvetica", "bold"); 
    doc.setFontSize(16); 
    doc.text(title, doc.internal.pageSize.width / 2, 15, { align: "center" });

    const headers = [
      ["Nome Paciente", "Data Agendamento", "Procedimento", "Médico", "Justificativa"]
    ];

    const filteredDataJustify = dataJustify.filter(item => item.ds_justificativa);

    const rows = filteredDataJustify.map((item) => [
      item.nm_paciente,
      item.DT_AGENDADO,
      item.NO_PROCEDIMENTO,
      item.nm_prestador,
      item.ds_justificativa,
    ]);
  
    console.log('Linhas do PDF:', rows);

    (doc as any).autoTable({
      head: headers,
      body: rows,
      startY: 30, 
      theme: 'striped', 
      headStyles: { fillColor: [22, 160, 133] }, 
      styles: { overflow: 'linebreak', cellWidth: 'wrap' }, 
      columnStyles: {
        0: { cellWidth: 35 },  
        1: { cellWidth: 25 },
        2: { cellWidth: 80 },
        3: { cellWidth: 35 },
        4: { cellWidth: 40 },
      }
    });

    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  };

  return (
    <main className="2xl:h-[90vh] w-full flex items-center justify-center relative">
      <div className="w-fit">
        <div className="flex justify-center py-2">
          <div className="text-center">
            <div className="bg-gray-200 rounded-md p-4 mb-4 mx-10 shadow-md jus"
              style={{
                height: "40vh",
                width: "55vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
              }}>
              <h3 className="text-2xl font-extrabold my-4">Todos os avisos</h3>
              <Image
                src={clipBoard}
                alt="Admin Image"
                className="mb-4 mt-2"
                style={{ width: "20%" }}
              />
              <button onClick={() => generatePDF("Relatório de todos os avisos")} className="bg-gray-300 text-gray-900 font-bold px-4 py-2 rounded-md w-[35dvh] h-[5dvh] my-2">
                Gerar
              </button>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gray-200 rounded-md p-4 mb-4 mx-10 shadow-md"
              style={{
                height: "40vh",
                width: "55vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff",
              }}>
              <h3 className="text-2xl font-extrabold my-4">Avisos com justificativa</h3>
              <Image
                src={justify}
                alt="Operation Image"
                className="mb-4 mt-2"
                style={{ width: "20%" }}
              />
              <p className="">
                <strong>Escolha um período </strong> 
              </p>
              <p className="mb-2">
                Dt. Ínicio - Dt. Final   
              </p>
              <div className="flex flex-wrap justify-between gap-4">
                <div className="flex flex-col md:1/2 mb-4">
                  <input
                    type="date"
                    id="birthDate"
                    value={birthDateJustifyDataFirst}
                    onChange={(e) => setBirthDateJustifyFirst(e.target.value)}
                    className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[150px]"
                    required
                  />
                </div>
                <div className="flex flex-col md:1/2 mb-4">
                  <input
                    type="date"
                    id="birthDate"
                    value={birthDateJustifyDataSecond}
                    onChange={(e) => setBirthDateJustifySecond(e.target.value)}
                    className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[150px]"
                    required
                  />
                </div>
              </div>
              <button onClick={() => {fetchData3(birthDateJustifyDataFirst, birthDateJustifyDataSecond); generatePDFJustify("Relatório de avisos filtrados por Data")}} className="bg-gray-300 text-gray-900 font-bold px-4 py-2 rounded-md w-[35dvh] h-[5dvh] my-2">
                Gerar
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center py-2">
          <div className="text-center">
            <div className="bg-gray-200 rounded-md p-4 mb-4 mx-10 shadow-md"
              style={{
                height: "40vh",
                width: "55vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff",
              }}>
              <h3 className="text-2xl font-extrabold my-4">Avisos filtrados por data</h3>
              <Image
                src={date}
                alt="Operation Image"
                className="mb-4 mt-2"
                style={{ width: "20%" }}
              />
              <p className="">
                <strong>Escolha um período </strong> 
              </p>
              <p className="mb-2">
                Dt. Ínicio - Dt. Final   
              </p>
              <div className="flex flex-wrap justify-between gap-4">
                <div className="flex flex-col md:1/2 mb-4">
                  <input
                    type="date"
                    id="birthDate"
                    value={birthDateFilterDataFirst}
                    onChange={(e) => {
                      console.log('Data de início:', e.target.value);
                      setBirthDateFilterFirst(e.target.value);
                    }}
                    className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[150px]"
                    required
                  />
                </div>
                <div className="flex flex-col md:1/2 mb-4">
                  <input
                    type="date"
                    id="birthDate"
                    value={birthDateFilterDataSecond}
                    onChange={(e) => {
                      console.log('Data de fim:', e.target.value);
                      setBirthDateFilterSecond(e.target.value);
                    }}
                    className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[150px]"
                    required
                  />
                </div>
              </div>
              <button onClick={() => {fetchData2(birthDateFilterDataFirst, birthDateFilterDataSecond); generatePDFDate("Relatório de avisos filtrados por Data")}} className="bg-gray-300 text-gray-900 font-bold px-4 py-2 rounded-md w-[35dvh] h-[5dvh] my-2">
                Gerar
              </button>
            </div>
          </div>

          <div className="text-center">
            
            <div className="bg-gray-200 rounded-md p-8 mb-4 mx-10 shadow-md"
              style={{
                height: "40vh",
                width: "55vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff",
              }}>
              <h3 className="text-2xl font-extrabold my-4">Valores de cirurgia</h3>
              <Image
                src={pork}
                alt="Operation Image"
                className="mb-4 mt-2"
                style={{ width: "20%" }}
              />
              <p className="pt-2">
                <strong>Escolha um período </strong> 
              </p>
              <p className="mb-2">
                Dt. Ínicio - Dt. Final   
              </p>
              <div className="flex flex-wrap justify-between gap-4">
                <div className="flex flex-col md:1/2 mb-4">
                  <input
                    type="date"
                    id="birthDate"
                    value={birthDateMoneyDataFirst}
                    onChange={(e) => setBirthDateMoneyFirst(e.target.value)}
                    className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[150px]"
                    required
                  />
                </div>
                <div className="flex flex-col md:1/2 mb-4">
                  <input
                    type="date"
                    id="birthDate"
                    value={birthDateMoneyDataSecond}
                    onChange={(e) => setBirthDateMoneySecond(e.target.value)}
                    className="outline outline-offset-2 outline-1 rounded px-2 py-1 mt-2 w-[150px]"
                    required
                  />
                </div>
              </div>
              <button onClick={() => {fetchData4(birthDateMoneyDataFirst, birthDateMoneyDataSecond); generatePDFMoney("Relatório de valor de cirurgia")}} className="bg-gray-300 text-gray-900 font-bold px-4 py-2 rounded-md w-[35dvh] h-[5dvh] my-2">
                Gerar
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProtectedRoute(Page);
