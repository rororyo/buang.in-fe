import React, { memo, useCallback } from "react";
import TombolFoto from "@/components/penukaran-page/tombol-foto";
import DropdownJenisSampah from "@/components/penukaran-page/drop-down-jenis-sampah";
import { X, User, MapPin, Phone, Clock, Weight, Ruler, Camera, Building2 } from "lucide-react";
import NearbyTrashBanksDrawer from "../nearby-trash-bank-drawer";
import { FormDataType } from "@/app/penukaran/page";
import DropdownKecamatan from "../drop-down-kecamatan";



interface FormInputProps {
  lat: number | null;
  lon: number | null;
  formData: FormDataType;
  updateFormData: (updates: Partial<FormDataType>) => void;
}

// Memoized InputField component to prevent unnecessary re-renders
const InputField = memo(({ 
  label, 
  icon: Icon, 
  children, 
  required = false 
}: { 
  label: string; 
  icon: any; 
  children: React.ReactNode; 
  required?: boolean;
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
      <Icon size={16} className="text-emerald-600" />
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
));

// Memoized PersonalInfoCard component
const PersonalInfoCard = memo(({ 
  formData, 
  updateFormData 
}: { 
  formData: FormDataType; 
  updateFormData: (updates: Partial<FormDataType>) => void; 
}) => {
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ nama: e.target.value });
  }, [updateFormData]);

  const handleAddressChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ alamat: e.target.value });
  }, [updateFormData]);

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ phone: e.target.value });
  }, [updateFormData]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <User size={20} className="text-emerald-600" />
        Informasi Pribadi
      </h3>
      
      <div className="space-y-4">
        <InputField label="Nama Lengkap" icon={User} required>
          <input
            type="text"
            value={formData.nama}
            onChange={handleNameChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="Masukkan nama lengkap Anda"
          />
        </InputField>
        <DropdownKecamatan
        selectedKecamatanId={formData.subDistrictId}
        setSelectedKecamatanId={(id) => updateFormData({ subDistrictId: id })}/>

        <InputField label="Alamat Lengkap" icon={MapPin} required>
          <textarea
            value={formData.alamat}
            onChange={handleAddressChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
            placeholder="Masukkan alamat lengkap Anda"
            rows={3}
          />
        </InputField>

        <InputField label="Nomor Telepon" icon={Phone} required>
          <input
            type="tel"
            value={formData.phone}
            onChange={handlePhoneChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="08xxxxxxxxxx"
          />
        </InputField>
      </div>
    </div>
  );
});

// Memoized PickupScheduleCard component
const PickupScheduleCard = memo(({ 
  formData, 
  updateFormData 
}: { 
  formData: FormDataType; 
  updateFormData: (updates: Partial<FormDataType>) => void; 
}) => {
  const handleStartTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ pickupStartTime: e.target.value });
  }, [updateFormData]);

  const handleEndTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ pickupEndTime: e.target.value });
  }, [updateFormData]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Clock size={20} className="text-emerald-600" />
        Jadwal Penjemputan
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        <InputField label="Waktu Mulai" icon={Clock} required>
          <input
            type="datetime-local"
            value={formData.pickupStartTime}
            onChange={handleStartTimeChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
        </InputField>
        
        <InputField label="Waktu Selesai" icon={Clock} required>
          <input
            type="datetime-local"
            value={formData.pickupEndTime}
            onChange={handleEndTimeChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
        </InputField>
      </div>
      
      <div className="mt-3 p-3 bg-emerald-50 rounded-lg">
        <p className="text-xs text-emerald-700">
          📍 Pastikan Anda berada di lokasi saat waktu penjemputan yang ditentukan
        </p>
      </div>
    </div>
  );
});

// Memoized WasteDetailsCard component
const WasteDetailsCard = memo(({ 
  formData, 
  updateFormData 
}: { 
  formData: FormDataType; 
  updateFormData: (updates: Partial<FormDataType>) => void; 
}) => {
  const handleWeightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ weight: parseFloat(e.target.value) || 0 });
  }, [updateFormData]);

  const handleLengthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ length: parseFloat(e.target.value) || 0 });
  }, [updateFormData]);

  const handleWidthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ width: parseFloat(e.target.value) || 0 });
  }, [updateFormData]);

  const handleHeightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ height: parseFloat(e.target.value) || 0 });
  }, [updateFormData]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Weight size={20} className="text-emerald-600" />
        Detail Sampah
      </h3>
      
      <div className="space-y-4">
        <InputField label="Berat Sampah" icon={Weight} required>
          <div className="relative">
            <input
              type="number"
              value={formData.weight}
              onChange={handleWeightChange}
              className="w-full px-4 py-3 pr-16 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="0"
              min="0"
              step="0.1"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
              gram
            </span>
          </div>
        </InputField>

        <div className="grid grid-cols-3 gap-3">
          <InputField label="Panjang" icon={Ruler}>
            <div className="relative">
              <input
                type="number"
                value={formData.length}
                onChange={handleLengthChange}
                className="w-full px-3 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm"
                placeholder="0"
                min="0"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">cm</span>
            </div>
          </InputField>
          
          <InputField label="Lebar" icon={Ruler}>
            <div className="relative">
              <input
                type="number"
                value={formData.width}
                onChange={handleWidthChange}
                className="w-full px-3 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm"
                placeholder="0"
                min="0"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">cm</span>
            </div>
          </InputField>
          
          <InputField label="Tinggi" icon={Ruler}>
            <div className="relative">
              <input
                type="number"
                value={formData.height}
                onChange={handleHeightChange}
                className="w-full px-3 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm"
                placeholder="0"
                min="0"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">cm</span>
            </div>
          </InputField>
        </div>
      </div>
    </div>
  );
});

