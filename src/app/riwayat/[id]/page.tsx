"use client";

import Footer from '@/components/footer';
import { ChevronLeftIcon } from 'lucide-react';
import Image from 'next/image';

const riwayatDetails = {
  id: 1,
  image: '/images/bottles.jpg',
  status: 'Bank sampah sedang menuju ke lokasi untuk mengangkut sampah',
  depositor: {
    name: 'Haidar Rais',
    address: 'Jl. Kertajaya Indah Timur XVI 48-2',
    phone: '+628512345678',
    type: 'Campuran',
    weight: '5 Kg',
    date: '24 April 2025, 15:37 WIB',
  },
  bank: {
    name: 'Bank Sampah Induk Surabaya',
    address:
      'Jl. Raya Menur No.31-A, Manyar Sabrangan, Kec. Mulyorejo, Surabaya, Jawa Timur 60118',
  },
};

export default function RiwayatDetailPage() {
  const { image, status, depositor, bank } = riwayatDetails;

  return (
    <div className="flex flex-col mb-10 items-center min-h-screen" style={{ backgroundColor: '#569490' }}>
      {/* Tombol Back dan Judul */}
      <div className="fixed w-full z-50 items-center justify-between p-4 bg-white shadow-md" style={{ backgroundColor: "#FFFFFF" }}>
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="absolute top-3 left-4 flex items-center justify-center w-10 h-10 text-white rounded-full hover:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ChevronLeftIcon size={20} stroke="black" />
        </button>
        <h1 className="text-2xl font-bold text-black-500 text-center w-full">Riwayat</h1>
      </div>
        <main className="p-4 mt-20 bg-white">
        <h1 className="text-lg font-semibold text-center mb-4">Detail Setoran</h1>

        <div className="flex justify-center mb-4">
            <div className="relative w-64 h-40 rounded-lg overflow-hidden">
            <Image src={image} alt="Deposit" fill className="object-cover" />
            </div>
        </div>

        <div className="text-center text-cyan-700 font-semibold text-sm mb-4">
            Status
            <p className="text-xs mt-1 font-normal text-gray-600">{status}</p>
        </div>

        <div className="text-sm space-y-4">
            <div>
            <h2 className="font-semibold mb-1 text-black">Info Penyetor & Setoran:</h2>
            <p>Nama: {depositor.name}</p>
            <p>Alamat: {depositor.address}</p>
            <p>Nomor Telepon: {depositor.phone}</p>
            <p>Jenis Sampah: {depositor.type}</p>
            <p>Berat: {depositor.weight}</p>
            <p>Tanggal: {depositor.date}</p>
            </div>

            <div>
            <h2 className="font-semibold mb-1 text-black">Info Bank Sampah:</h2>
            <p>Nama: {bank.name}</p>
            <p>Alamat: {bank.address}</p>
            </div>
        </div>
        </main>
    {/* Footer */}
        <Footer />
    </div>
  );
}