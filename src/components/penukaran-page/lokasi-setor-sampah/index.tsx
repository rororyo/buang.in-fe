import React from "react";

const LokasiSetorSampah = () => {
  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full bg-white p-6 rounded-lg">
        <h2
          className="text-lg font-bold mb-4 text-center"
          style={{ color: "#569490" }}
        >
          Pilih Lokasi Setor Sampah
        </h2>
        <div className="w-full h-40 border border-gray-300 rounded-md">
          {/* Div kosong untuk map */}
        </div>
      </div>
    </div>
  );
};

export default LokasiSetorSampah;