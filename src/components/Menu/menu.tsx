"use client"
import avisosIcon from "../../assets/icons/avisosIcon.svg";
import heartblue from "../../assets/icons/heartblue.svg";
import pacientesIcon from "../../assets/icons/people.svg";
import peopleblue from "../../assets/icons/peopleblue.svg";
import prestadoresIcon from "../../assets/icons/provider.svg";
import providersblue from "../../assets/icons/providerblue.svg";
import home from "../../assets/icons/home.png";
import homeBlue from "../../assets/icons/homeblue.png";
import room from "../../assets/icons/room.svg";
import roomblue from "../../assets/icons/roomblue.svg";
import relatoriosIcon from "../../assets/icons/report.svg";
import reportblue from "../../assets/icons/reportblue.svg";
import usersIcon from "../../assets/icons/Vecto.png";
import usersblue from "../../assets/icons/VectoBlue.png";
import updateIcon from "../../assets/icons/upload.png";
import updateBlue from "../../assets/icons/uploadBlue.png";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {jwtDecode} from "jwt-decode";

const Menu: React.FC = () => {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          setUserRole(decodedToken.role);
        } catch (error) {
          console.error("Erro ao decodificar token JWT:", error);
        }
      } else {
        console.error("Token não encontrado");
      }
    };
    
    fetchToken();
  }, []);

  const menuItems = [
    { role: "ADMINISTRATIVO", href: "home", icon: home, activeIcon: homeBlue, label: "Home" },
    { role: "MEDICO", href: "home", icon: home, activeIcon: homeBlue, label: "Home" },
    { role: "OPERACIONAL", href: "home", icon: home, activeIcon: homeBlue, label: "Home" },
    { role: "OPERACIONAL", href: "warning", icon: avisosIcon, activeIcon: heartblue, label: "Avisos" },
    { role: "TI", href: "home", icon: home, activeIcon: homeBlue, label: "Home" },
    { role: "TI", href: "warning", icon: avisosIcon, activeIcon: heartblue, label: "Avisos" },
    { role: "MEDICO", href: "warning", icon: avisosIcon, activeIcon: heartblue, label: "Avisos" },
    { role: "MEDICO", href: "patient", icon: pacientesIcon, activeIcon: peopleblue, label: "Pacientes" },
    { role: "OPERACIONAL", href: "patient", icon: pacientesIcon, activeIcon: peopleblue, label: "Pacientes" },
    { role: "OPERACIONAL", href: "providers", icon: prestadoresIcon, activeIcon: providersblue, label: "Prestadores" },
    { role: "OPERACIONAL", href: "roms", icon: room, activeIcon: roomblue, label: "Salas de cirurgia e Centros cirúrgicos" },
    { role: "TI", href: "patient", icon: pacientesIcon, activeIcon: peopleblue, label: "Pacientes" },
    { role: "TI", href: "providers", icon: prestadoresIcon, activeIcon: providersblue, label: "Prestadores" },
    { role: "TI", href: "roms", icon: room, activeIcon: roomblue, label: "Salas de cirurgia e Centros cirúrgicos" },
    { role: "ADMINISTRATIVO", href: "reports", icon: relatoriosIcon, activeIcon: reportblue, label: "Relatórios" },
    { role: "TI", href: "reports", icon: relatoriosIcon, activeIcon: reportblue, label: "Relatórios" },
    { role: "TI", href: "users", icon: usersIcon, activeIcon: usersblue, label: "Usuários" },
    { role: "TI", href: "update", icon: updateIcon, activeIcon: updateBlue, label: "Atualizar tabela" }
  ];

  return pathname === "/" ? (
    <> </>
  ) : (
    <main className="bg-gradient-to-b from-cyan-500 to-blue-700 h-[100vh] flex flex-col p-8 text-white">
      <div style={{ fontSize: "3rem" }} className="text-white mt-10 font-bold 2xl:mb-[150px] md:mb-[80px]">
        Hospital
      </div>
      {menuItems.filter((item) => item.role === userRole).map((item, index) => (
        <Link href={item.href} key={index}>
          <div className="flex items-center mt-4 text-lg">
            <Image
              src={pathname.includes(item.href) ? item.activeIcon.src : item.icon.src}
              width={50}
              height={50}
              alt={item.label}
              className="mr-4 w-6 h-6"
            />
            <span className={pathname.includes(item.href) ? "text-sky-500" : ""}>
              {item.label}
            </span>
          </div>
        </Link>
      ))}
    </main>
  );
};

export default Menu;
