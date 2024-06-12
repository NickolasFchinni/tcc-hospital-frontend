"use client"
import React from 'react';
import './styles.css'; 
import addPasta from "../../assets/icons/pasta.png";
import Image from 'next/image';

const UploadFileComponent = () => {

  const handleUpload = () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      alert('Upload efetuado com sucesso');
    } else {
      alert('Upload falhou');
    }
  };

  return (
    <main className='2xl:h-[91.5vh] w-full flex items-center justify-center md:mt-[150px] 2xl:mt-0'>
      <div className="content">
        <div className="fundo">
          <h1 className="title text-3xl font-bold">Seja bem vindo!</h1>
          <p className="subtitle">
            Por favor, selecione um arquivo (.rar), faça o upload e clique em
            atualizar <br /> para inserir os dados da tabela SIGTAP atualizados.
          </p>
          <div className="container">
            <label className='label' htmlFor="fileInput">
              <Image src={addPasta} alt="Pasta" className="w-7 h-6" />
              Selecionar um arquivo
            </label>
            <input className='input' type="file" id="fileInput" name="fileInput" accept=".zip" />
            <button id="uploadButton" onClick={handleUpload}>Upload</button>
          </div>
          <button id="updateButton">Atualizar</button>
        </div>
      </div>
    </main>
  );
};

export default UploadFileComponent;