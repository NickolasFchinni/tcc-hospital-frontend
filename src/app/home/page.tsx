"use client"
import styled from "styled-components";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Page = () => {

  const [isRefreshed, setIsRefreshed] = useState(false);

  useEffect(() => {
    const hasRefreshed = localStorage.getItem('hasRefreshed');

    if (hasRefreshed === null) {
      localStorage.setItem('hasRefreshed', 'true');
      setIsRefreshed(true); 
      window.location.reload(); 
    } else if (hasRefreshed === 'false') {
      localStorage.setItem('hasRefreshed', 'true');
      setIsRefreshed(true); 
      window.location.reload(); 
    } else {
      setIsRefreshed(false); 
    }
  }, []);

  return (
    <main className=" 2xl:h-[91.5vh] w-full flex items-center justify-center">
      <Container>
      <div className="flex items-center">
        <h1 className="text-gray-300 text-4xl font-bold md:mt-[200px] 2xl:mt-0">Sistema de controle de Hospitais | Página inicial</h1>
      </div> 
      </Container>
    </main>
  );
};

export default ProtectedRoute(Page);
