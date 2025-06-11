"use client";

import React from "react";
import { CheckCircle, ChevronLeftIcon, ChevronRightIcon, Loader } from "lucide-react";
import Footer from "@/components/footer";
import Image from "next/image";

type Riwayat = {
  id: number;
  image: string;
  status: 'Selesai' | 'Sedang diproses';
  date: string;
  points?: number;
};

const dummyRiwayat: Riwayat[] = [
  {
    id: 1,
    image: '/images/bottles.jpg',
    status: 'Sedang diproses',
    date: '24 Apr 2025',
  },
  {
    id: 2,
    image: '/images/boxes.jpg',
    status: 'Selesai',
    date: '22 Apr 2025',
    points: 100,
  },
  {
    id: 3,
    image: '/images/bananas.jpg',
    status: 'Selesai',
    date: '20 Apr 2025',
    points: 50,
  },
];

export default function TransactionHistory() {
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
        <main className="p-4 space-y-4 relative mt-20">
        {dummyRiwayat.map((riwayat) => (
          <div
            key={riwayat.id}
            className="flex gap-4 items-center bg-white shadow-md rounded-xl p-4 border border-gray-200"
          >
            <div className="w-24 h-24 relative rounded-lg overflow-hidden">
              <Image src={riwayat.image} alt="Riwayat" fill className="object-cover" />
            </div>

            <div className="flex-1">
              <p
                className={`text-sm font-semibold ${
                  riwayat.status === 'Selesai' ? 'text-green-600' : 'text-cyan-700'
                }`}
              >
                {riwayat.status}
              </p>

              {riwayat.status === 'Selesai' && riwayat.points !== undefined && (
                <p className="text-xs text-green-500 mt-1">
                  Kamu mendapatkan <strong>+{riwayat.points} point!</strong>
                </p>
              )}

              <p className="text-xs text-gray-500 mt-1">{riwayat.date}</p>
            </div>

            <div className="flex flex-col items-end">
              <button
                onClick={() => {}}
                className="text-xs text-cyan-700 border border-cyan-700 px-3 py-1 rounded-full hover:bg-cyan-50 transition"
              >
                Detail
              </button>
              {riwayat.status === 'Selesai' ? (
                <CheckCircle className="text-green-500 mt-2" size={20} />
              ) : (
                <Loader className="text-cyan-700 animate-spin mt-2" size={20} />
              )}
            </div>
          </div>
        ))}
        </main>

      {/* Footer */}
        <Footer />
    </div>
  );
}