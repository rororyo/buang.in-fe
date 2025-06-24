"use client";

import React, { useState, useCallback, useEffect } from "react";
import Footer from "@/components/footer";
import { ChevronLeftIcon, AlertCircle } from "lucide-react";
import FormInput from "@/components/penukaran-page/form-input-sampah";
import LokasiSetorSampah from "@/components/penukaran-page/lokasi-setor-sampah";
import TombolSetor from "@/components/penukaran-page/tombol-setor";
import { useUser } from "@/lib/context/UserContext";
import useGeolocation from "@/lib/hooks/useGeolocation";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-toastify";

export type FormDataType = {
  nama: string;
  alamat: string;
  phone: string;
  pickupStartTime: string;
  pickupEndTime: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  selectedTrashes: any[];
  selectedImage: File | null;
  selectedImagePreview: string | null;
  selectedTrashBank: any;
  subDistrictId: string;
};

const PenukaranPage = () => {
  const router = useRouter();
  const { lat, lon, error } = useGeolocation();
  const { user } = useUser();

  const [formData, setFormData] = useState<FormDataType>({
    nama: user?.username || "",
    alamat: user?.address || "",
    phone: user?.phone_number || "",
    pickupStartTime: "",
    pickupEndTime: "",
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    selectedTrashes: [],
    selectedImage: null,
    selectedImagePreview: null,
    selectedTrashBank: null,
    subDistrictId: "",
  });

  useEffect(()=>{
    if(user){
      setFormData({
        ...formData,
        nama: user.username,
        alamat: user.address || "",
        phone: user.phone_number || "",
      })
    }
  },[user])

  // Memoized update functions to prevent unnecessary re-renders
  const updateFormData = useCallback((updates: Partial<FormDataType>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleSubmit = async () => {
    try {
      const form = new FormData();
      form.append("name", formData.nama);
      form.append("address", formData.alamat);
      form.append("phone_number", formData.phone);
      form.append("weight", formData.weight.toString());
      form.append("length", formData.length.toString());
      form.append("width", formData.width.toString());
      form.append("height", formData.height.toString());
      form.append("pickup_start_time", new Date(formData.pickupStartTime).toISOString());
      form.append("pickup_end_time", new Date(formData.pickupEndTime).toISOString());
      form.append("status", "pending");

      form.append("latitude", lat?.toString() ?? "");
      form.append("longitude", lon?.toString() ?? "");
      form.append("user_id", user?.id ?? "");
      form.append("trash_bank_id", formData.selectedTrashBank?.id ?? "");
      form.append("sub_district_id", formData.subDistrictId);
      form.append("trash_type_ids", JSON.stringify(formData.selectedTrashes));
      form.append("img_url", "");

      if (formData.selectedImage) {
        form.append("image", formData.selectedImage);
      }

      await api.post("/api/setor", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Data berhasil dikirim!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Gagal mengirim data.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100">
      {/* Location Error Alert */}
      {error && (
        <div className="fixed top-20 left-4 right-4 z-40 animate-in slide-in-from-top duration-300">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-red-800">Lokasi Diperlukan!</h3>
                <p className="text-sm text-red-700 mt-1">
                  {error.includes("denied")
                    ? "Aktifkan lokasi untuk menggunakan fitur ini."
                    : error}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors duration-200"
          >
            <ChevronLeftIcon size={20} />
          </button>
          
          <div className="text-center flex-1">
            <h1 className="text-xl font-bold text-gray-900">Penukaran Sampah</h1>
            <p className="text-xs text-emerald-600 font-medium">Buang.in</p>
          </div>
          
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pt-20 pb-24">
        <div className="max-w-md mx-auto space-y-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">♻️</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Setor Sampah Anda
              </h2>
              <p className="text-sm text-gray-600">
                Isi form di bawah untuk memulai penjemputan sampah
              </p>
            </div>
          </div>

          <FormInput 
            lat={lat} 
            lon={lon} 
            formData={formData} 
            updateFormData={updateFormData}
          />
          
          <LokasiSetorSampah lat={lat} lon={lon} />
          
          <TombolSetor onClick={handleSubmit} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PenukaranPage;