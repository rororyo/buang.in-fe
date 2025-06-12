"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, ChevronLeftIcon, ChevronRightIcon, Loader } from "lucide-react";
import Footer from "@/components/footer";
import Image from "next/image";
import { fetchRiwayat } from "@/lib/api/riwayat";
import { useRouter } from "next/navigation";

type Riwayat = {
  id: string;
  image: string;
  status: 'Selesai' | 'Sedang diproses';
  date: string;
  points?: number;
};

export default function TransactionHistory() {
  const router = useRouter();
  const [riwayatList, setRiwayatList] = useState<Riwayat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchRiwayat();
        // Map the backend data to match Riwayat shape if needed
        const mapped = data.map((item: any) => ({
          id: item.id,
          image: item.img_url ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${item.img_url}` : "https://via.placeholder.com/200x200?text=No+Image",
          status: item.status === "accepted" ? "Selesai" : "Sedang diproses",
          date: new Date(item.created_at).toLocaleDateString("id-ID", {
            day: '2-digit', month: 'short', year: 'numeric'
          }),
          points: item.points, // optional
        }));
        setRiwayatList(mapped);
      } catch (error) {
        console.error("Failed to fetch riwayat:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col mb-10 items-center min-h-screen" style={{ backgroundColor: '#569490' }}>
      <div className="fixed w-full z-50 items-center justify-between p-4 bg-white shadow-md">
        <button
          onClick={router.back}
          className="absolute top-3 left-4 flex items-center justify-center w-10 h-10 text-white rounded-full"
        >
          <ChevronLeftIcon size={20} stroke="black" />
        </button>
        <h1 className="text-2xl font-bold text-black-500 text-center w-full">Riwayat</h1>
      </div>

      <main className="p-4 space-y-4 relative mt-20">
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : riwayatList.length === 0 ? (
          <p className="text-white">Tidak ada riwayat ditemukan.</p>
        ) : (
          riwayatList.map((riwayat) => (
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
                  onClick={() => (window.location.href = "/riwayat/" + riwayat.id)}
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
          ))
        )}
      </main>

      <Footer />
    </div>
  );
}
