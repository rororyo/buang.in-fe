import React from "react";
import TombolFoto from "@/components/penukaran-page/tombol-foto";
import DropdownJenisSampah from "@/components/penukaran-page/drop-down-jenis-sampah";
import { X } from "lucide-react";
import NearbyTrashBanksDrawer from "../nearby-trash-bank-drawer";
import { useUser } from "@/lib/context/UserContext";

interface FormInputProps {
  lat: number | null;
  lon: number | null;
  formData: {
    nama: string;
    alamat: string;
    phone: string;
    pickupTime: string;
    selectedTrashes: any[];
    berat: number;
    selectedImage: any;
    selectedImagePreview: string;
    selectedTrashBank: any;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    nama: string;
    alamat: string;
    phone: string;
    pickupTime: string;
    selectedTrashes: any[];
    berat: number;
    selectedImage: any;
    selectedImagePreview: string;
    selectedTrashBank: any;
  }>>;
}

const FormInput: React.FC<FormInputProps> = ({
  lat,
  lon,
  formData,
  setFormData,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <>
      {/* Nama */}
      <div className="mb-4 pt-20">
        <label htmlFor="nama" className="block text-sm font-medium text-black">
          Nama
        </label>
        <input
          type="text"
          id="nama"
          value={formData.nama}
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          placeholder="Masukkan nama Anda"
          style={{ backgroundColor: "#ffffff" }}
        />
      </div>

      {/* Alamat */}
      <div className="mb-2">
        <label
          htmlFor="alamat"
          className="block text-sm font-medium text-black"
        >
          Alamat
        </label>
        <input
          type="text"
          id="alamat"
          value={formData.alamat}
          onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          placeholder="Masukkan alamat Anda"
          style={{ backgroundColor: "#ffffff" }}
        />
      </div>
      {/* Phone Number */}
      <div className="mb-2">
        <label htmlFor="phone" className="block text-sm font-medium text-black">
          Nomor Telepon
        </label>
      <input
        type="text"
        id="phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        placeholder="Nomor Telepon"
        style={{ backgroundColor: "#ffffff" }}
      />
      </div>

      
      {/* Pickup Time */}
      <div className="mb-4">
      <label htmlFor="pickupTime" className="block text-sm font-medium text-black">
        Waktu Setor
      </label>
        <input
        type="datetime-local"
        id="pickupTime"
        placeholder="Waktu Setor"
        value={formData.pickupTime}
        onChange={(e) =>
          setFormData({ ...formData, pickupTime: e.target.value })
        }
        style={{ backgroundColor: "#ffffff" }}
        className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
      />
      </div>
      


      
      {/* Jenis Sampah */}
      <div className="mb-4">
        <DropdownJenisSampah
        selectedTrashes={formData.selectedTrashes}
        setSelectedTrashes={(value) =>
          setFormData({ ...formData, selectedTrashes: value })
        }
      />
      </div>
      
      {/* Tombol Foto */}
<TombolFoto
  onImageSelected={(file, previewUrl) => {
    setFormData((prev) => ({
      ...prev,
      selectedImage: file, // ✅ Send File object
      selectedImagePreview: previewUrl,
    }));
  }}
/>

      {/* Selected Image Display */}
      {formData.selectedImagePreview && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-2">
            Foto Sampah
          </label>
          <img
            src={formData.selectedImagePreview}
            alt="Foto Sampah"
            className="w-full h-auto rounded-md border border-gray-300"
          />
        </div>
      )}

      {/* Selected Trash Bank Display */}
      {formData.selectedTrashBank && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-2">
            Bank Sampah Terpilih
          </label>
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-green-800">
                  {formData.selectedTrashBank.username}
                </p>
                <p className="text-sm text-green-600">
                  {formData.selectedTrashBank.address || "Alamat tidak tersedia"}
                </p>
                <p className="text-sm text-green-600">
                  {(formData.selectedTrashBank.distance / 1000).toFixed(1)} km
                </p>
              </div>
              <button
                onClick={() => setFormData({ ...formData, selectedTrashBank: null })}
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
          className="w-full p-2 text-black rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          disabled={!lat || !lon}
          style={{ backgroundColor: "#276561" }}
        >
          {!lat || !lon
            ? "Memuat lokasi..."
            : formData.selectedTrashBank
            ? "Ganti Bank Sampah"
            : "Pilih Bank Sampah Terdekat"}
        </button>
      </div>

      {/* Nearby Trash Banks Drawer */}
      <NearbyTrashBanksDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        lat={lat}
        lon={lon}
        onSelectTrashBank={(trashBank) => {
          setFormData({ ...formData, selectedTrashBank: trashBank });
          setIsDrawerOpen(false);
        }}
        selectedTrashBankId={formData.selectedTrashBank?.id}
      />
    </>
  );
};

export default FormInput;
