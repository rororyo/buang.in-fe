"use client";

import React, { useState, useEffect } from "react";
import {
  Filter,
  Check,
  X,
  Search,
  RefreshCw,
  ChevronLeftIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "@/lib/api";

interface RedeemRequest {
  id: string;
  user_id: string;
  total_points: number;
  transfer_method: string;
  account_number: string;
  bank_name: string | null;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    points: number;
    created_at: string;
  };
}

const RedeemPointsPage = () => {
  const [filterNama, setFilterNama] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [data, setData] = useState<RedeemRequest[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRedeemRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/point-exchange");
      setData(response.data);
    } catch (err) {
      setError("Gagal memuat data penukaran poin.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, status: "accepted" | "rejected") => {
    setProcessingId(id);
    try {
      await api.post(`/api/point-exchange/${id}?status=${status}`);
      toast.success(
        `Request berhasil di${status === "accepted" ? "setujui" : "tolak"}.`
      );
      setData((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status,
                user: {
                  ...item.user,
                  points:
                    status === "accepted"
                      ? item.user.points - item.total_points
                      : item.user.points,
                },
              }
            : item
        )
      );
    } catch (err) {
      toast.error("Gagal memproses permintaan. Poin pengguna tidak cukup.");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID");

  useEffect(() => {
    fetchRedeemRequests();
  }, [statusFilter]);

  const filteredData = data.filter((item) => {
    const matchName =
      !filterNama ||
      item.user.username.toLowerCase().includes(filterNama.toLowerCase());
    const matchDate = !filterTanggal || item.created_at.includes(filterTanggal);
    const matchStatus = !statusFilter || item.status === statusFilter;
    return matchName && matchDate && matchStatus;
  });

  return (
    <div className="flex flex-col items-center min-h-screen bg-emerald-300">
      <div className="fixed w-full items-center justify-between p-4 shadow-md z-50 bg-emerald-600">
        <button
          onClick={() => (window.location.href = "/admin")}
          className="absolute top-3 left-4 w-10 h-10 text-white rounded-full hover:opacity-70"
        >
          <ChevronLeftIcon size={20} stroke="white" />
        </button>
        <h1 className="text-2xl font-bold text-white text-center w-full">
          Buang.in - Verifikasi Penukaran Poin
        </h1>
      </div>

      <div className="w-full mt-20 max-w-6xl bg-white p-6 rounded-xl shadow-lg mb-10 text-black">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500">
              <X size={20} />
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Cari nama pengguna..."
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <input
              type="date"
              value={filterTanggal}
              onChange={(e) => setFilterTanggal(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="accepted">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
          <button
            onClick={fetchRedeemRequests}
            disabled={loading}
            className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Muat Ulang
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-emerald-100 text-emerald-900">
                <th className="py-2 px-4">Nama</th>
                <th className="py-2 px-4">Saldo</th>
                <th className="py-2 px-4">Ditukar</th>
                <th className="py-2 px-4">Metode</th>
                <th className="py-2 px-4">Rekening</th>
                <th className="py-2 px-4">Tanggal</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-400">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2 px-4">{item.user.username}</td>
                    <td className="py-2 px-4">{item.user.points}</td>
                    <td className="py-2 px-4">{item.total_points}</td>
                    <td className="py-2 px-4">{item.transfer_method}</td>
                    <td className="py-2 px-4">{item.account_number}</td>
                    <td className="py-2 px-4">{formatDate(item.created_at)}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status === "pending"
                          ? "Menunggu"
                          : item.status === "accepted"
                          ? "Selesai"
                          : "Ditolak"}
                      </span>
                    </td>
                    <td className="py-2 px-4 flex gap-2">
                      {item.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleAction(item.id, "accepted")}
                            disabled={processingId === item.id}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded disabled:opacity-50"
                          >
                            {processingId === item.id ? (
                              <RefreshCw size={16} className="animate-spin" />
                            ) : (
                              <Check size={16} />
                            )}{" "}
                            Terima
                          </button>
                          <button
                            onClick={() => handleAction(item.id, "rejected")}
                            disabled={processingId === item.id}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                          >
                            {processingId === item.id ? (
                              <RefreshCw size={16} className="animate-spin" />
                            ) : (
                              <X size={16} />
                            )}{" "}
                            Tolak
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RedeemPointsPage;
