"use client";

import React, { useState, useEffect } from "react";
import { FilterIcon, CheckIcon, XIcon, SearchIcon, EyeIcon, XCircleIcon, RefreshCw } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-toastify";

interface PickupRequest {
  id: string;
  name: string;
  address: string;
  total_weight: number;
  img_url: string;
  status: 'pending' | 'accepted' | 'rejected';
  phone_number: string;
  pickup_location: {
    type: string;
    coordinates: [number, number];
  };
  pickup_time: string;
  created_at: string;
  user_id: string;
  trash_bank_id: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    points: number;
    created_at: string;
  };
  trashBank: {
    id: string;
    username: string;
    email: string;
    role: string;
    location: {
      type: string;
      coordinates: [number, number];
    };
  };
}

interface ApiResponse {
  status: string;
  message: string;
  data: PickupRequest[];
  metadata: {
    page: number;
    size: number;
    total_item: number;
    total_page: number;
  };
}

const AdminPage = () => {
  const [filterNama, setFilterNama] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [data, setData] = useState<PickupRequest[]>([]);
  const [selected, setSelected] = useState<PickupRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch pickup requests
  const fetchPickupRequests = async (currentPage = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const params: any = {
        page: currentPage,
        limit: 10,
        orderBy: 'desc'
      };
      
      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await api.get<ApiResponse>('/api/bank-sampah/setor-request', { params });
      
      if (response.data.status === 'success') {
        setData(response.data.data);
        setTotalPages(response.data.metadata.total_page);
        setPage(response.data.metadata.page);
      }
    } catch (err: any) {
      console.error('Error fetching pickup requests:', err);
      setError(err.response?.data?.message || 'Failed to fetch pickup requests');
    } finally {
      setLoading(false);
    }
  };

  // Handle accept/reject request
  const handleRequestAction = async (id: string, status: 'accepted' | 'rejected') => {
    setProcessingId(id);
    
    try {
      const response = await api.post(`/api/bank-sampah/setor-request/${id}?status=${status}`);
      
      if (response.data.status === 'success') {
        // Update local state
        setData(prev => 
          prev.map(item => 
            item.id === id ? { ...item, status } : item
          )
        );
        
        // Show success message (you can implement toast notifications)
        toast.success(`Request ${status === 'accepted' ? 'accepted' : 'rejected'} successfully`);
        
        // Close modal if currently viewing this request
        if (selected?.id === id) {
          setSelected({ ...selected, status });
        }
      }
    } catch (err: any) {
      console.error(`Error ${status} request:`, err);
      setError(err.response?.data?.message || `Failed to ${status} request`);
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
    fetchPickupRequests();
  }, [statusFilter]);

  // Pagination handlers
  const handlePrevPage = () => {
    if (page > 1) {
      fetchPickupRequests(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      fetchPickupRequests(page + 1);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen" style={{ backgroundColor: "#569490" }}>
      {/* Header Admin */}
      <div className="fixed w-full items-center justify-between p-4 bg-white shadow-md z-50" style={{ backgroundColor: "#235C58" }}>
        <h1 className="text-2xl font-bold text-white text-center w-full">Bank Sampah - Verifikasi Sampah</h1>
      </div>
      
      {/* Main Content */}
      <div className="w-full mt-20 max-w-6xl bg-white p-6 rounded-lg shadow-md mb-10">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <XIcon size={20} />
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 gap-2">
          <div className="flex items-center gap-2">
            <SearchIcon size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Cari nama user..."
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <FilterIcon size={18} className="text-gray-500" />
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
              <option value="accepted">Diterima</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>

          <button
            onClick={() => fetchPickupRequests(page)}
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
                           item.status === 'accepted' ? 'Diterima' : 'Ditolak'}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => setSelected(item)}
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <EyeIcon size={16} /> Lihat Detail
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
                                <CheckIcon size={16} />
                              )}
                              Terima
                            </button>
                            <button
                              onClick={() => handleTolak(item.id)}
                              disabled={processingId === item.id}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 disabled:opacity-50"
                            >
                              {processingId === item.id ? (
                                <RefreshCw size={16} className="animate-spin" />
                              ) : (
                                <XIcon size={16} />
                              )}
                              Tolak
                            </button>
                          </>
                        ) : item.status === "accepted" ? (
                          <span className="text-green-600 font-semibold">Diterima</span>
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
              <XCircleIcon size={28} />
            </button>
            
            <div className="flex flex-col items-center md:items-start md:w-1/3">
              <img
                src={selected.img_url ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${selected.img_url}` : "https://via.placeholder.com/200x200?text=No+Image"}
                alt="Foto Sampah"
                className="w-48 h-48 object-cover rounded-lg border mb-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/200x200?text=No+Image";
                }}
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-4 text-center md:text-left text-green-700">
                Detail Pengiriman Sampah
              </h2>
              <div className="space-y-2 text-base">
                <p><span className="font-semibold">Nama:</span> {selected.user.username}</p>
                <p><span className="font-semibold">Email:</span> {selected.user.email}</p>
                <p><span className="font-semibold">Tanggal Pengajuan:</span> {formatDate(selected.created_at)}</p>
                <p><span className="font-semibold">Waktu Pickup:</span> {formatDate(selected.pickup_time)}</p>
                <p><span className="font-semibold">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                    selected.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selected.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selected.status === 'pending' ? 'Menunggu' :
                     selected.status === 'accepted' ? 'Diterima' : 'Ditolak'}
                  </span>
                </p>
                <p><span className="font-semibold">Total Berat:</span> {selected.total_weight} gram</p>
                <p><span className="font-semibold">Alamat:</span> {selected.address}</p>
                <p><span className="font-semibold">No. Telepon:</span> {selected.phone_number}</p>
                <p><span className="font-semibold">Lokasi Pickup:</span> {selected.pickup_location.coordinates[1]}, {selected.pickup_location.coordinates[0]}</p>
                <p><span className="font-semibold">Poin User:</span> {selected.user.points}</p>
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
                      <CheckIcon size={16} />
                    )}
                    Terima
                  </button>
                  <button
                    onClick={() => handleTolak(selected.id)}
                    disabled={processingId === selected.id}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
                  >
                    {processingId === selected.id ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <XIcon size={16} />
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

export default AdminPage;