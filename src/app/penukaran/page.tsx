"use client";

import React, { useState } from "react";
import Footer from "@/components/footer";
import { ChevronLeftIcon } from "lucide-react";
import FormInput from "@/components/penukaran-page/form-input-sampah";
import DropdownJenisSampah from "@/components/penukaran-page/drop-down-jenis-sampah";
import LokasiSetorSampah from "@/components/penukaran-page/lokasi-setor-sampah";
import TombolSetor from "@/components/penukaran-page/tombol-setor";
import TombolFoto from "@/components/penukaran-page/tombol-foto";
import { useUser } from "@/lib/context/UserContext";
import useGeolocation from "@/lib/hooks/useGeolocation";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const PenukaranPage = () => {
  const router = useRouter();
  const { lat, lon, error } = useGeolocation();
  const { user } = useUser();

  const [formData, setFormData] = useState<{
    nama: string;
    alamat: string;
    phone: string;
    pickupTime: string;
    selectedTrashes: any[];
    berat: number;
    selectedImage: any;
    selectedImagePreview: any;
    selectedTrashBank: any;
  }>({
    nama: "",
    alamat: "",
    phone: "",
    pickupTime: "",
    selectedTrashes: [],
    berat: 0,
    selectedImage: null,
    selectedImagePreview: null,
    selectedTrashBank: null,
  });

  const handleSubmit = async () => {
    try {
      const form = new FormData();
      form.append("name", formData.nama);
      form.append("address", formData.alamat);
      form.append("phone_number", formData.phone);
      form.append("pickup_time", formData.pickupTime);
      form.append("trash_type_ids", JSON.stringify(formData.selectedTrashes));
      form.append("total_weight", formData.berat.toString());
      form.append("status", "pending");
      form.append(
        "latitude",
        lat !== null && lat !== undefined ? lat.toString() : ""
      );
      form.append(
        "longitude",
        lon !== null && lon !== undefined ? lon.toString() : ""
      );
      form.append(
        "user_id",
        user !== null && user !== undefined ? user.id : ""
      );
      form.append("trash_bank_id", formData.selectedTrashBank?.id);
      if (formData.selectedImage) {
        form.append("image", formData.selectedImage);
      }

      await api.post("/api/setor", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Data berhasil dikirim!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error.response.data);
      alert("Gagal mengirim data.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {error && (
        <div className="mt-24 px-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Lokasi Diperlukan!</strong>
            <span className="block sm:inline ml-2">
              {error === "User denied Geolocation" || error.includes("denied")
                ? "Anda harus mengaktifkan lokasi untuk menggunakan fitur ini."
                : error}
            </span>
          </div>
        </div>
      )}

      {/* Tombol Back dan Judul */}
      <div
        className="fixed w-full items-center justify-between p-4 bg-white shadow-md"
        style={{ backgroundColor: "#569490" }}
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center w-full">
          Setor Sampah
        </h1>
      </div>
      <FormInput
        lat={lat}
        lon={lon}
        formData={formData}
        setFormData={setFormData}
      />
      <LokasiSetorSampah lat={lat} lon={lon} />
      <TombolSetor onClick={handleSubmit} />
      <Footer />
    </div>
  );
};

export default PenukaranPage;
