'use client';
import api from "@/lib/api";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Trash2 } from "lucide-react";

interface TrashType {
  id: string;
  name: string;
}

interface DropdownJenisSampahProps {
  selectedTrashes: string[];
  setSelectedTrashes: (values: string[]) => void;
}

const DropdownJenisSampah: React.FC<DropdownJenisSampahProps> = ({
  selectedTrashes,
  setSelectedTrashes,
}) => {
  const [dropdownOptions, setDropdownOptions] = useState<TrashType[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("api/setor/trash-types");
        setDropdownOptions(response.data);
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDropdownOptions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCheckboxChange = (id: string) => {
    if (selectedTrashes.includes(id)) {
      setSelectedTrashes(selectedTrashes.filter((trashId) => trashId !== id));
    } else {
      setSelectedTrashes([...selectedTrashes, id]);
    }
  };

  const selectedNames = dropdownOptions
    .filter((item) => selectedTrashes.includes(item.id))
    .map((item) => item.name)
    .join(", ");

  const displayText = selectedNames || "Pilih jenis sampah";
  const isPlaceholder = !selectedNames;

  return (
    <div ref={dropdownRef} className="relative w-full">
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        <div className="flex items-center gap-2">
          <Trash2 size={16} className="text-emerald-600" />
          Jenis Sampah
        </div>
      </label>
      
      <div
        className={`
          relative w-full p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ease-in-out
          ${isDropdownOpen 
            ? 'border-emerald-500 bg-emerald-50 shadow-lg' 
            : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !isLoading && setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex items-center justify-between">
          <span className={`
            text-sm font-medium truncate pr-2
            ${isPlaceholder ? 'text-gray-500' : 'text-gray-900'}
          `}>
            {isLoading ? 'Memuat...' : displayText}
          </span>
          
          <div className="flex items-center gap-2">
            {selectedTrashes.length > 0 && (
              <span className="bg-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {selectedTrashes.length}
              </span>
            )}
            <ChevronDown 
              size={18} 
              className={`
                text-gray-600 transition-transform duration-200
                ${isDropdownOpen ? 'transform rotate-180' : ''}
              `}
            />
          </div>
        </div>
      </div>

      {isDropdownOpen && !isLoading && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-emerald-200 rounded-xl shadow-xl overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {dropdownOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Trash2 size={24} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Tidak ada jenis sampah tersedia</p>
              </div>
            ) : (
              dropdownOptions.map((item, index) => {
                const isSelected = selectedTrashes.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className={`
                      flex items-center p-4 cursor-pointer transition-all duration-150
                      ${isSelected 
                        ? 'bg-emerald-50 border-l-4 border-emerald-600' 
                        : 'hover:bg-gray-50 border-l-4 border-transparent'
                      }
                      ${index !== dropdownOptions.length - 1 ? 'border-b border-gray-100' : ''}
                    `}
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCheckboxChange(item.id)}
                        className="sr-only"
                      />
                      <div className={`
                        w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
                        ${isSelected 
                          ? 'bg-emerald-600 border-emerald-600' 
                          : 'bg-white border-gray-300 hover:border-emerald-400'
                        }
                      `}>
                        {isSelected && (
                          <Check size={14} className="text-white" />
                        )}
                      </div>
                    </div>
                    <span className={`
                      ml-3 text-sm font-medium
                      ${isSelected ? 'text-emerald-900' : 'text-gray-700'}
                    `}>
                      {item.name}
                    </span>
                  </label>
                );
              })
            )}
          </div>
          
          {selectedTrashes.length > 0 && (
            <div className="border-t border-gray-100 p-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  {selectedTrashes.length} jenis sampah dipilih
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTrashes([]);
                  }}
                  className="text-xs text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
                >
                  Hapus Semua
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownJenisSampah;