import React, { useState, useEffect } from "react";
import { X, MapPin, User, Check, RefreshCw, AlertCircle, Building2 } from "lucide-react";
import api from "@/lib/api";

interface TrashBank {
  id: string;
  username: string;
  address: string | null;
  distance: number;
}

interface NearbyTrashBanksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lat?: number | null;
  lon?: number | null;
  onSelectTrashBank: (trashBank: TrashBank) => void;
  selectedTrashBankId?: string;
}

const NearbyTrashBanksDrawer: React.FC<NearbyTrashBanksDrawerProps> = ({
  isOpen,
  onClose,
  lat,
  lon,
  onSelectTrashBank,
  selectedTrashBankId,
}) => {
  const [trashBanks, setTrashBanks] = useState<TrashBank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNearbyTrashBanks = async () => {
    if (!lat || !lon) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `/api/setor/nearby-trash-banks?lat=${lat}&lon=${lon}`
      );
      
      if (!response.status || response.status !== 200) {
        throw new Error("Failed to fetch nearby trash banks");
      }

      const data = await response.data
      
      if (data.status === "success") {
        setTrashBanks(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && lat && lon) {
      fetchNearbyTrashBanks();
    }
  }, [isOpen, lat, lon]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[80vh] overflow-hidden border-t-4 border-emerald-500 animate-slide-up">
        {/* Drag indicator */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <Building2 size={20} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Pilih Bank Sampah
              </h3>
              <p className="text-sm text-gray-600">
                Pilih bank sampah terdekat dari lokasi Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <RefreshCw size={24} className="text-emerald-600 animate-spin" />
              </div>
              <p className="text-gray-700 font-medium">Mencari bank sampah terdekat...</p>
              <p className="text-gray-500 text-sm mt-1">Mohon tunggu sebentar</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <p className="text-red-700 font-semibold mb-2">Oops! Terjadi Kesalahan</p>
              <p className="text-red-600 text-sm mb-6">{error}</p>
              <button
                onClick={fetchNearbyTrashBanks}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors duration-200 font-medium"
              >
                <RefreshCw size={16} />
                <span>Coba Lagi</span>
              </button>
            </div>
          )}

          {!loading && !error && trashBanks.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-700 font-semibold mb-2">Tidak Ada Bank Sampah Terdekat</p>
              <p className="text-gray-500 text-sm">
                Maaf, tidak ada bank sampah yang ditemukan di sekitar lokasi Anda saat ini
              </p>
            </div>
          )}

          {!loading && !error && trashBanks.length > 0 && (
            <div className="space-y-4">
              {/* Results counter */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  Ditemukan <span className="font-semibold text-emerald-600">{trashBanks.length}</span> bank sampah
                </p>
                <button
                  onClick={fetchNearbyTrashBanks}
                  className="text-sm text-emerald-600 hover:text-emerald-800 font-medium flex items-center space-x-1"
                >
                  <RefreshCw size={14} />
                  <span>Refresh</span>
                </button>
              </div>

              {trashBanks.map((bank, index) => {
                const isSelected = selectedTrashBankId === bank.id;
                return (
                  <button
                    key={bank.id}
                    onClick={() => onSelectTrashBank(bank)}
                    className={`
                      w-full p-5 border-2 rounded-2xl transition-all duration-200 text-left relative overflow-hidden
                      ${isSelected
                        ? "border-emerald-500 bg-emerald-50 shadow-lg scale-[1.02]"
                        : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-md"
                      }
                    `}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-emerald-500">
                        <Check size={12} className="text-white absolute -top-4 -right-2" />
                      </div>
                    )}

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`
                          w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200
                          ${isSelected 
                            ? "bg-emerald-600 shadow-lg" 
                            : "bg-emerald-100 group-hover:bg-emerald-200"
                          }
                        `}>
                          {isSelected ? (
                            <Check size={24} className="text-white" />
                          ) : (
                            <User size={24} className="text-emerald-600" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className={`
                              text-lg font-bold truncate
                              ${isSelected ? "text-emerald-900" : "text-gray-900"}
                            `}>
                              {bank.username}
                            </h4>
                            <p className={`
                              text-sm mt-1 line-clamp-2
                              ${isSelected ? "text-emerald-700" : "text-gray-600"}
                            `}>
                              {bank.address || "Alamat tidak tersedia"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <div className={`
                              w-8 h-8 rounded-full flex items-center justify-center
                              ${isSelected ? "bg-emerald-600" : "bg-gray-100"}
                            `}>
                              <MapPin size={14} className={isSelected ? "text-white" : "text-gray-500"} />
                            </div>
                            <span className={`
                              text-sm font-semibold
                              ${isSelected ? "text-emerald-700" : "text-gray-700"}
                            `}>
                              {(bank.distance / 1000).toFixed(1)} km
                            </span>
                          </div>
                          
                          {isSelected && (
                            <div className="flex items-center space-x-1 bg-emerald-600 text-white px-3 py-1 rounded-full">
                              <Check size={12} />
                              <span className="text-xs font-medium">Terpilih</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default NearbyTrashBanksDrawer;