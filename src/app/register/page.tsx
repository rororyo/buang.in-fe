"use client";
import api from '@/lib/api';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Register = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
  
    try {
      const response = await api.post('auth/register', {
        username,
        email,
        password,
      });
      toast.success('Registration successful!');
      setTimeout(() => {
        router.push('/login');
      }, 500);
      
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#235C58' }}>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md p-6 bg-white rounded-lg" style={{ backgroundColor: '#235C58' }}>
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Username"
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ backgroundColor: '#569490', color: 'black' }}
          />
        </div>
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
        <div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm Password"
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ backgroundColor: '#569490', color: 'black' }}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ backgroundColor: '#000000', color: 'white' }}
        >
          Register
        </button>
        <div className="mt-4 text-center text-sm text-black-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </div>
      </form>
    </div>
  );
};

export default Register;