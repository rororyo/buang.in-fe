'use client';

import api from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

interface Kecamatan {
  id: string;
  name: string;
}

interface DropdownKecamatanProps {
  selectedKecamatanId: string;
  setSelectedKecamatanId: (id: string) => void;
}

const DropdownKecamatan: React.FC<DropdownKecamatanProps> = ({
  selectedKecamatanId,
  setSelectedKecamatanId,
}) => {
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectedKecamatan = kecamatanList.find(k => k.id === selectedKecamatanId)?.name;

  useEffect(() => {
    const fetchKecamatan = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/api/setor/sub-districts'); // ganti endpoint ini nanti
        setKecamatanList(response.data);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchKecamatan();
  }, []);

  return (
    <div className="relative w-full">
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-emerald-600" />
          Kecamatan
        </div>
      </label>

      <div
        className={`w-full p-4 border-2 rounded-xl cursor-pointer transition-all
          ${isOpen ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white hover:border-emerald-300'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !isLoading && setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${!selectedKecamatan ? 'text-gray-500' : 'text-gray-900'}`}>
            {isLoading ? 'Memuat...' : selectedKecamatan || 'Pilih kecamatan'}
          </span>
          <ChevronDown
            size={18}
            className={`text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

  {isOpen && !isLoading && (
    <div className="absolute z-40 mt-2 w-full bg-white border-2 border-emerald-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">

          {kecamatanList.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Tidak ada kecamatan tersedia</div>
          ) : (
            kecamatanList.map((k) => (
              <div
                key={k.id}
                onClick={() => {
                  setSelectedKecamatanId(k.id);
                  setIsOpen(false);
                }}
                className={`p-4 text-sm cursor-pointer hover:bg-emerald-50 
                  ${k.id === selectedKecamatanId ? 'bg-emerald-50 font-semibold text-emerald-800' : 'text-gray-700'}`}
              >
                {k.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownKecamatan;
