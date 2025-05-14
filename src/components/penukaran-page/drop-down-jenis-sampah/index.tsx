import React, { useState, useRef, useEffect } from "react";

interface DropdownJenisSampahProps {
  selectedTrash: string | null;
  setSelectedTrash: (value: string | null) => void;
}

const DropdownJenisSampah: React.FC<DropdownJenisSampahProps> = ({ selectedTrash, setSelectedTrash }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Menutup dropdown jika pengguna mengklik di luar dropdown
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

  return (
    <div className="mb-4" ref={dropdownRef}>
      <label htmlFor="jenis-sampah" className="block text-sm font-medium text-black">
        Jenis Sampah
      </label>
      <div
        className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        style={{ backgroundColor: "#569490" }}
      >
        {selectedTrash || "Pilih jenis sampah"}
      </div>
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {["Kertas", "Plastik", "Kaca", "Besi"].map((item) => (
            <div
              key={item}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedTrash(item);
                setIsDropdownOpen(false);
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownJenisSampah;