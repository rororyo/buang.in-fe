"use client";

import React, { useState } from "react";
import { FilterIcon, CheckIcon, XIcon, SearchIcon, EyeIcon, XCircleIcon } from "lucide-react";

const dummyData = [
  {
    id: 1,
    nama: "Budi Santoso",
    tanggal: "2024-06-10",
    review: "Sampah sudah dipilah dengan baik.",
    status: "pending",
    foto: "https://via.placeholder.com/100",
    berat: "2 kg",
    jenis: "Plastik",
    alamat: "Jl. Mawar No. 1",
    telepon: "081234567890",
  },
  {
    id: 2,
    nama: "Siti Aminah",
    tanggal: "2024-06-11",
    review: "Ada sedikit plastik campur.",
    status: "pending",
    foto: "https://via.placeholder.com/100",
    berat: "1.5 kg",
    jenis: "Kertas",
    alamat: "Jl. Melati No. 2",
    telepon: "081298765432",
  },
  {
    id: 3,
    nama: "Andi Wijaya",
    tanggal: "2024-06-09",
    review: "Sudah sesuai kriteria.",
    status: "pending",
    foto: "https://via.placeholder.com/100",
    berat: "3 kg",
    jenis: "Logam",
    alamat: "Jl. Kenanga No. 3",
    telepon: "081212345678",
  },
];

const AdminPage = () => {
  const [filterNama, setFilterNama] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [data, setData] = useState(dummyData);
  const [selected, setSelected] = useState<any>(null);

  const handleTerima = (id: number) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "accepted" } : item
      )
    );
  };

  const handleTolak = (id: number) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "rejected" } : item
      )
    );
  };

  const filteredData = data.filter(
    (item) =>
      item.nama.toLowerCase().includes(filterNama.toLowerCase()) &&
      item.tanggal.includes(filterTanggal)
  );

  return (
    <div className="flex flex-col items-center min-h-screen" style={{ backgroundColor: "#569490" }}>
      {/* Header Admin */}
      <div className="fixed w-full items-center justify-between p-4 bg-white shadow-md z-50" style={{ backgroundColor: "#235C58" }}>
        <h1 className="text-2xl font-bold text-black-500 text-center w-full">Nama Admin - Verifikasi Sampah</h1>
      </div>
      
      {/* Filter & Table */}
      <div className="w-full mt-20 max-w-4xl bg-white p-6 rounded-lg shadow-md mb-10">
        {/* Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 gap-2">
          <div className="flex items-center gap-2">
            <SearchIcon size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Cari nama user..."
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <FilterIcon size={18} className="text-gray-500" />
            <input
              type="date"
              value={filterTanggal}
              onChange={(e) => setFilterTanggal(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4">Nama User</th>
                <th className="py-2 px-4">Tanggal</th>
                <th className="py-2 px-4">Detail</th>
                <th className="py-2 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-400">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2 px-4">{item.nama}</td>
                    <td className="py-2 px-4">{item.tanggal}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => setSelected(item)}
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <EyeIcon size={16} /> Lihat Detail
                      </button>
                    </td>
                    <td className="py-2 px-4 flex gap-2 justify-center">
                      {item.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleTerima(item.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                          >
                            <CheckIcon size={16} /> Terima
                          </button>
                          <button
                            onClick={() => handleTolak(item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                          >
                            <XIcon size={16} /> Tolak
                          </button>
                        </>
                      ) : item.status === "accepted" ? (
                        <span className="text-green-600 font-semibold">Diterima</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Ditolak</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Review */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay transparan tanpa warna gelap */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(255,255,255,0.0)", pointerEvents: "auto" }}
            onClick={() => setSelected(null)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl z-10 flex flex-col md:flex-row gap-8 border-2 border-green-200">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 z-20"
              onClick={() => setSelected(null)}
            >
              <XCircleIcon size={28} />
            </button>
            <div className="flex flex-col items-center md:items-start md:w-1/3">
              <img
                src={selected.foto}
                alt="Foto Sampah"
                className="w-48 h-48 object-cover rounded-lg border mb-4"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-4 text-center md:text-left text-green-700">Detail Pengiriman Sampah</h2>
              <div className="space-y-2 text-base">
                <p><span className="font-semibold">Nama:</span> {selected.nama}</p>
                <p><span className="font-semibold">Tanggal:</span> {selected.tanggal}</p>
                <p><span className="font-semibold">Jenis:</span> {selected.jenis}</p>
                <p><span className="font-semibold">Berat:</span> {selected.berat}</p>
                <p><span className="font-semibold">Alamat:</span> {selected.alamat}</p>
                <p><span className="font-semibold">No. Telepon:</span> {selected.telepon}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;