"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, ChevronLeftIcon, Clock, XCircle, Eye } from "lucide-react";
import Footer from "@/components/footer";
import Image from "next/image";
import { fetchRiwayat } from "@/lib/api/riwayat";
import { useRouter } from "next/navigation";

type Riwayat = {
  id: string;
  image: string;
  status: 'Selesai' | 'Sedang diproses' | 'Ditolak';
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
          status: item.status === "accepted" ? "Selesai" : item.status === "rejected" ? "Ditolak" : "Sedang diproses",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai':
        return 'text-green-600 bg-green-50';
      case 'Ditolak':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Selesai':
        return <CheckCircle className="text-green-500" size={18} />;
      case 'Ditolak':
        return <XCircle className="text-red-500" size={18} />;
      default:
        return <Clock className="text-blue-500" size={18} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={router.back}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeftIcon size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Riwayat Transaksi</h1>
          <div className="w-10 h-10"></div> {/* Spacer for balance */}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
            <p className="text-gray-600 text-sm">Memuat riwayat...</p>
          </div>
        ) : riwayatList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 text-center">Belum ada riwayat transaksi</p>
            <p className="text-gray-400 text-sm text-center mt-1">Mulai buat pesanan pertama Anda!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {riwayatList.map((riwayat, index) => (
              <div
                key={riwayat.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image 
                        src={riwayat.image} 
                        alt="Sampah" 
                        fill 
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(riwayat.status)}
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(riwayat.status)}`}>
                          {riwayat.status}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Penjemputan Sampah #{riwayat.id.slice(-6)}
                      </p>

                      {riwayat.status === 'Selesai' && riwayat.points !== undefined && (
                        <div className="flex items-center gap-1 mb-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">+</span>
                          </div>
                          <span className="text-sm font-medium text-green-600">
                            {riwayat.points} poin
                          </span>
                        </div>
                      )}

                      <p className="text-xs text-gray-500">{riwayat.date}</p>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => (window.location.href = "/riwayat/" + riwayat.id)}
                        className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <Eye size={14} />
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}