"use client"
import styled from "styled-components";
import ProtectedRoute from "@/components/ProtectedRoute";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Page = () => {

  return (
    <main className="h-full w-full flex items-center justify-center">
      <Container>
      <div className="flex items-center">
        <h1 className="text-gray-300 text-4xl font-bold">Sistema de controle de Hospitais | Página inicial</h1>
      </div> 
      </Container>
    </main>
  );
};

export default ProtectedRoute(Page);
