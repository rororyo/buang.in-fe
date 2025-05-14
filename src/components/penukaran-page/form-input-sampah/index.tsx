import React from "react";
import TombolFoto from "@/components/penukaran-page/tombol-foto";
import DropdownJenisSampah from "@/components/penukaran-page/drop-down-jenis-sampah";

const FormInput = () => {
    const [selectedTrash, setSelectedTrash] = React.useState<string | null>(null);
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
    </>
  );
};

export default FormInput;