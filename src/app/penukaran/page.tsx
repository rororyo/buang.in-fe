"use client";

import React, { useState } from "react";
import Footer from "@/components/footer";
import { ChevronLeftIcon } from "lucide-react";
import FormInput from "@/components/penukaran-page/form-input-sampah";
import DropdownJenisSampah from "@/components/penukaran-page/drop-down-jenis-sampah";
import LokasiSetorSampah from "@/components/penukaran-page/lokasi-setor-sampah";
import TombolSetor from "@/components/penukaran-page/tombol-setor";
import TombolFoto from "@/components/penukaran-page/tombol-foto";

const PenukaranPage = () => {
  const [selectedTrash, setSelectedTrash] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Tombol Back dan Judul */}
      <div className="fixed w-full items-center justify-between p-4 bg-white shadow-md" style={{ backgroundColor: "#235C58" }}>
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="absolute top-3 left-4 flex items-center justify-center w-10 h-10 text-white bg-black rounded-full hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ChevronLeftIcon size={20} />
        </button>
        <h1 className="text-2xl font-bold text-black-500 text-center w-full">Setor Sampah</h1>
      </div>

      {/* Form Input */}
      <div className="flex flex-col items-center p-6 mt-10">
        <div className="w-full p-6 rounded-lg">
          <FormInput />
        </div>
      </div>

      {/* Lokasi Setor Sampah */}
      <LokasiSetorSampah />

      {/* Tombol Setor */}
      <TombolSetor />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PenukaranPage;