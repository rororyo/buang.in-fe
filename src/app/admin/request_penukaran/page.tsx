"use client";

import React, { useState, useEffect } from "react";
import { Filter, Check, X, Search, Eye, XCircle, RefreshCw, ChevronLeftIcon } from "lucide-react";

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
    <div className="flex flex-col items-center min-h-screen" style={{ backgroundColor: "#569490" }}>
      {/* Header Admin */}
      <div className="fixed w-full items-center justify-between p-4 bg-white shadow-md z-50" style={{ backgroundColor: "#235C58" }}>
        <button
          onClick={() => (window.location.href = "/admin")}
          className="absolute top-3 left-4 flex items-center justify-center w-10 h-10 text-white rounded-full hover:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ChevronLeftIcon size={20} stroke="white"/>
        </button>
        <h1 className="text-2xl font-bold text-white text-center w-full">Bank Sampah - Verifikasi Penukaran Poin</h1>
      </div>
      
      {/* Main Content */}
      <div className="w-full mt-20 max-w-6xl bg-white p-6 rounded-lg shadow-md mb-10">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X size={20} />
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Cari nama user..."
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <input
              type="date"
              value={filterTanggal}
              onChange={(e) => setFilterTanggal(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Selesai</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>

          <button
            onClick={() => fetchRedeemRequests(page)}
            disabled={loading}
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Memuat data...</p>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4">Nama User</th>
                  <th className="py-2 px-4">Tanggal</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Detail</th>
                  <th className="py-2 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-400">
                      Tidak ada data.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2 px-4">{item.user.username}</td>
                      <td className="py-2 px-4">{formatDate(item.created_at)}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          item.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status === 'pending' ? 'Menunggu' :
                           item.status === 'accepted' ? 'Selesai' : 'Ditolak'}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => setSelected(item)}
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <Eye size={16} /> Lihat Detail
                        </button>
                      </td>
                      <td className="py-2 px-4 flex gap-2 justify-center">
                        {item.status === "pending" ? (
                          <>
                            <button
                              onClick={() => handleTerima(item.id)}
                              disabled={processingId === item.id}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1 disabled:opacity-50"
                            >
                              {processingId === item.id ? (
                                <RefreshCw size={16} className="animate-spin" />
                              ) : (
                                <Check size={16} />
                              )}
                              Selesaikan
                            </button>
                            <button
                              onClick={() => handleTolak(item.id)}
                              disabled={processingId === item.id}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 disabled:opacity-50"
                            >
                              {processingId === item.id ? (
                                <RefreshCw size={16} className="animate-spin" />
                              ) : (
                                <X size={16} />
                              )}
                              Tolak
                            </button>
                          </>
                        ) : item.status === "accepted" ? (
                          <span className="text-green-600 font-semibold">Selesai</span>
                        ) : (
                          <span className="text-red-600 font-semibold">Ditolak</span>
                        )}
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
          <div className="flex justify-center items-center mt-4 gap-4">
            <button
              onClick={handlePrevPage}
              disabled={page <= 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page >= totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelected(null)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl z-10 flex flex-col md:flex-row gap-8 border-2 border-green-200">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 z-20"
              onClick={() => setSelected(null)}
            >
              <XCircle size={28} />
            </button>
            
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-4 text-center md:text-left text-green-700">
                Detail Penukaran Poin
              </h2>
              <div className="space-y-2 text-base">
                <p><span className="font-semibold">Nama User:</span> {selected.user.username}</p>
                <p><span className="font-semibold">Email:</span> {selected.user.email}</p>
                <p><span className="font-semibold">Tanggal Pengajuan:</span> {formatDate(selected.created_at)}</p>
                <p><span className="font-semibold">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                    selected.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selected.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selected.status === 'pending' ? 'Menunggu' :
                     selected.status === 'accepted' ? 'Selesai' : 'Ditolak'}
                  </span>
                </p>
                <p><span className="font-semibold">Poin yang ingin ditukar:</span> {selected.points_redeemed}</p>
                <p><span className="font-semibold">Metode Pembayaran:</span> {selected.payment_method}</p>
                <p><span className="font-semibold">Nomor Tujuan:</span> {selected.payment_number}</p>
              </div>
              
              {/* Action buttons in modal */}
              {selected.status === 'pending' && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleTerima(selected.id)}
                    disabled={processingId === selected.id}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
                  >
                    {processingId === selected.id ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                    Selesaikan
                  </button>
                  <button
                    onClick={() => handleTolak(selected.id)}
                    disabled={processingId === selected.id}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
                  >
                    {processingId === selected.id ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <X size={16} />
                    )}
                    Tolak
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedeemPointsPage;