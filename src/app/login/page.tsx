"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-toastify';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      const response = await api.post('auth/login', {
        email,
        password,
      });
      if (response.status === 200) {
        const token = response.data.token;
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure`;
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        toast.success('Login successful!');
        setTimeout(() => {
          router.push('/');
        }, 500); 
      }
      if (response.status ==400){
        toast.error('Invalid credentials!');
      }

    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Login failed');
    }
    }

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#235C58' }}>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md p-6 bg-white rounded-lg" style={{ backgroundColor: '#235C58' }}>
      <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ backgroundColor: '#569490', color: 'black' }}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ backgroundColor: '#569490', color: 'black' }}
          />
        </div>
        <div className="text-right">
          <a href="#" className="text-sm text-blue-500 hover:underline">
            Forgot password?
          </a>
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ backgroundColor: '#000000', color: 'white' }}
        >
          Login
        </button>
        <div className="text-center text-sm text-black-500">
          Don't have an account yet?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;