// Main FormInput component
const FormInput: React.FC<FormInputProps> = memo(({
  lat,
  lon,
  formData,
  updateFormData,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Memoized handlers
  const handleSelectedTrashesChange = useCallback((value: any[]) => {
    updateFormData({ selectedTrashes: value });
  }, [updateFormData]);

  const handleImageSelected = useCallback((file: File, previewUrl: string) => {
    updateFormData({
      selectedImage: file,
      selectedImagePreview: previewUrl,
    });
  }, [updateFormData]);

  const handleRemoveImage = useCallback(() => {
    updateFormData({
      selectedImage: null,
      selectedImagePreview: null
    });
  }, [updateFormData]);

  const handleRemoveTrashBank = useCallback(() => {
    updateFormData({ selectedTrashBank: null });
  }, [updateFormData]);

  const handleSelectTrashBank = useCallback((trashBank: any) => {
    updateFormData({ selectedTrashBank: trashBank });
    setIsDrawerOpen(false);
  }, [updateFormData]);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Personal Information Card */}
      <PersonalInfoCard formData={formData} updateFormData={updateFormData} />

      {/* Pickup Schedule Card */}
      <PickupScheduleCard formData={formData} updateFormData={updateFormData} />

      {/* Waste Details Card */}
      <WasteDetailsCard formData={formData} updateFormData={updateFormData} />

      {/* Waste Type Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-emerald-600">🗂️</span>
          Jenis Sampah
        </h3>
        <DropdownJenisSampah
          selectedTrashes={formData.selectedTrashes}
          setSelectedTrashes={handleSelectedTrashesChange}
        />
      </div>

      {/* Photo Upload Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Camera size={20} className="text-emerald-600" />
          Foto Sampah
        </h3>
        
        <TombolFoto onImageSelected={handleImageSelected} />

        {/* Photo Preview */}
        {formData.selectedImagePreview && (
          <div className="mt-4">
            <div className="relative">
              <img
                src={formData.selectedImagePreview}
                alt="Preview Sampah"
                className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              Foto berhasil dipilih. Tap tombol ❌ untuk mengganti.
            </p>
          </div>
        )}
      </div>

      {/* Selected Trash Bank Card */}
      {formData.selectedTrashBank && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 size={20} className="text-emerald-600" />
            Bank Sampah Terpilih
          </h3>
          
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Building2 size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-900">
                      {formData.selectedTrashBank.username}
                    </p>
                    <p className="text-xs text-emerald-600 font-medium">
                      📍 {(formData.selectedTrashBank.distance / 1000).toFixed(1)} km dari Anda
                    </p>
                  </div>
                </div>
                <p className="text-sm text-emerald-700">
                  {formData.selectedTrashBank.address ?? "Alamat tidak tersedia"}
                </p>
              </div>
              <button
                onClick={handleRemoveTrashBank}
                className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trash Bank Selection Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 size={20} className="text-emerald-600" />
          Pilih Bank Sampah
        </h3>
        
        <button
          onClick={openDrawer}
          disabled={!lat || !lon}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
            !lat || !lon
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg"
          }`}
        >
          {!lat || !lon ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Memuat lokasi...
            </>
          ) : (
            <>
              <Building2 size={18} />
              {formData.selectedTrashBank
                ? "Ganti Bank Sampah"
                : "Pilih Bank Sampah Terdekat"}
            </>
          )}
        </button>
        
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            🏪 Kami akan menampilkan bank sampah terdekat dari lokasi Anda
          </p>
        </div>
      </div>

      {/* Drawer */}
      <NearbyTrashBanksDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        lat={lat}
        lon={lon}
        onSelectTrashBank={handleSelectTrashBank}
        selectedTrashBankId={formData.selectedTrashBank?.id}
      />
    </div>
  );
});

FormInput.displayName = 'FormInput';
PersonalInfoCard.displayName = 'PersonalInfoCard';
PickupScheduleCard.displayName = 'PickupScheduleCard';
WasteDetailsCard.displayName = 'WasteDetailsCard';
InputField.displayName = 'InputField';

export default FormInput;