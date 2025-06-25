"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, ChevronLeftIcon, Clock, XCircle, Eye, Filter, Calendar } from "lucide-react";
import Footer from "@/components/footer";
import Image from "next/image";
import { fetchRiwayat } from "@/lib/api/riwayat";
import { useRouter } from "next/navigation";

type Riwayat = {
  id: string;
  image: string;
  status: 'Selesai' | 'Sedang diproses' | 'Ditolak';
  date: string;
  dateObj: Date; // Add date object for filtering
  points?: number;
};

type DateFilter = 'all' | 'today' | 'week' | 'month' | 'custom';

export default function TransactionHistory() {
  const router = useRouter();
  const [riwayatList, setRiwayatList] = useState<Riwayat[]>([]);
  const [filteredRiwayat, setFilteredRiwayat] = useState<Riwayat[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

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
          dateObj: new Date(item.created_at), // Store original date object
          points: item.points, // optional
        }));
        setRiwayatList(mapped);
        setFilteredRiwayat(mapped);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter function
  const filterByDate = (data: Riwayat[], filter: DateFilter, startDate?: string, endDate?: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filter) {
      case 'today':
        return data.filter(item => {
          const itemDate = new Date(item.dateObj.getFullYear(), item.dateObj.getMonth(), item.dateObj.getDate());
          return itemDate.getTime() === today.getTime();
        });
      
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return data.filter(item => item.dateObj >= weekAgo);
      
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return data.filter(item => item.dateObj >= monthAgo);
      
      case 'custom':
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999); // Include the entire end date
          return data.filter(item => item.dateObj >= start && item.dateObj <= end);
        }
        return data;
      
      default:
        return data;
    }
  };

  // Apply filter when dateFilter or custom dates change
  useEffect(() => {
    const filtered = filterByDate(riwayatList, dateFilter, customStartDate, customEndDate);
    setFilteredRiwayat(filtered);
  }, [riwayatList, dateFilter, customStartDate, customEndDate]);

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

  const getFilterLabel = () => {
    switch (dateFilter) {
      case 'today': return 'Hari Ini';
      case 'week': return '7 Hari Terakhir';
      case 'month': return '30 Hari Terakhir';
      case 'custom': return 'Rentang Tanggal';
      default: return 'Semua Waktu';
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
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors relative"
          >
            <Filter size={20} className="text-gray-700" />
            {dateFilter !== 'all' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
            )}
          </button>
        </div>

        {/* Filter Menu */}
        {showFilterMenu && (
          <div className="absolute right-4 top-16 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-64 z-50">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Filter berdasarkan tanggal</h3>
              
              {/* Filter Options */}
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'Semua Waktu' },
                  { value: 'today', label: 'Hari Ini' },
                  { value: 'week', label: '7 Hari Terakhir' },
                  { value: 'month', label: '30 Hari Terakhir' },
                  { value: 'custom', label: 'Rentang Tanggal' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="dateFilter"
                      value={option.value}
                      checked={dateFilter === option.value}
                      onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>

              {/* Custom Date Range */}
              {dateFilter === 'custom' && (
                <div className="space-y-3 pt-3 border-t border-gray-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Tanggal Akhir
                    </label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setShowFilterMenu(false)}
                className="w-full mt-4 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        )}

        {/* Active Filter Indicator */}
        {dateFilter !== 'all' && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
              <Calendar size={16} className="text-green-600" />
              <span className="text-sm text-green-700">
                Filter: {getFilterLabel()}
              </span>
              <button
                onClick={() => {
                  setDateFilter('all');
                  setCustomStartDate('');
                  setCustomEndDate('');
                }}
                className="ml-auto text-green-600 hover:text-green-700"
              >
                <XCircle size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
            <p className="text-gray-600 text-sm">Memuat riwayat...</p>
          </div>
        ) : filteredRiwayat.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 text-center">
              {dateFilter === 'all' ? 'Belum ada riwayat transaksi' : 'Tidak ada transaksi untuk periode ini'}
            </p>
            <p className="text-gray-400 text-sm text-center mt-1">
              {dateFilter === 'all' ? 'Mulai buat pesanan pertama Anda!' : 'Coba ubah filter tanggal'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Results Counter */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Menampilkan {filteredRiwayat.length} dari {riwayatList.length} transaksi
              </p>
            </div>

            {filteredRiwayat.map((riwayat, index) => (
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