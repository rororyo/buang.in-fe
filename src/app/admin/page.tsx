'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Package, Gift } from 'lucide-react';

export default function AdminLanding() {
  const router = useRouter();

  const handlePickupRequests = () => {
    router.push('/admin/request_sampah');
  };

  const handleRedeemPointsRequest = () => {
    router.push('/admin/request_penukaran');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Panel
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent ml-4">
                Admin
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Kelola permintaan pickup dan penukaran poin
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Pickup Requests Button */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <button
                onClick={handlePickupRequests}
                className="relative w-full h-64 bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 hover:border-green-500/50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-green-500/25"
              >
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-full">
                      <Package className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all duration-300">
                      Permintaan Pickup
                    </h2>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      Kelola dan proses permintaan pickup sampah dari pengguna
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Redeem Points Request Button */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-600 to-green-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <button
                onClick={handleRedeemPointsRequest}
                className="relative w-full h-64 bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 hover:border-teal-500/50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-teal-500/25"
              >
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-teal-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-br from-teal-500 to-green-500 p-4 rounded-full">
                      <Gift className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-teal-400 group-hover:to-green-400 group-hover:bg-clip-text transition-all duration-300">
                      Permintaan Tukar Poin
                    </h2>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      Proses permintaan penukaran poin dan hadiah
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/30 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Permintaan Menunggu</p>
                  <p className="text-2xl font-bold text-white">24</p>
                </div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="bg-gray-900/30 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Selesai Hari Ini</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="bg-gray-900/30 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Poin Ditukar</p>
                  <p className="text-2xl font-bold text-white">1,248</p>
                </div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2025 Panel Admin. Hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}