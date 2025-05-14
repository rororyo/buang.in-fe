"use client";

import React from 'react';
import { FaFileAlt, FaWineGlassAlt, FaTrashAlt } from 'react-icons/fa';
import { FaBottleWater } from "react-icons/fa6";
import Footer from '@/components/footer';

const DashboardPage = () => {
  const username = "Lorem Ipsum";
  const saldo = 1500000; // Ganti dengan data saldo yang sesuai

  return (
    <div className="flex flex-col items-center min-h-screen p-6" style={{ backgroundColor: '#235C58' }}>
      {/* Bagian Atas: Halo User, Saldo, dan Foto Profil */}
      <div className="grid grid-cols-2 grid-rows-2 w-full max-w-4xl bg-white p-6 rounded-lg shadow-md mb-6">
        {/* Kiri Atas: Halo User */}
        <div className="row-start-1 col-start-1">
          <h2 className="text-lg font-semibold text-gray-800">Halo, {username}</h2>
        </div>

        {/* Kiri Bawah: Saldo */}
        <div className="row-start-2 col-start-1">
          <h4 className="text-sm font-bold text-gray-800">Saldo Anda</h4>
          <p className="text-xl font-semibold text-green-600 mt-1">
            Rp {saldo.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Kanan: Foto Profil */}
        <div className="row-span-2 col-start-2 flex justify-end items-center">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-gray-300"
          />
        </div>
      </div>

      {/* Bagian Kriteria Sampah */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        {/* Judul */}
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Kriteria Sampah</h3>

        {/* Kriteria Sampah */}
        <div className="grid grid-cols-2 gap-4">
          {/* Kertas */}
          <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow">
            <FaFileAlt size={32} className="text-blue-500 mb-2" />
            <h4 className="text-md font-semibold text-gray-800">Kertas</h4>
            <p className="text-sm text-gray-600 text-center">
              Kotak atau potongan Kardus, Koran, Majalah, Kertas, dll.
            </p>
          </div>

          {/* Plastik */}
          <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow" style={{ backgroundColor: "#569490" }}>
            <FaBottleWater size={32} className="text-green-500 mb-2" />
            <h4 className="text-md font-semibold text-gray-800">Plastik</h4>
            <p className="text-sm text-black-600 text-center">
              Kemasan, botol PET, toples, sedotan, tutup botol, dll.
            </p>
          </div>

          {/* Kaca */}
          <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow">
            <FaWineGlassAlt size={32} className="text-red-500 mb-2" />
            <h4 className="text-md font-semibold text-gray-800">Kaca</h4>
            <p className="text-sm text-gray-600 text-center">
              Botol kaca, gelas kaca, dan barang berbahan kaca lainnya.
            </p>
          </div>

          {/* Logam */}
          <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow">
            <FaTrashAlt size={32} className="text-yellow-500 mb-2" />
            <h4 className="text-md font-semibold text-gray-800">Logam</h4>
            <p className="text-sm text-gray-600 text-center">
              Kaleng makanan, alat logam, dan barang logam lainnya.
            </p>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default DashboardPage;