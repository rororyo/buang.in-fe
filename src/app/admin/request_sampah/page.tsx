"use client";

import React, { useState, useEffect } from "react";
import { FilterIcon, CheckIcon, XIcon, SearchIcon, EyeIcon, XCircleIcon, RefreshCw, ChevronLeftIcon, ChevronLeft, X, Search, Filter, Eye, Check, XCircle } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import AdminFooter from "@/components/admin-footer";

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
  sub_district_id?: string;
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

interface SubDistrict {
  id: string;
  name: string;
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
  const [subDistrictFilter, setSubDistrictFilter] = useState("");
  const [data, setData] = useState<PickupRequest[]>([]);
  const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]);
  const [selected, setSelected] = useState<PickupRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSubDistricts, setLoadingSubDistricts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch sub-districts
  const fetchSubDistricts = async () => {
    setLoadingSubDistricts(true);
    try {
      const response = await api.get('/api/setor/sub-districts');
      
      if (response.status === 200) {
        setSubDistricts(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching sub-districts:', err);
      // Don't show error for sub-districts fetch as it's not critical
    } finally {
      setLoadingSubDistricts(false);
    }
  };

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

      if (subDistrictFilter) {
        params.sub_district_id = subDistrictFilter;
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

    const subDistrictMatch = !subDistrictFilter || 
      item.sub_district_id === subDistrictFilter;
    
    return nameMatch && dateMatch && subDistrictMatch;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  // Get sub-district name by ID
  const getSubDistrictName = (subDistrictId: string) => {
    const subDistrict = subDistricts.find(sd => sd.id === subDistrictId);
    return subDistrict ? subDistrict.name : 'Unknown';
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchSubDistricts();
  }, []);

  useEffect(() => {
    fetchPickupRequests();
  }, [statusFilter, subDistrictFilter]);

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Verifikasi Sampah</h1>
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
                Verifikasi Permintaan Pickup Sampah 🗂️
              </h2>
              <p className="text-gray-600">
                Kelola dan verifikasi permintaan penjemputan sampah dari pengguna
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
                  <option value="accepted">Diterima</option>
                  <option value="rejected">Ditolak</option>
                </select>

                <select
                  value={subDistrictFilter}
                  onChange={(e) => setSubDistrictFilter(e.target.value)}
                  disabled={loadingSubDistricts}
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50"
                >
                  <option value="">Semua Kecamatan</option>
                  {subDistricts.map((subDistrict) => (
                    <option key={subDistrict.id} value={subDistrict.id}>
                      {subDistrict.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => fetchPickupRequests(page)}
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
                      <th className="py-4 px-6 text-left font-semibold text-gray-900">Kecamatan</th>
                      <th className="py-4 px-6 text-left font-semibold text-gray-900">Tanggal</th>
                      <th className="py-4 px-6 text-left font-semibold text-gray-900">Status</th>
                      <th className="py-4 px-6 text-left font-semibold text-gray-900">Detail</th>
                      <th className="py-4 px-6 text-center font-semibold text-gray-900">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-gray-500">
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
                          <td className="py-4 px-6 text-gray-600">
                            {item.sub_district_id ? getSubDistrictName(item.sub_district_id) : 'N/A'}
                          </td>
                          <td className="py-4 px-6 text-gray-600">{formatDate(item.created_at)}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              item.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.status === 'pending' ? 'Menunggu' :
                               item.status === 'accepted' ? 'Diterima' : 'Ditolak'}
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
                                    Terima
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
                                <span className="text-green-600 font-semibold text-sm">✓ Diterima</span>
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
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image Section */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-sm">
                  <img
                    src={selected.img_url ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${selected.img_url}` : "https://via.placeholder.com/300x300?text=No+Image"}
                    alt="Foto Sampah"
                    className="w-full h-64 object-cover rounded-xl border border-gray-200 shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x300?text=No+Image";
                    }}
                  />
                </div>
              </div>
              
              {/* Details Section */}
              <div className="flex flex-col">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Detail Pickup Sampah</h2>
                    <p className="text-gray-600">Informasi lengkap permintaan</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-500">Nama Pengguna</label>
                      <p className="text-lg font-semibold text-gray-900">{selected.user.username}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-lg text-gray-900">{selected.user.email}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-500">Kecamatan</label>
                      <p className="text-lg text-gray-900">
                        {selected.sub_district_id ? getSubDistrictName(selected.sub_district_id) : 'N/A'}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="text-sm font-medium text-gray-500">Total Berat</label>
                        <p className="text-lg font-semibold text-gray-900">{selected.total_weight}g</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="text-sm font-medium text-gray-500">Poin User</label>
                        <p className="text-lg font-semibold text-emerald-600">{selected.user.points}</p>
                      </div>
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
                           selected.status === 'accepted' ? 'Diterima' : 'Ditolak'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-500">Alamat Pickup</label>
                      <p className="text-lg text-gray-900">{selected.address}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-500">No. Telepon</label>
                      <p className="text-lg text-gray-900">{selected.phone_number}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-500">Tanggal Pengajuan</label>
                      <p className="text-lg text-gray-900">{formatDate(selected.created_at)}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-500">Waktu Pickup</label>
                      <p className="text-lg text-gray-900">{formatDate(selected.pickup_time)}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-500">Koordinat Lokasi</label>
                      <p className="text-lg text-gray-900">
                        {selected.pickup_location.coordinates[1]}, {selected.pickup_location.coordinates[0]}
                      </p>
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
                        Terima Permintaan
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
                        Tolak Permintaan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <AdminFooter />
    </>
  );
};

export default AdminPage;