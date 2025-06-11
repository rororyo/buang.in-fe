import React, { useState, useEffect } from "react";
import { X, MapPin, User, Check } from "lucide-react";
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
      setError(err instanceof Error ? err.message : "An error occurred");
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-50 max-h-96 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Pilih Bank Sampah
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-80">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Memuat...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchNearbyTrashBanks}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {!loading && !error && trashBanks.length === 0 && (
            <div className="text-center py-8">
              <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Tidak ada bank sampah terdekat ditemukan</p>
            </div>
          )}

          {!loading && !error && trashBanks.length > 0 && (
            <div className="space-y-3">
              {trashBanks.map((bank) => {
                const isSelected = selectedTrashBankId === bank.id;
                return (
                  <button
                    key={bank.id}
                    onClick={() => onSelectTrashBank(bank)}
                    className={`w-full p-4 border rounded-lg transition-all text-left ${
                      isSelected
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isSelected ? "bg-green-600" : "bg-green-100"
                        }`}>
                          {isSelected ? (
                            <Check size={20} className="text-white" />
                          ) : (
                            <User size={20} className="text-green-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium truncate ${
                          isSelected ? "text-green-900" : "text-gray-900"
                        }`}>
                          {bank.username}
                        </h4>
                        <p className={`text-sm mt-1 ${
                          isSelected ? "text-green-700" : "text-gray-600"
                        }`}>
                          {bank.address || "Alamat tidak tersedia"}
                        </p>
                        <div className="flex items-center mt-2">
                          <MapPin size={16} className={isSelected ? "text-green-500" : "text-gray-400"} />
                          <span className={`text-sm ml-1 ${
                            isSelected ? "text-green-600" : "text-gray-500"
                          }`}>
                            {(bank.distance / 1000).toFixed(1)} km
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                            <Check size={16} className="text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NearbyTrashBanksDrawer;