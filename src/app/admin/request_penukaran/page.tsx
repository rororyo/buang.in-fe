"use client";

import React, { useState, useEffect } from "react";
import { Filter, Check, X, Search, Eye, XCircle, RefreshCw, ChevronLeftIcon, ChevronLeft } from "lucide-react";
import AdminFooter from "@/components/admin-footer";

interface RedeemRequest {
  id: string;
  user_id: string;
  points_redeemed: number;
  payment_method: string;
  payment_number: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    points: number;
    created_at: string;
  };
}

// Dummy data
const dummyData: RedeemRequest[] = [
  {
    id: "1",
    user_id: "user1",
    points_redeemed: 500,
    payment_method: "Bank BCA",
    payment_number: "1234567890",
    status: 'pending',
    created_at: "2024-06-20T10:30:00Z",
    updated_at: "2024-06-20T10:30:00Z",
    user: {
      id: "user1",
      username: "john_doe",
      email: "john@example.com",
      role: "user",
      points: 1200,
      created_at: "2024-01-15T08:00:00Z"
    },
  },
  {
    id: "2",
    user_id: "user2",
    points_redeemed: 300,
    payment_method: "DANA",
    payment_number: "085811223344",
    status: 'accepted',
    created_at: "2024-06-19T14:20:00Z",
    updated_at: "2024-06-19T15:00:00Z",
    user: {
      id: "user2",
      username: "jane_smith",
      email: "jane@example.com",
      role: "user",
      points: 800,
      created_at: "2024-02-10T09:30:00Z"
    },
  },
  {
    id: "3",
    user_id: "user3",
    payment_method: "GOPAY",
    payment_number: "081234567890",
    points_redeemed: 750,
    status: 'rejected',
    created_at: "2024-06-18T11:45:00Z",
    updated_at: "2024-06-18T16:20:00Z",
    user: {
      id: "user3",
      username: "mike_wilson",
      email: "mike@example.com",
      role: "user",
      points: 950,
      created_at: "2024-03-05T12:15:00Z"
    },
  },
  {
    id: "4",
    user_id: "user4",
    payment_method: "OVO",
    payment_number: "081234567890",
    points_redeemed: 200,
    status: 'pending',
    created_at: "2024-06-21T09:15:00Z",
    updated_at: "2024-06-21T09:15:00Z",
    user: {
      id: "user4",
      username: "sarah_connor",
      email: "sarah@example.com",
      role: "user",
      points: 600,
      created_at: "2024-04-01T10:00:00Z"
    },
  },
  {
    id: "5",
    user_id: "user5",
    payment_method: "Bank BRI",
    payment_number: "1234567890",
    points_redeemed: 1000,
    status: 'pending',
    created_at: "2024-06-22T13:30:00Z",
    updated_at: "2024-06-22T13:30:00Z",
    user: {
      id: "user5",
      username: "alex_brown",
      email: "alex@example.com",
      role: "user",
      points: 1500,
      created_at: "2024-02-20T14:45:00Z"
    },
  },
  {
    id: "6",
    user_id: "user6",
    payment_method: "Bank Mandiri",
    payment_number: "1234567890",
    points_redeemed: 400,
    status: 'accepted',
    created_at: "2024-06-17T16:00:00Z",
    updated_at: "2024-06-17T17:30:00Z",
    user: {
      id: "user6",
      username: "lisa_davis",
      email: "lisa@example.com",
      role: "user",
      points: 900,
      created_at: "2024-03-15T11:20:00Z"
    },
  }
];

const RedeemPointsPage = () => {
  const [filterNama, setFilterNama] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [data, setData] = useState<RedeemRequest[]>(dummyData);
  const [selected, setSelected] = useState<RedeemRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Simulate API fetch with dummy data
  const fetchRedeemRequests = async (currentPage = 1) => {
    setLoading(true);
    setError(null);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      let filteredData = [...dummyData];
      
      // Apply status filter
      if (statusFilter) {
        filteredData = filteredData.filter(item => item.status === statusFilter);
      }
      
      // Simulate pagination
      const itemsPerPage = 10;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      setData(paginatedData);
      setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
      setPage(currentPage);
    } catch (err: any) {
      console.error('Error fetching redeem requests:', err);
      setError('Failed to fetch redeem requests');
    } finally {
      setLoading(false);
    }
  };

  // Handle accept/reject request with dummy simulation
  const handleRequestAction = async (id: string, status: 'accepted' | 'rejected') => {
    setProcessingId(id);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Update local state
      setData(prev => 
        prev.map(item => 
          item.id === id ? { ...item, status } : item
        )
      );
      
      // Also update the original dummy data for persistence
      const itemIndex = dummyData.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        dummyData[itemIndex].status = status;
      }
      
      // Show success message (you can replace this with actual toast)
      console.log(`Request ${status === 'accepted' ? 'accepted' : 'rejected'} successfully`);
      alert(`Request ${status === 'accepted' ? 'accepted' : 'rejected'} successfully`);
      
      // Close modal if currently viewing this request
      if (selected?.id === id) {
        setSelected({ ...selected, status });
      }
    } catch (err: any) {
      console.error(`Error ${status} request:`, err);
      setError(`Failed to ${status} request`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleTerima = (id: string) => handleRequestAction(id, 'accepted');
  const handleTolak = (id: string) => handleRequestAction(id, 'rejected');

  // Filter data based on search criteria
  const filteredData = data.filter(item => {
    const nameMatch = !filterNama || 
      item.user.username.toLowerCase().includes(filterNama.toLowerCase());
    
    const dateMatch = !filterTanggal || 
      item.created_at.includes(filterTanggal);
    
    return nameMatch && dateMatch;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchRedeemRequests();
  }, [statusFilter]);

  // Pagination handlers
  const handlePrevPage = () => {
    if (page > 1) {
      fetchRedeemRequests(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      fetchRedeemRequests(page + 1);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="fixed w-full top-0 z-50 bg-white shadow-lg border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => (window.location.href = "/admin")}
              className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Verifikasi Penukaran Poin</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 pt-20">
        <div className="flex flex-col items-center p-4 pb-20">
          
          {/* Welcome Section */}
          <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verifikasi Penukaran Poin 💰
              </h2>
              <p className="text-gray-600">
                Kelola dan verifikasi permintaan penukaran poin dari pengguna
              </p>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex justify-between items-center">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Filters Section */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Search size={16} className="text-gray-600" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari nama user..."
                    value={filterNama}
                    onChange={(e) => setFilterNama(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Filter size={16} className="text-gray-600" />
                  </div>
                  <input
                    type="date"
                    value={filterTanggal}
                    onChange={(e) => setFilterTanggal(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Selesai</option>
                  <option value="rejected">Ditolak</option>
                </select>

                <button
                  onClick={() => fetchRedeemRequests(page)}
                  disabled={loading}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <RefreshCw size={32} className="animate-spin mx-auto mb-4 text-emerald-500" />
                <p className="text-gray-500">Memuat data...</p>
              </div>
            )}

            {/* Table */}
            {!loading && (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-4 px-6 text-left font-semibold text-gray-900">Nama User</th>
                      <th className="py-4 px-6 text-left font-semibold text-gray-900">Tanggal</th>
                      <th className="py-4 px-6 text-left font-semibold text-gray-900">Status</th>
                      <th className="py-4 px-6 text-left font-semibold text-gray-900">Detail</th>
                      <th className="py-4 px-6 text-center font-semibold text-gray-900">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-gray-500">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                              <Search size={24} className="text-gray-400" />
                            </div>
                            <p className="text-lg font-medium mb-2">Tidak ada data ditemukan</p>
                            <p className="text-sm">Coba ubah filter pencarian Anda</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="font-medium text-gray-900">{item.user.username}</div>
                          </td>
                          <td className="py-4 px-6 text-gray-600">{formatDate(item.created_at)}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              item.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.status === 'pending' ? 'Menunggu' :
                               item.status === 'accepted' ? 'Selesai' : 'Ditolak'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => setSelected(item)}
                              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                            >
                              <Eye size={16} /> Lihat Detail
                            </button>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2 justify-center">
                              {item.status === "pending" ? (
                                <>
                                  <button
                                    onClick={() => handleTerima(item.id)}
                                    disabled={processingId === item.id}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 disabled:opacity-50 transition-colors text-xs font-medium"
                                  >
                                    {processingId === item.id ? (
                                      <RefreshCw size={14} className="animate-spin" />
                                    ) : (
                                      <Check size={14} />
                                    )}
                                    Selesaikan
                                  </button>
                                  <button
                                    onClick={() => handleTolak(item.id)}
                                    disabled={processingId === item.id}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 disabled:opacity-50 transition-colors text-xs font-medium"
                                  >
                                    {processingId === item.id ? (
                                      <RefreshCw size={14} className="animate-spin" />
                                    ) : (
                                      <X size={14} />
                                    )}
                                    Tolak
                                  </button>
                                </>
                              ) : item.status === "accepted" ? (
                                <span className="text-green-600 font-semibold text-sm">✓ Selesai</span>
                              ) : (
                                <span className="text-red-600 font-semibold text-sm">✗ Ditolak</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 gap-4">
                <button
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition-colors font-medium"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition-colors font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Detail */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10 border border-gray-200">
            <button
              className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors z-20"
              onClick={() => setSelected(null)}
            >
              <XCircle size={28} />
            </button>
            
            <div className="flex flex-col">
              {/* Header Section */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Detail Penukaran Poin</h2>
                  <p className="text-gray-600">Informasi lengkap permintaan penukaran</p>
                </div>
              </div>
              
              {/* Details Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-500">Nama Pengguna</label>
                    <p className="text-lg font-semibold text-gray-900">{selected.user.username}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg text-gray-900">{selected.user.email}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-500">Tanggal Pengajuan</label>
                    <p className="text-lg text-gray-900">{formatDate(selected.created_at)}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                        selected.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selected.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selected.status === 'pending' ? 'Menunggu' :
                         selected.status === 'accepted' ? 'Selesai' : 'Ditolak'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-500">Poin yang Ditukar</label>
                    <p className="text-lg font-semibold text-emerald-600">{selected.points_redeemed}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-500">Metode Pembayaran</label>
                    <p className="text-lg text-gray-900">{selected.payment_method}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Nomor Tujuan</label>
                    <p className="text-lg font-mono text-gray-900">{selected.payment_number}</p>
                  </div>
                </div>
                
                {/* Action buttons in modal */}
                {selected.status === 'pending' && (
                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleTerima(selected.id)}
                      disabled={processingId === selected.id}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors font-medium"
                    >
                      {processingId === selected.id ? (
                        <RefreshCw size={18} className="animate-spin" />
                      ) : (
                        <Check size={18} />
                      )}
                      Selesaikan Penukaran
                    </button>
                    <button
                      onClick={() => handleTolak(selected.id)}
                      disabled={processingId === selected.id}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors font-medium"
                    >
                      {processingId === selected.id ? (
                        <RefreshCw size={18} className="animate-spin" />
                      ) : (
                        <X size={18} />
                      )}
                      Tolak Penukaran
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <AdminFooter />
    </>
  );
};

export default RedeemPointsPage;