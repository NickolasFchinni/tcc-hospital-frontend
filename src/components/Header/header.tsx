"use client";
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import questionIcon from '../../assets/icons/Vector.png';
import sairIcon from '../../assets/icons/sair.png';
import axios from "axios";
import {jwtDecode} from "jwt-decode";

interface User {
  id_usuario: number;
  id_prestador: number;
  ds_email: string;
  ds_senha: string;
  Dt_cadastro: string;
  Sn_ativo: string;
}

const Header: React.FC = () => {
  const router = useRouter();
  const [prestadorName, setPrestadorName] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          setPrestadorName(decodedToken.nome_prestador);
        } catch (error) {
          console.error("Erro ao decodificar token JWT:", error);
        }
      } else {
        console.error("Token não encontrado");
      }
    };
    
    fetchToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(); 
    router.push('/'); 
  };

  const pathname = usePathname()

  return pathname === "/" ? (
    <></>
  ) : (
    <nav className="flex w-full justify-between pr-[100px] pl-[50px] pt-10 ">
      <div className="flex items-center ">
        {prestadorName && (
          <div className="text-3xl text-teal-500 font-semibold">
            Olá, {prestadorName}
          </div>
        )}
      </div>
      <div className="flex flex-row-reverse space-x-[100px] space-x-reverse">
        <div className="flex px-3 text-lg content-center justify-center cursor-pointer text-gray-700" onClick={handleLogout}>
          <Image src={sairIcon} alt="Ícone de Sair" className="mr-2 w-7 h-7" />
          Sair
        </div>
        <div className="flex px-3 text-lg content-center justify-center text-gray-700">
          <Image src={questionIcon} alt="Ícone de Suporte" className="mr-2 w-7 h-7" />
          Suporte
        </div>
      </div>
    </nav>
  );
};

export default Header;
