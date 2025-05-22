import React from "react";
import TombolFoto from "@/components/penukaran-page/tombol-foto";
import DropdownJenisSampah from "@/components/penukaran-page/drop-down-jenis-sampah";
import { X } from "lucide-react";
import NearbyTrashBanksDrawer from "../nearby-trash-bank-drawer";

interface FormInputProps {
  lat?: number | null;
  lon?: number | null;
}

const FormInput: React.FC<FormInputProps> = ({ lat, lon }) => {
  const [selectedTrash, setSelectedTrash] = React.useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedTrashBank, setSelectedTrashBank] = React.useState<{
    id: string;
    username: string;
    address: string | null;
    distance: number;
  } | null>(null);

  return (
    <>
      {/* Nama */}
      <div className="mb-4">
        <label htmlFor="nama" className="block text-sm font-medium text-black">
          Nama
        </label>
        <input
          type="text"
          id="nama"
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          placeholder="Masukkan nama Anda"
          style={{ backgroundColor: "#569490" }}
        />
      </div>

      {/* Alamat */}
      <div className="mb-4">
        <label htmlFor="alamat" className="block text-sm font-medium text-black">
          Alamat
        </label>
        <input
          type="text"
          id="alamat"
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          placeholder="Masukkan alamat Anda"
          style={{ backgroundColor: "#569490" }}
        />
      </div>

      {/* Jenis Sampah */}
      <DropdownJenisSampah selectedTrash={selectedTrash} setSelectedTrash={setSelectedTrash} />

      {/* Berat */}
      <div className="mb-4">
        <label htmlFor="berat" className="block text-sm font-medium text-black">
          Berat
        </label>
        <input
          type="number"
          id="berat"
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          placeholder="Masukkan berat sampah (kg)"
          style={{ backgroundColor: "#569490" }}
        />
      </div>

      {/* Tombol Foto */}
      <TombolFoto />

      {/* Selected Trash Bank Display */}
      {selectedTrashBank && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-2">
            Bank Sampah Terpilih
          </label>
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-green-800">{selectedTrashBank.username}</p>
                <p className="text-sm text-green-600">
                  {selectedTrashBank.address || "Alamat tidak tersedia"}
                </p>
                <p className="text-sm text-green-600">
                  {(selectedTrashBank.distance / 1000).toFixed(1)} km
                </p>
              </div>
              <button
                onClick={() => setSelectedTrashBank(null)}
                className="text-green-600 hover:text-green-800 p-1"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Button to open nearby trash banks drawer */}
      <div className="mb-4">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          disabled={!lat || !lon}
        >
          {!lat || !lon ? "Memuat lokasi..." : selectedTrashBank ? "Ganti Bank Sampah" : "Pilih Bank Sampah Terdekat"}
        </button>
      </div>

      {/* Nearby Trash Banks Drawer */}
      <NearbyTrashBanksDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        lat={lat}
        lon={lon}
        onSelectTrashBank={(trashBank) => {
          setSelectedTrashBank(trashBank);
          setIsDrawerOpen(false);
        }}
        selectedTrashBankId={selectedTrashBank?.id}
      />
    </>
  );
};

export default FormInput;