import React, { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";

interface TombolSetorProps {
  onClick: () => Promise<void> | void;
}

const TombolSetor: React.FC<TombolSetorProps> = ({ onClick }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Submit Button */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Siap untuk Disetor?
          </h3>
          <p className="text-sm text-gray-600">
            Pastikan semua data sudah benar sebelum mengirim permintaan penjemputan
          </p>
        </div>

        <button
          onClick={handleClick}
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-lg font-bold text-lg text-white transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 transform hover:-translate-y-0.5"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              <span>Mengirim Permintaan...</span>
            </>
          ) : (
            <>
              <Send size={24} />
              <span>Setor Sampah Sekarang</span>
            </>
          )}
        </button>
      </div>

      {/* Benefits Card */}
      <div className="mt-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
        <h4 className="font-semibold text-emerald-900 mb-2 text-center">
          💚 Manfaat Setelah Penyetoran
        </h4>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white/60 rounded-lg p-3">
            <div className="text-2xl mb-1">🏆</div>
            <p className="text-xs font-medium text-emerald-800">Dapatkan Poin</p>
          </div>
          <div className="bg-white/60 rounded-lg p-3">
            <div className="text-2xl mb-1">💰</div>
            <p className="text-xs font-medium text-emerald-800">Tukar Uang</p>
          </div>
          <div className="bg-white/60 rounded-lg p-3">
            <div className="text-2xl mb-1">🌱</div>
            <p className="text-xs font-medium text-emerald-800">Bantu Bumi</p>
          </div>
        </div>
      </div>

      {/* Tips Card */}
      <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <span>💡</span>
          Tips Penjemputan
        </h4>
        <ul className="space-y-1 text-xs text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Pastikan Anda berada di lokasi saat waktu penjemputan</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Siapkan sampah dalam kondisi bersih dan terpisah</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Pastikan nomor telepon aktif untuk koordinasi</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TombolSetor;