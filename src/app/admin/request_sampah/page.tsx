"use client";

import React, { useState, useEffect } from "react";
import { FilterIcon, CheckIcon, XIcon, SearchIcon, EyeIcon, XCircleIcon, RefreshCw, ChevronLeftIcon, ChevronLeft, X, Search, Filter, Eye, Check, XCircle, Upload, Plus, Minus } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import AdminFooter from "@/components/admin-footer";

interface PickupRequest {
  id: string;
  name: string;
  address: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  img_url: string;
  points: number;
  status: 'pending' | 'accepted' | 'rejected';
  phone_number: string;
  pickup_location: {
    type: string;
    coordinates: [number, number];
  };
  pickup_start_time: string;
  pickup_end_time: string;
  created_at: string;
  user_id: string;
  trash_bank_id: string;
  sub_district_id?: string;
  user: {
    id: string;
    username: string;
    address: string;
    phone_number: string;
    email: string;
    role: string;
    points: number;
    created_at: string;
  };
  trashBank: {
    id: string;
    username: string;
    email: string;
    address: string;
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

interface TrashType {
  id: string;
  name: string;
  price_per_kg: number;
}

interface SelectedTrashType {
  trash_type_id: string;
  weight: number;
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
  const [trashTypes, setTrashTypes] = useState<TrashType[]>([]);
  const [selected, setSelected] = useState<PickupRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSubDistricts, setLoadingSubDistricts] = useState(false);
  const [loadingTrashTypes, setLoadingTrashTypes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Confirmation form states
  const [showConfirmForm, setShowConfirmForm] = useState(false);
  const [confirmingRequest, setConfirmingRequest] = useState<PickupRequest | null>(null);
  const [confirmImage, setConfirmImage] = useState<File | null>(null);
  const [selectedTrashTypes, setSelectedTrashTypes] = useState<SelectedTrashType[]>([]);
  const [submittingConfirm, setSubmittingConfirm] = useState(false);

  // Fetch trash types
  const fetchTrashTypes = async () => {
    setLoadingTrashTypes(true);
    try {
      const response = await api.get('/api/setor/trash-types');
      if (response.status === 200) {
        setTrashTypes(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching trash types:', err);
    } finally {
      setLoadingTrashTypes(false);
    }
  };

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

  // Handle reject request
  const handleTolak = async (id: string) => {
    setProcessingId(id);
    
    try {
      const response = await api.post(`/api/bank-sampah/setor-request/${id}?status=rejected`);
      
      if (response.data.status === 'success') {
        setData(prev => 
          prev.map(item => 
            item.id === id ? { ...item, status: 'rejected' } : item
          )
        );
        
        toast.success('Request rejected successfully');
        
        if (selected?.id === id) {
          setSelected({ ...selected, status: 'rejected' });
        }
      }
    } catch (err: any) {
      console.error('Error rejecting request:', err);
      setError(err.response?.data?.message || 'Failed to reject request');
    } finally {
      setProcessingId(null);
    }
  };

  // Handle accept (show confirmation form)
  const handleTerima = (request: PickupRequest) => {
    setConfirmingRequest(request);
    setShowConfirmForm(true);
    setSelectedTrashTypes([]);
    setConfirmImage(null);
  };

  // Handle adding trash type to selection
  const addTrashType = () => {
    if (trashTypes.length > 0) {
      const firstType = trashTypes[0];
      setSelectedTrashTypes(prev => [...prev, {
        trash_type_id: firstType.id,
        weight: 0,
        name: firstType.name
      }]);
    }
  };

  // Handle removing trash type from selection
  const removeTrashType = (index: number) => {
    setSelectedTrashTypes(prev => prev.filter((_, i) => i !== index));
  };

  // Handle updating trash type selection
  const updateTrashType = (index: number, field: 'trash_type_id' | 'weight', value: string | number) => {
    setSelectedTrashTypes(prev => prev.map((item, i) => {
      if (i === index) {
        if (field === 'trash_type_id') {
          const trashType = trashTypes.find(t => t.id === value);
          return {
            ...item,
            trash_type_id: value as string,
            name: trashType?.name || ''
          };
        } else {
          return {
            ...item,
            [field]: Number(value)
          };
        }
      }
      return item;
    }));
  };

  // Handle form submission
  const handleConfirmSubmit = async () => {
    if (!confirmingRequest || !confirmImage || selectedTrashTypes.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate weights
    const hasInvalidWeight = selectedTrashTypes.some(item => item.weight <= 0);
    if (hasInvalidWeight) {
      toast.error('All weights must be greater than 0');
      return;
    }

    setSubmittingConfirm(true);
    
    try {
      const formData = new FormData();
      formData.append('image', confirmImage);
      formData.append('pickup_request_id', confirmingRequest.id);
      formData.append('trash_type_ids', JSON.stringify(selectedTrashTypes.map(item => item.trash_type_id)));
      formData.append('weights', JSON.stringify(selectedTrashTypes.map(item => item.weight)));

      const response = await api.post('/api/bank-sampah/setor-request/complete', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'success') {
        // Update local state
        setData(prev => 
          prev.map(item => 
            item.id === confirmingRequest.id ? { ...item, status: 'accepted' } : item
          )
        );
        
        toast.success('Pickup request completed successfully');
        setShowConfirmForm(false);
        setConfirmingRequest(null);
        setConfirmImage(null);
        setSelectedTrashTypes([]);
        
        if (selected?.id === confirmingRequest.id) {
          setSelected({ ...selected, status: 'accepted' });
        }
      }
    } catch (err: any) {
      console.error('Error completing request:', err);
      toast.error(err.response?.data?.message || 'Failed to complete request');
    } finally {
      setSubmittingConfirm(false);
    }
  };

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
    fetchTrashTypes();
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
                                    onClick={() => handleTerima(item)}
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

      {/* Confirmation Form Modal */}
      {showConfirmForm && confirmingRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Konfirmasi Penerimaan Sampah</h3>
                <button
                  onClick={() => setShowConfirmForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Detail Permintaan</h4>
                <p className="text-sm text-gray-600">User: {confirmingRequest.user.username}</p>
                <p className="text-sm text-gray-600">Alamat: {confirmingRequest.address}</p>
                <p className="text-sm text-gray-600">Tanggal: {formatDate(confirmingRequest.created_at)}</p>
              </div>

              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Foto Bukti Penerimaan Sampah <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setConfirmImage(e.target.files?.[0] || null)}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {confirmImage ? confirmImage.name : 'Klik untuk upload foto'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                    </label>
                  </div>
                </div>

                {/* Trash Types Selection */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-900">
                      Jenis Sampah <span className="text-red-500">*</span>
                    </label>
                    <button
                      onClick={addTrashType}
                      disabled={loadingTrashTypes}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-colors disabled:opacity-50"
                    >
                      <Plus size={16} />
                      Tambah Jenis
                    </button>
                  </div>

                  {selectedTrashTypes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>Belum ada jenis sampah yang dipilih</p>
                      <p className="text-sm">Klik "Tambah Jenis" untuk menambahkan</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedTrashTypes.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <select
                            value={item.trash_type_id}
                            onChange={(e) => updateTrashType(index, 'trash_type_id', e.target.value)}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          >
                            {trashTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name} (Rp {type.price_per_kg}/kg)
                              </option>
                            ))}
                          </select>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="Berat (kg)"
                              value={item.weight || ''}
                              onChange={(e) => updateTrashType(index, 'weight', parseFloat(e.target.value) || 0)}
                              className="w-24 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              min="0"
                              step="0.1"
                            />
                            <span className="text-sm text-gray-600">kg</span>
                          </div>
                          <button
                            onClick={() => removeTrashType(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Minus size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Summary */}
                {selectedTrashTypes.length > 0 && (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <h5 className="font-semibold text-emerald-900 mb-2">Ringkasan</h5>
                    <div className="space-y-1 text-sm">
                      <p className="text-emerald-800">
                        Total Jenis: {selectedTrashTypes.length}
                      </p>
                      <p className="text-emerald-800">
                        Total Berat: {selectedTrashTypes.reduce((sum, item) => sum + (item.weight || 0), 0).toFixed(1)} kg
                      </p>
                      <p className="text-emerald-800">
                        Estimasi Poin: {selectedTrashTypes.reduce((sum, item) => {
                          const trashType = trashTypes.find(t => t.id === item.trash_type_id);
                          return sum + ((item.weight || 0) * (trashType?.price_per_kg || 0));
                        }, 0).toFixed(0)} poin
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowConfirmForm(false)}
                    disabled={submittingConfirm}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmSubmit}
                    disabled={submittingConfirm || !confirmImage || selectedTrashTypes.length === 0}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submittingConfirm ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        Konfirmasi Penerimaan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Detail Permintaan</h3>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Info */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3">Informasi User</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Nama:</span>
                      <p className="font-medium">{selected.user.username}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-medium">{selected.user.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Telepon:</span>
                      <p className="font-medium">{selected.phone_number}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Poin User:</span>
                      <p className="font-medium">{selected.user.points}</p>
                    </div>
                  </div>
                </div>

                {/* Pickup Info */}
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3">Informasi Pickup</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Alamat:</span>
                      <p className="font-medium">{selected.address}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Kecamatan:</span>
                      <p className="font-medium">
                        {selected.sub_district_id ? getSubDistrictName(selected.sub_district_id) : 'N/A'}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Mulai:</span>
                        <p className="font-medium">{new Date(selected.pickup_start_time).toLocaleString('id-ID')}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Selesai:</span>
                        <p className="font-medium">{new Date(selected.pickup_end_time).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trash Info */}
                <div className="p-4 bg-emerald-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3">Informasi Sampah</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Berat:</span>
                      <p className="font-medium">{selected.weight} kg</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Poin:</span>
                      <p className="font-medium">{selected.points}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Panjang:</span>
                      <p className="font-medium">{selected.length} cm</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Lebar:</span>
                      <p className="font-medium">{selected.width} cm</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tinggi:</span>
                      <p className="font-medium">{selected.height} cm</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                        selected.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selected.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selected.status === 'pending' ? 'Menunggu' :
                         selected.status === 'accepted' ? 'Diterima' : 'Ditolak'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Image */}
                {selected.img_url && (
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
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelected(null)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
                  >
                    Tutup
                  </button>
                  {selected.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          setSelected(null);
                          handleTerima(selected);
                        }}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Check size={18} />
                        Terima
                      </button>
                      <button
                        onClick={() => {
                          setSelected(null);
                          handleTolak(selected.id);
                        }}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <X size={18} />
                        Tolak
                      </button>
                    </>
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