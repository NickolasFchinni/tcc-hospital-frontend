"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://api-production-58ca.up.railway.app/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);

      console.log('Login successful:', token, user);
      router.push('/home');
    } catch (error) {
      console.error('Failed to login:', error);
      alert('Email ou senha incorretos');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-t from-blue-700 to-cyan-500 overflow-hidden ">
      <div className="container max-w-lg w-full p-6 bg-white rounded-lg shadow-xl

">
        <form onSubmit={handleSubmit}>
          <h1 className="text-blue-500 text-4xl font-extrabold mb-8 text-center">Hospital</h1>
          <hr className="bg-gradient-to-r from-white via-blue-900 to-cyan-400 via-cyan-400 to-white h-2 mb-4 flex flex-col items-center" />
          <label htmlFor="email" className="block text-black mb-2">
            E-mail:
          </label>
          <input
            type="text"
            id="email"
            name="email"
            required
            className="block w-full px-4 py-3 mb-4 outline outline-gray-500 outline-1 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password" className="block text-black mb-2">
            Senha:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="block w-full px-4 py-3 mb-10 outline outline-gray-500 outline-1 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="submit"
            value="Enviar"
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-md cursor-pointer text-lg font-bold  flex flex-col items-center"
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
