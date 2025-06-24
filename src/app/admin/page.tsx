'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import AdminFooter from '@/components/admin-footer';

export default function AdminLanding() {
  const router = useRouter();

  const handlePickupRequests = () => {
    router.push('/admin/request_sampah');
  };

  const handleRedeemPointsRequest = () => {
    router.push('/admin/request_penukaran');
  };

  return (
    <>
      {/* Header */}
      <div className="fixed w-full top-0 z-50 bg-white shadow-lg border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 pt-20">
        <div className="flex flex-col items-center p-4 pb-20">
          
          {/* Welcome Section */}
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Selamat Datang, Admin! 👋
              </h2>
              <p className="text-gray-600">
                Kelola permintaan pickup sampah dan penukaran poin dengan mudah
              </p>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="w-full max-w-4xl mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Pickup Requests Button */}
              <button 
                onClick={handlePickupRequests}
                className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Penjemputan Sampah</h3>
                    <p className="text-gray-600">
                      Kelola dan proses permintaan penjemputan sampah dari pelanggan
                    </p>
                  </div>
                </div>
              </button>

              {/* Redeem Points Request Button */}
              <button 
                onClick={handleRedeemPointsRequest}
                className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Penukaran Poin</h3>
                    <p className="text-gray-600">
                      Proses permintaan penukaran poin menjadi uang tunai dari pelanggan
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Tips Section */}
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Tips Admin</h3>
                <p className="text-gray-600 text-sm">Panduan untuk mengelola sistem dengan efisien</p>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <p className="text-sm text-emerald-800">
                💡 <strong>Tip:</strong> Prioritaskan permintaan pickup yang sudah menunggu lebih dari 24 jam. 
                Untuk penukaran poin, pastikan validasi data akun pelanggan sebelum melakukan transfer.
              </p>
            </div>
          </div>
        </div>
      </div>
      <AdminFooter />
    </>
  );
}