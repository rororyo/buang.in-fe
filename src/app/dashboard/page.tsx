"use client";

import React, { useEffect, useState } from 'react';
import { FaFileAlt, FaWineGlassAlt, FaTrashAlt } from 'react-icons/fa';
import { FaBottleWater } from "react-icons/fa6";
import Footer from '@/components/footer';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import api from '@/lib/api'; 

interface UserInformation {
  nama: string;
  alamat: string;
  phone: string;
  saldo: number;
  img_url: string;
}

const DashboardPage = () => {
  const router = useRouter();
  const { user, loading } = useUser();

  // State untuk menyimpan informasi user (dengan fallback default jika belum tersedia)
  const [userInformation, setUserInformation] = useState<UserInformation | null>(null);

  // Update state userInformation ketika user sudah tersedia
  useEffect(() => {
    if (user) {
      setUserInformation({
        nama: user.username || '',
        alamat: user.address || '',
        phone: user.phone_number || '',
        saldo: user.points ?? 0,
        img_url: user.avatar_url || '',
      });
    }
  }, [user]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-2 grid-rows-2 w-full max-w-4xl bg-white p-6 rounded-2xl shadow-lg mb-6">
        {/* Left side skeleton */}
        <div className="row-start-1 col-start-1">
          <div className="h-6 bg-gray-200 rounded-md w-32 mb-2"></div>
        </div>
        
        <div className="row-start-2 col-start-1">
          <div className="h-4 bg-gray-200 rounded-md w-24 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded-md w-40"></div>
        </div>

        {/* Right side skeleton */}
        <div className="row-span-2 col-start-2 flex justify-end items-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  // Form untuk penukaran poin
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    points: '',
    transferMethod: '',
    bankName: '',
    accountNumber: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();

  try {
    const response = await api.post(
      '/api/point-exchange',
      new URLSearchParams({
        total_points: formData.points,
        transfer_method: formData.transferMethod,
        account_number: formData.accountNumber,
        status: 'pending',
        ...(formData.transferMethod === 'Bank Transfer' && formData.bankName
          ? { bank_name: formData.bankName }
          : {}),
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    toast.success('Permintaan tukar poin berhasil dikirim!');
    setShowForm(false);
    setFormData({
      points: '',
      transferMethod: '',
      bankName: '',
      accountNumber: ''
    });
  } catch (error: any) {
    toast.error('Gagal menukar poin. Pastikan data yang dimasukkan sudah benar.');
  }
};

  // Gunakan nilai saldo dari userInformation dengan fallback 0 bila belum ada
  const saldo = userInformation?.saldo ?? 0;

  // Validasi form
  const isFormValid = () => {
    const { points, transferMethod, bankName, accountNumber } = formData;
    
    if (Number(points) > saldo) {
      return false;
    }
    if (!points || !transferMethod || !accountNumber) {
      return false;
    }
    if (transferMethod === 'Bank Transfer' && !bankName) {
      return false;
    }
    return true;
  };

  // Membatalkan penukaran poin
  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      points: '',
      transferMethod: '',
      bankName: '',
      accountNumber: ''
    });
  };

  return (
    <>
      {/* Header */}
      <div className="fixed w-full top-0 z-50 bg-white shadow-lg border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          </div>
          {/* Notifikasi & Menu dapat ditambahkan di sini */}
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 pt-20">
        <div className="flex flex-col items-center p-4 pb-20">
          {/* User Profile Section */}
          {loading || !userInformation ? (
            <LoadingSkeleton />
          ) : (
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Profile Picture */}
                <div className="flex justify-center md:justify-start">
                  <div className="relative">
                    <img
                      src={userInformation.img_url || 'https://via.placeholder.com/150'}
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-4 border-emerald-100 shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Halo, {userInformation.nama}! 👋
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Selamat datang di dashboard Buang.in
                  </p>
                </div>

                {/* Balance Card */}
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium">Saldo Anda</p>
                      <p className="text-2xl font-bold">
                        Rp {saldo.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="w-full max-w-4xl mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                onClick={() => router.push('/penukaran')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Buat Pesanan</p>
                    <p className="text-sm text-gray-500">Jemput sampah Anda</p>
                  </div>
                </div>
              </button>

              <button
                className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                onClick={() => router.push('/riwayat')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Riwayat</p>
                    <p className="text-sm text-gray-500">Lihat transaksi</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setShowForm(true)}
                className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Tukar Poin</p>
                    <p className="text-sm text-gray-500">Jadi uang tunai</p>
                  </div>
                </div>
              </button>

              {/* Modal Overlay untuk Tukar Poin */}
              {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Tukar Poin</h2>
                        <p className="text-sm text-gray-500">Poin tersedia: {saldo.toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={handleCancel}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Form */}
                    <div className="space-y-4">
                      {/* Points Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Poin</label>
                        <input
                          type="number"
                          name="points"
                          value={formData.points}
                          onChange={handleInputChange}
                          placeholder="Masukkan jumlah poin"
                          min="1"
                          max={saldo}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00bd7d] focus:border-transparent outline-none transition-colors ${
                            formData.points && (Number(formData.points) > saldo || Number(formData.points) <= 0)
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-300'
                          }`}
                          required
                        />
                        {formData.points && Number(formData.points) > saldo && (
                          <p className="text-red-500 text-xs mt-1">Jumlah poin melebihi poin yang tersedia</p>
                        )}
                        {formData.points && Number(formData.points) <= 0 && (
                          <p className="text-red-500 text-xs mt-1">Jumlah poin harus lebih dari 0</p>
                        )}
                      </div>
                      
                      {/* Transfer Method */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Metode Transfer</label>
                        <select
                          name="transferMethod"
                          value={formData.transferMethod}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00bd7d] focus:border-transparent outline-none transition-colors"
                          required
                        >
                          <option value="">Pilih metode transfer</option>
                          <option value="DANA">DANA</option>
                          <option value="OVO">OVO</option>
                          <option value="GoPay">GoPay</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                      </div>
                      
                      {/* Bank Selection (jika Bank Transfer) */}
                      {formData.transferMethod === 'Bank Transfer' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Bank</label>
                          <select
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00bd7d] focus:border-transparent outline-none transition-colors"
                            required
                          >
                            <option value="">Pilih bank</option>
                            <option value="BCA">BCA</option>
                            <option value="BRI">BRI</option>
                            <option value="Mandiri">Mandiri</option>
                            <option value="Other">Lainnya</option>
                          </select>
                        </div>
                      )}

                      {/* Account Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {formData.transferMethod === 'Bank Transfer' ? 'Nomor Rekening' : 'Nomor Akun'}
                        </label>
                        <input
                          type="text"
                          name="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleInputChange}
                          placeholder={
                            formData.transferMethod === 'Bank Transfer'
                              ? "Masukkan nomor rekening"
                              : `Masukkan nomor ${formData.transferMethod || 'akun'}`
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00bd7d] focus:border-transparent outline-none transition-colors"
                          required
                        />
                      </div>

                      {/* Tombol Aksi */}
                      <div className="flex space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={!isFormValid()}
                          className={`flex-1 px-4 py-3 rounded-lg transition-colors font-medium ${
                            isFormValid()
                              ? 'bg-[#00bd7d] text-white hover:bg-[#35dba2] cursor-pointer'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Tukar Poin
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Waste Categories Section */}
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Kriteria Sampah</h3>
                <p className="text-gray-600 text-sm">Jenis sampah yang dapat didaur ulang</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>

            {/* Waste Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Paper */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 hover:shadow-md transition-all duration-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                    <FaFileAlt size={24} className="text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Kertas</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Kotak kardus, koran, majalah, kertas bekas, dan sejenisnya
                  </p>
                  <div className="mt-3 px-3 py-1 bg-blue-500 text-white text-xs rounded-full">
                    Daur Ulang ♻️
                  </div>
                </div>
              </div>

              {/* Plastic */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200 hover:shadow-md transition-all duration-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                    <FaBottleWater size={24} className="text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Plastik</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Kemasan, botol PET, toples, sedotan, tutup botol, dan sejenisnya
                  </p>
                  <div className="mt-3 px-3 py-1 bg-green-500 text-white text-xs rounded-full">
                    Daur Ulang ♻️
                  </div>
                </div>
              </div>

              {/* Glass */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border border-red-200 hover:shadow-md transition-all duration-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                    <FaWineGlassAlt size={24} className="text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Kaca</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Botol kaca, gelas kaca, dan barang berbahan kaca lainnya
                  </p>
                  <div className="mt-3 px-3 py-1 bg-red-500 text-white text-xs rounded-full">
                    Daur Ulang ♻️
                  </div>
                </div>
              </div>

              {/* Metal */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 border border-yellow-200 hover:shadow-md transition-all duration-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                    <FaTrashAlt size={24} className="text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Logam</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Kaleng makanan, alat logam, dan barang logam lainnya
                  </p>
                  <div className="mt-3 px-3 py-1 bg-yellow-500 text-white text-xs rounded-full">
                    Daur Ulang ♻️
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-900 mb-1">Tips Memilah Sampah</h4>
                  <p className="text-sm text-emerald-800">
                    Pastikan sampah dalam keadaan bersih dan kering sebelum disetor ke bank sampah. Pisahkan sampah sesuai jenisnya untuk memudahkan proses daur ulang.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default DashboardPage;
